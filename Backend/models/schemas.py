from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


class ChatResponse(BaseModel):
    response: str


class SettingsRequest(BaseModel):
    key: str
    value: str


class SettingsResponse(BaseModel):
    key: str
    value: str
