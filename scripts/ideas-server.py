"""Local page for the blog post ideas in ideas/ideas.json (`just ideas`, http://localhost:8765/).

Serves the page and the Sea Glass tokens, and takes POST /status {"id", "status"} so a button on the
page can mark an idea as avvist, skriver or skrevet. Rejected ideas stay in the file, so Claude
does not suggest them again, and the page lists them at the bottom. GET /trends returns the Hacker News and Dev.to
items (score, comments, title, url) from site-stats.py, cached for an hour. Binds to 127.0.0.1 only.
"""
import importlib.util
import json
import pathlib
import sys
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = pathlib.Path(__file__).resolve().parent.parent
IDEAS = ROOT / "ideas" / "ideas.json"
FILES = {
    "/": (ROOT / "ideas" / "index.html", "text/html; charset=utf-8"),
    "/tokens.css": (ROOT / "src" / "assets" / "css" / "tokens.css", "text/css; charset=utf-8"),
    "/ideas.json": (IDEAS, "application/json; charset=utf-8"),
}
STATUSES = {"ny", "skriver", "skrevet", "avvist"}
TRENDS_TTL = 3600
trends_cache = {"at": 0, "body": b""}


def trends():
    if time.time() - trends_cache["at"] > TRENDS_TTL:
        spec = importlib.util.spec_from_file_location("site_stats", ROOT / "scripts" / "site-stats.py")
        stats = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(stats)
        body = {"hacker_news": stats.safely(stats.hacker_news_items), "devto": stats.safely(stats.devto_items)}
        trends_cache.update(at=time.time(), body=json.dumps(body, ensure_ascii=False).encode("utf-8"))
    return trends_cache["body"]


class Handler(BaseHTTPRequestHandler):
    def send(self, code, body=b"", kind="text/plain; charset=utf-8"):
        self.send_response(code)
        self.send_header("Content-Type", kind)
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/trends":
            return self.send(200, trends(), "application/json; charset=utf-8")
        if self.path not in FILES:
            return self.send(404, b"not found")
        path, kind = FILES[self.path]
        self.send(200, path.read_bytes(), kind)

    def do_POST(self):
        if self.path != "/status":
            return self.send(404, b"not found")
        change = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        if change.get("status") not in STATUSES:
            return self.send(400, b"unknown status")
        ideas = json.loads(IDEAS.read_text(encoding="utf-8"))
        idea = next((i for i in ideas if i["id"] == change.get("id")), None)
        if idea is None:
            return self.send(404, b"unknown id")
        idea["status"] = change["status"]
        IDEAS.write_text(json.dumps(ideas, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        self.send(204)

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    print(f"Forslagslisten: http://localhost:{port}/  (Ctrl+C stopper)")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
