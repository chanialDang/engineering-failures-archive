import logging

from fastapi import FastAPI
from dotenv import load_dotenv
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger(__name__)

load_dotenv()

from limiter import limiter
from middleware.cors import configure_cors
from routes.chat import router as chat_router
from routes.settings import router as settings_router

app = FastAPI(title="Engineering Failures Archive")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

configure_cors(app)

app.include_router(chat_router, prefix="/api")
app.include_router(settings_router, prefix="/api")


@app.on_event("startup")
async def startup():
    logger.info("App starting — testing Supabase connectivity")
    try:
        from db.supabase import ping
        ping()
        logger.info("Supabase connection OK")
    except Exception:
        logger.exception("Supabase connection failed on startup")


@app.get("/health")
async def health():
    sb_ok = False
    try:
        from db.supabase import ping
        sb_ok = ping()
    except Exception:
        logger.exception("Health check: Supabase ping failed")
    return {"status": "ok", "supabase": sb_ok}
