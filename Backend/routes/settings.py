import logging

from fastapi import APIRouter, HTTPException

from models.schemas import SettingsRequest, SettingsResponse
from db.supabase import get_setting, save_setting

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/settings/{key}", response_model=SettingsResponse)
async def read_setting(key: str):
    try:
        value = get_setting(key)
    except Exception:
        logger.exception("Failed to read setting: %s", key)
        raise HTTPException(status_code=500, detail="Failed to read setting")
    if value is None:
        raise HTTPException(status_code=404, detail=f"Setting '{key}' not found")
    return SettingsResponse(key=key, value=value)


@router.post("/settings", response_model=SettingsResponse)
async def write_setting(req: SettingsRequest):
    try:
        save_setting(req.key, req.value)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception:
        logger.exception("Failed to write setting: %s", req.key)
        raise HTTPException(status_code=500, detail="Failed to write setting")
    return SettingsResponse(key=req.key, value=req.value)
