from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()

from middleware.cors import configure_cors
from routes.chat import router as chat_router
from routes.settings import router as settings_router

app = FastAPI(title="Engineering Failures Archive")

configure_cors(app)

app.include_router(chat_router, prefix="/api")
app.include_router(settings_router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}
