from fastapi import APIRouter

from models.schemas import SettingsRequest, SettingsResponse
from db.supabase import get_setting, save_setting

router = APIRouter()


@router.get("/settings/{key}", response_model=SettingsResponse)
async def read_setting(key: str):
    try:
        value = get_setting(key)
        if value is None:
            return SettingsResponse(key=key, value="")
        return SettingsResponse(key=key, value=value)
    except Exception:
        return SettingsResponse(key=key, value="")


@router.post("/settings", response_model=SettingsResponse)
async def write_setting(req: SettingsRequest):
    try:
        save_setting(req.key, req.value)
        return SettingsResponse(key=req.key, value=req.value)
    except Exception:
        return SettingsResponse(key=req.key, value="")
