import os
from fastapi.middleware.cors import CORSMiddleware


# Attach CORS middleware — reads allowed origins from env, falls back to localhost:3000
def configure_cors(app):
    raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    origins = [o.strip() for o in raw.split(",")]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )
