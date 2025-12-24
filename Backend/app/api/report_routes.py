
from fastapi import APIRouter, HTTPException
from app.schemas.report_schema import ReportInput, ReportOutput, RevisionInput
from app.services.report_service import create_report, revise_report_with_history

router = APIRouter()

@router.post("/generate", response_model=ReportOutput)
async def generate_report_endpoint(report_data: ReportInput):
    try:
        sessions_list = [s.model_dump() for s in report_data.sessions]
        result_text = create_report(report_data.patient_name, sessions_list)
        return {"report_text": result_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/revise", response_model=ReportOutput)
async def revise_report_endpoint(rev_data: RevisionInput):
    try:
      
        result_text = revise_report_with_history(
            rev_data.patient_name, 
            rev_data.history, 
            rev_data.new_instructions
        )
        return {"report_text": result_text}
    except Exception as e:
        print(f"Error in revise_report: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))