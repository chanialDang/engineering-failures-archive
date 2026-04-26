import os
from fastapi.middleware.cors import CORSMiddleware


# CORS policy
#
# Allowed origins are read from the ALLOWED_ORIGINS environment variable —
# a comma-separated list of fully-qualified origins, e.g.:
#
#   ALLOWED_ORIGINS=https://efa.vercel.app,https://www.engineeringfailures.org
#
# In production (Railway), set this env var to the Vercel frontend domain(s).
# In local development, the variable can be omitted; it falls back to
# http://localhost:3000, which covers the typical `python -m http.server` setup.
#
# Nothing is hardcoded: the fallback is intentionally a localhost address so
# that a misconfigured production deploy (missing env var) will simply break
# cross-origin requests rather than silently open the API to the public.
#
# What happens when a request comes from an unlisted origin:
#   - The browser sends a preflight OPTIONS request; FastAPI's CORSMiddleware
#     responds without Access-Control-Allow-Origin, so the browser blocks the
#     actual request and the client sees a CORS error.
#   - Non-preflight requests (same-origin, server-to-server, curl) are not
#     affected by CORS and reach the routes normally — CORS is a browser
#     enforcement mechanism, not a firewall.
#
# Allowed methods are intentionally restricted to GET and POST — the only
# verbs the frontend uses. PUT, DELETE, PATCH, etc. are not exposed.
def configure_cors(app):
    raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    origins = [o.strip() for o in raw.split(",")]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )
