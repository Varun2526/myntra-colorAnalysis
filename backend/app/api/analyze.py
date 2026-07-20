from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import get_settings
from app.models.schemas import AnalysisResponse
from app.services.analysis import analyze_image
from app.services.face_features import NoFaceDetectedError

router = APIRouter()

ACCEPTED_CONTENT_TYPES = {"image/jpeg", "image/png"}


@router.post("/analyze", response_model=AnalysisResponse)
def analyze(image: UploadFile = File(...)) -> AnalysisResponse:
    if image.content_type not in ACCEPTED_CONTENT_TYPES:
        raise HTTPException(
            status_code=415,
            detail="Only JPEG and PNG images are supported.",
        )

    image_bytes = image.file.read(get_settings().max_upload_bytes + 1)
    if len(image_bytes) > get_settings().max_upload_bytes:
        raise HTTPException(status_code=413, detail="Image is too large (max 10 MB).")

    try:
        return analyze_image(image_bytes)
    except NoFaceDetectedError:
        raise HTTPException(
            status_code=422,
            detail="No face detected. Please upload a clear, front-facing selfie.",
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Could not read the image file.")
