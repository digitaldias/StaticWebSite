"""Snapshot of what drives traffic to digitaldias.com, for picking new post ideas.

Prints aggregates only: readers this week vs last (Cloudflare Web Analytics), top paths and
referrers, AI agent fetches per post (last 7 days), Google search queries and pages
(Search Console, last 28 days), and what is trending outside the site (Hacker News and Dev.to,
last 7 days, one short line per item). Reads CLOUDFLARE_API_TOKEN from .env and gsc-key.json.
Run from the repo root: `just stats`.
"""
import collections
import datetime as dt
import json
import pathlib
import re
import subprocess
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
HOSTS = '["www.digitaldias.com","digitaldias.com"]'
AGENT = re.compile(r"ChatGPT-User|Claude-User|Perplexity-User|OAI-SearchBot|PerplexityBot", re.I)
POST = re.compile(r"^/(nb/)?blog/\d{4}-\d{2}-\d{2}-[^/]+/$")


def request(url, body=None, headers=None, form=False):
    data = None
    if body is not None:
        data = urllib.parse.urlencode(body).encode() if form else json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, headers=headers or {})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)


def cloudflare():
    env = (ROOT / ".env").read_text(encoding="utf-8")
    token = re.search(r"CLOUDFLARE_API_TOKEN\s*=\s*\"?([^\"\r\n]+)", env).group(1)
    auth = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    zone = request("https://api.cloudflare.com/client/v4/zones?name=digitaldias.com", headers=auth)["result"][0]
    today = dt.date.today()
    week = (today - dt.timedelta(days=7)).isoformat()
    fortnight = (today - dt.timedelta(days=14)).isoformat()
    query = f"""{{ viewer {{
      zones(filter: {{zoneTag: "{zone['id']}"}}) {{
        agents: httpRequestsAdaptiveGroups(limit: 5000, filter: {{date_geq: "{week}", requestSource: "eyeball", edgeResponseStatus: 200, edgeResponseContentTypeName: "html"}}) {{ count dimensions {{ userAgent clientRequestPath }} }}
      }}
      accounts(filter: {{accountTag: "{zone['account']['id']}"}}) {{
        now: rumPageloadEventsAdaptiveGroups(limit: 1, filter: {{date_geq: "{week}", requestHost_in: {HOSTS}}}) {{ count sum {{ visits }} }}
        before: rumPageloadEventsAdaptiveGroups(limit: 1, filter: {{date_geq: "{fortnight}", date_lt: "{week}", requestHost_in: {HOSTS}}}) {{ count sum {{ visits }} }}
        paths: rumPageloadEventsAdaptiveGroups(limit: 15, filter: {{date_geq: "{week}", requestHost_in: {HOSTS}}}, orderBy: [count_DESC]) {{ count dimensions {{ requestPath }} }}
        refs: rumPageloadEventsAdaptiveGroups(limit: 15, filter: {{date_geq: "{week}", requestHost_in: {HOSTS}}}, orderBy: [count_DESC]) {{ count dimensions {{ refererHost }} }}
        moves: rumPageloadEventsAdaptiveGroups(limit: 40, filter: {{date_geq: "{week}", requestHost_in: {HOSTS}, refererHost_in: {HOSTS}}}, orderBy: [count_DESC]) {{ count dimensions {{ refererPath requestPath }} }}
        devices: rumPageloadEventsAdaptiveGroups(limit: 10, filter: {{date_geq: "{week}", requestHost_in: {HOSTS}}}, orderBy: [count_DESC]) {{ count dimensions {{ countryName deviceType }} }}
      }} }} }}"""
    answer = request("https://api.cloudflare.com/client/v4/graphql", {"query": query}, auth)
    if answer.get("errors"):
        raise SystemExit(f"Cloudflare: {answer['errors']}")
    zones, accounts = answer["data"]["viewer"]["zones"][0], answer["data"]["viewer"]["accounts"][0]

    def total(rows):
        return {"pageloads": sum(r["count"] for r in rows), "visits": sum(r["sum"]["visits"] for r in rows)}

    agents = collections.Counter()
    for row in zones["agents"]:
        path = row["dimensions"]["clientRequestPath"]
        if AGENT.search(row["dimensions"]["userAgent"]) and POST.match(path):
            agents[path] += row["count"]
    return {
        "readers_7d": total(accounts["now"]),
        "readers_prev_7d": total(accounts["before"]),
        "top_paths_7d": {r["dimensions"]["requestPath"]: r["count"] for r in accounts["paths"]},
        "referrers_7d": {(r["dimensions"]["refererHost"] or "(direct)"): r["count"] for r in accounts["refs"]},
        "ai_agent_fetches_per_post_7d": dict(agents.most_common(15)),
        "navigation_7d": [f"{r['dimensions']['refererPath']} -> {r['dimensions']['requestPath']}: {r['count']}"
                          for r in accounts["moves"] if not is_language_switch(r["dimensions"])][:20],
        "country_device_7d": {f"{r['dimensions']['countryName']} {r['dimensions']['deviceType']}": r["count"]
                              for r in accounts["devices"]},
    }


