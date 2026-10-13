from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from .models import Assessment
from .schemas import AssessmentCreate, AssessmentUpdate


def list_assessments(
    session: Session,
    q: str | None = None,
    subject: str | None = None,
    class_name: str | None = None,
    limit: int = 20,
    offset: int = 0,
) -> list[Assessment]:
    stmt = select(Assessment).order_by(Assessment.date.desc(), Assessment.id.desc())
    if q:
        pattern = f"%{q}%"
        stmt = stmt.where(
            or_(
                Assessment.student_name.ilike(pattern),
                Assessment.teacher.ilike(pattern),
            )
        )
    if subject:
        stmt = stmt.where(Assessment.subject == subject)
    if class_name:
        stmt = stmt.where(Assessment.class_name == class_name)
    return list(session.scalars(stmt.limit(limit).offset(offset)))


def get_assessment(session: Session, assessment_id: int) -> Assessment | None:
    return session.get(Assessment, assessment_id)


def create_assessment(session: Session, data: AssessmentCreate) -> Assessment:
    assessment = Assessment(**data.model_dump())
    session.add(assessment)
    session.commit()
    session.refresh(assessment)
    return assessment


def update_assessment(
    session: Session, assessment: Assessment, data: AssessmentUpdate
) -> Assessment:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(assessment, field, value)
    session.commit()
    session.refresh(assessment)
    return assessment


def delete_assessment(session: Session, assessment: Assessment) -> None:
    session.delete(assessment)
    session.commit()
