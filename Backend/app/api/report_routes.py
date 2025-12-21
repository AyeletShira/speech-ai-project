# from fastapi import APIRouter, HTTPException
# from app.schemas.report_schema import ReportInput, ReportOutput
# from app.services.report_service import create_report

# router = APIRouter()

# @router.post("/generate", response_model=ReportOutput)
# async def generate_report_endpoint(report_data: ReportInput):
#     try:
#         # כאן התיקון: אנחנו מפרקים את המידע ל-שם ול-סשנים
#         # אנחנו הופכים את הסשנים לרשימה של מילונים (dict) כדי שהשירות יבין אותם
#         sessions_list = [s.model_dump() for s in report_data.sessions]
        
#         result_text = create_report(report_data.patient_name, sessions_list)
        
#         # מחזירים אובייקט שתואם ל-ReportOutput (שמצפה לשדה report_text)
#         return {"report_text": result_text}
        
#     except Exception as e:
#         print(f"Error in generate_report: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))

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

# הנתיב החדש לצ'אט/תיקונים
@router.post("/revise", response_model=ReportOutput)
async def revise_report_endpoint(rev_data: RevisionInput):
    try:
        # שליחה לסרוויס שיודע לטפל בהיסטוריה
        result_text = revise_report_with_history(
            rev_data.patient_name, 
            rev_data.history, 
            rev_data.new_instructions
        )
        return {"report_text": result_text}
    except Exception as e:
        print(f"Error in revise_report: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))