def is_language_switch(move):
    """lang.js redirects to the stored language before first paint, so / -> /nb/ is not a reader's click."""
    return re.sub(r"^/nb/", "/", move["refererPath"]) == re.sub(r"^/nb/", "/", move["requestPath"])


def google():
    key = ROOT / "gsc-key.json"
    if not key.exists():
        return {"note": "no gsc-key.json"}
    assertion = subprocess.run(["node", "scripts/gsc-assertion.mjs", str(key)], cwd=ROOT,
                               capture_output=True, text=True, check=True).stdout.strip()
    token = request("https://oauth2.googleapis.com/token", {
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": assertion}, form=True)["access_token"]
    url = "https://www.googleapis.com/webmasters/v3/sites/" + urllib.parse.quote("sc-domain:digitaldias.com", safe="") + "/searchAnalytics/query"
    auth = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    end = dt.date.today() - dt.timedelta(days=2)
    start = end - dt.timedelta(days=27)

    def top(dimension):
        rows = request(url, {"startDate": start.isoformat(), "endDate": end.isoformat(),
                             "dimensions": [dimension], "rowLimit": 500}, auth).get("rows", [])
        rows.sort(key=lambda r: (r["clicks"], r["impressions"]), reverse=True)
        return [{"key": re.sub(r"^https://(www\.)?digitaldias\.com", "", r["keys"][0]), "clicks": r["clicks"],
                 "impressions": r["impressions"], "position": round(r["position"], 1)} for r in rows[:20]]

    return {"window": f"{start}..{end}", "queries": top("query"), "pages": top("page")}


TOPICS = ["claude code", "local llm", "ollama", "azure", ".net", "ai agents"]
DEVTO_TAGS = ["ai", "claude", "dotnet", "azure", "llm"]


def hacker_news_items():
    since = int((dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=7)).timestamp())
    seen = {}
    for topic in TOPICS:
        query = urllib.parse.urlencode({"query": topic, "tags": "story", "hitsPerPage": 8,
                                        "numericFilters": f"created_at_i>{since},points>40"})
        for hit in request(f"https://hn.algolia.com/api/v1/search?{query}")["hits"]:
            # An Ask HN or Show HN post has no url: the discussion is then the post.
            url = hit.get("url") or f"https://news.ycombinator.com/item?id={hit['objectID']}"
            seen[hit["objectID"]] = {"score": hit["points"], "comments": hit["num_comments"], "title": hit["title"], "url": url}
    return sorted(seen.values(), key=lambda i: (i["score"], i["comments"], i["title"]), reverse=True)[:12]


def hacker_news():
    return [f"{i['score']}p {i['comments']}c {i['title']}" for i in hacker_news_items()]


def devto_items():
    seen = {}
    for tag in DEVTO_TAGS:
        query = urllib.parse.urlencode({"tag": tag, "top": 7, "per_page": 6})
        for a in request(f"https://dev.to/api/articles?{query}", headers={"User-Agent": "site-stats"}):
            seen[a["id"]] = {"score": a["positive_reactions_count"], "comments": a["comments_count"], "title": a["title"], "url": a["url"]}
    return sorted(seen.values(), key=lambda i: (i["score"], i["comments"], i["title"]), reverse=True)[:12]


def devto():
    return [f"{i['score']}r {i['comments']}c {i['title']}" for i in devto_items()]


def safely(fetch):
    try:
        return fetch()
    except Exception as error:
        return f"unavailable: {error}"


if __name__ == "__main__":
    print(json.dumps({"cloudflare": cloudflare(), "google": google(), "hacker_news_7d": safely(hacker_news),
                      "devto_7d": safely(devto)}, ensure_ascii=False, indent=1))
