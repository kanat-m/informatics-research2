from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db import get_session

from . import service
from .models import Assessment
from .schemas import AssessmentCreate, AssessmentOut, AssessmentUpdate

router = APIRouter(prefix="/assessments", tags=["assessments"])


def get_or_404(
    assessment_id: int, session: Session = Depends(get_session)
) -> Assessment:
    """Жазбаны ID бойынша алу немесе 404 қайтару."""
    assessment = service.get_assessment(session, assessment_id)
    if assessment is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Assessment not found")
    return assessment


@router.get("", response_model=list[AssessmentOut])
def list_assessments(
    q: str | None = Query(default=None, max_length=200),
    subject: str | None = Query(default=None, max_length=100),
    class_name: str | None = Query(default=None, max_length=20),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_session),
):
    """Тізімді алу: іздеу, сүзгілеу, пагинация."""
    return service.list_assessments(session, q, subject, class_name, limit, offset)


@router.get("/semantic", response_model=list[AssessmentOut])
def semantic_search(
    q: str = Query(..., min_length=1, max_length=500),
    limit: int = Query(default=10, ge=1, le=50),
    session: Session = Depends(get_session),
):
    """Мағына бойынша іздеу (pgvector)."""
    return service.semantic_search(session, q, limit)


@router.get("/{assessment_id}", response_model=AssessmentOut)
def read_assessment(assessment: Assessment = Depends(get_or_404)):
    """Бір жазбаны ID бойынша алу."""
    return assessment


@router.post("", response_model=AssessmentOut, status_code=status.HTTP_201_CREATED)
def create_assessment(
    data: AssessmentCreate, session: Session = Depends(get_session)
):
    """Жаңа жазба жасау."""
    return service.create_assessment(session, data)


@router.patch("/{assessment_id}", response_model=AssessmentOut)
def update_assessment(
    data: AssessmentUpdate,
    assessment: Assessment = Depends(get_or_404),
    session: Session = Depends(get_session),
):
    """Жазбаны өзгерту."""
    return service.update_assessment(session, assessment, data)


@router.delete("/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assessment(
    assessment: Assessment = Depends(get_or_404),
    session: Session = Depends(get_session),
) -> None:
    """Жазбаны өшіру."""
    service.delete_assessment(session, assessment)