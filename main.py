import hmac
import os
from functools import wraps
from pathlib import Path

from flask import Flask, Response, request, send_from_directory

DOCS_DIR = Path(__file__).parent / "docs"
USERNAME = os.environ["BASIC_AUTH_USER"]
PASSWORD = os.environ["BASIC_AUTH_PASS"]

app = Flask(__name__)


def _check(user: str, pw: str) -> bool:
    return hmac.compare_digest(user, USERNAME) and hmac.compare_digest(pw, PASSWORD)


def requires_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.authorization
        if not auth or not _check(auth.username or "", auth.password or ""):
            return Response(
                "Authentication required.",
                401,
                {"WWW-Authenticate": 'Basic realm="Oliviata Catalog"'},
            )
        return f(*args, **kwargs)

    return wrapper


@app.route("/")
@requires_auth
def index():
    return send_from_directory(DOCS_DIR, "index.html")


@app.route("/<path:path>")
@requires_auth
def static_files(path: str):
    target = (DOCS_DIR / path).resolve()
    if not str(target).startswith(str(DOCS_DIR.resolve())):
        return Response("Not found", 404)
    if target.is_dir():
        target = target / "index.html"
    if not target.is_file():
        # Allow extension-less URLs to resolve to .html
        html_candidate = DOCS_DIR / f"{path}.html"
        if html_candidate.is_file():
            target = html_candidate
        else:
            return Response("Not found", 404)
    return send_from_directory(DOCS_DIR, str(target.relative_to(DOCS_DIR)))


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
