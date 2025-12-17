from fastapi import APIRouter
from app.schemas.report_schema import ReportInput, ReportOutput
from app.services.report_service import create_report

router = APIRouter()

@router.post("/generate", response_model=ReportOutput)
async def generate_report_endpoint(report_data: ReportInput):
    return create_report(report_data)
