"""Print Pedro's most-played Spotify artists of the last four weeks, as suggestions for the Now / Listening field.

Uses the Spotify Web API (GET /v1/me/top/artists, time_range=short_term, the shortest window Spotify offers)
with the Authorization Code + PKCE flow, so no client secret is involved.

One-time setup:
  1. Create an app at https://developer.spotify.com/dashboard. Redirect URI:
     http://127.0.0.1:8765/callback. API: Web API.
  2. Set the user environment variable SPOTIFY_CLIENT_ID to the app's Client ID (not a secret).
  3. Run `just listening`. The first run opens the browser once to grant the user-top-read scope.

The refresh token is cached outside the repo, in ~/.config/digitaldias/spotify-token.json.
Output: the top five artists, one per line.
"""

import base64
import hashlib
import http.server
import json
import os
import secrets
import sys
import urllib.error
import urllib.parse
import urllib.request
import webbrowser
from pathlib import Path

ACCOUNTS = "https://accounts.spotify.com"
API = "https://api.spotify.com/v1"
REDIRECT_PORT = 8765
REDIRECT_URI = f"http://127.0.0.1:{REDIRECT_PORT}/callback"
SCOPE = "user-top-read"
TOKEN_FILE = Path.home() / ".config" / "digitaldias" / "spotify-token.json"


def post_form(url: str, data: dict) -> dict:
    body = urllib.parse.urlencode(data).encode()
    request = urllib.request.Request(url, data=body, headers={"Content-Type": "application/x-www-form-urlencoded"})
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.load(response)


def wait_for_callback() -> dict:
    """Serve one request on the redirect URI and return its query parameters."""
    received: dict = {}

    class Callback(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            received.update({key: values[0] for key, values in query.items()})
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write("Spotify access granted. You can close this tab.".encode())

        def log_message(self, *args):
            pass

    with http.server.HTTPServer(("127.0.0.1", REDIRECT_PORT), Callback) as server:
        server.handle_request()
    return received


def authorize(client_id: str) -> dict:
    verifier = secrets.token_urlsafe(64)
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b"=").decode()
    state = secrets.token_urlsafe(16)
    webbrowser.open(f"{ACCOUNTS}/authorize?" + urllib.parse.urlencode({
        "response_type": "code", "client_id": client_id, "scope": SCOPE, "redirect_uri": REDIRECT_URI,
        "code_challenge_method": "S256", "code_challenge": challenge, "state": state,
    }))
    print("Waiting for Spotify consent in the browser...", file=sys.stderr)
    callback = wait_for_callback()
    if callback.get("state") != state or "code" not in callback:
        sys.exit(f"Spotify authorization failed: {callback.get('error', 'no code returned')}")
    return post_form(f"{ACCOUNTS}/api/token", {
        "grant_type": "authorization_code", "code": callback["code"], "redirect_uri": REDIRECT_URI,
        "client_id": client_id, "code_verifier": verifier,
    })


def access_token(client_id: str) -> str:
    token = None
    if TOKEN_FILE.exists():
        refresh = json.loads(TOKEN_FILE.read_text(encoding="utf-8"))["refresh_token"]
        try:
            token = post_form(f"{ACCOUNTS}/api/token", {
                "grant_type": "refresh_token", "refresh_token": refresh, "client_id": client_id,
            })
            token.setdefault("refresh_token", refresh)
        except urllib.error.HTTPError:
            token = None  # Revoked or expired: ask for consent again
    token = token or authorize(client_id)
    TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
    TOKEN_FILE.write_text(json.dumps({"refresh_token": token["refresh_token"]}), encoding="utf-8")
    return token["access_token"]


def top(kind: str, token: str, limit: int) -> list:
    request = urllib.request.Request(
        f"{API}/me/top/{kind}?time_range=short_term&limit={limit}",
        headers={"Authorization": f"Bearer {token}"},
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.load(response)["items"]


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    client_id = os.environ.get("SPOTIFY_CLIENT_ID")
    if not client_id:
        sys.exit("SPOTIFY_CLIENT_ID is not set. See the one-time setup at the top of scripts/spotify-top.py.")
    token = access_token(client_id)

    for artist in top("artists", token, 5):
        print(artist["name"])


if __name__ == "__main__":
    main()
