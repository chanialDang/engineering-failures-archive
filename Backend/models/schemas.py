from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: list[dict] = Field(default_factory=list)


class ChatResponse(BaseModel):
    response: str


class SettingsRequest(BaseModel):
    key: str = Field(..., min_length=1, max_length=256)
    value: str = Field(..., max_length=4096)


class SettingsResponse(BaseModel):
    key: str
    value: str
