from fastapi import APIRouter
from pydantic import BaseModel
from services.parser_service import extract_job_info
from services.insight_service import generate_insights

router = APIRouter()

class JobTextRequest(BaseModel):
    text: str

class InsightRequest(BaseModel):
    shortlist_json: str
    cdrview_json: str

@router.post("/parse-job")
def parse_job(request: JobTextRequest):
    result = extract_job_info(request.text)
    return {"data": result}

@router.post("/insights")
def get_insights(request: InsightRequest):
    result = generate_insights(request.shortlist_json, request.cdrview_json)
    return {"data": result}
