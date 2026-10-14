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
    """Тізімді алу: іздеу, сүзгілеу, пагинация."""
    stmt = select(Assessment).order_by(Assessment.date.desc(), Assessment.id.desc())
    if q:
        pattern = f"%{q}%"
        stmt = stmt.where(
            or_(
                Assessment.student_name.ilike(pattern),
                Assessment.teacher.ilike(pattern),
                Assessment.subject.ilike(pattern),
                Assessment.comment.ilike(pattern),
            )
        )
    if subject:
        stmt = stmt.where(Assessment.subject == subject)
    if class_name:
        stmt = stmt.where(Assessment.class_name == class_name)
    return list(session.scalars(stmt.limit(limit).offset(offset)))


def get_assessment(session: Session, assessment_id: int) -> Assessment | None:
    """Бір жазбаны ID бойынша алу."""
    return session.get(Assessment, assessment_id)


def create_assessment(session: Session, data: AssessmentCreate) -> Assessment:
    """Жаңа жазба жасау."""
    assessment = Assessment(**data.model_dump())
    session.add(assessment)
    session.commit()
    session.refresh(assessment)
    return assessment


def update_assessment(
    session: Session, assessment: Assessment, data: AssessmentUpdate
) -> Assessment:
    """Жазбаны өзгерту."""
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(assessment, field, value)
    session.commit()
    session.refresh(assessment)
    return assessment


def delete_assessment(session: Session, assessment: Assessment) -> None:
    """Жазбаны өшіру."""
    session.delete(assessment)
    session.commit()


def semantic_search(session: Session, query: str, limit: int = 10) -> list[Assessment]:
    """Мағына бойынша іздеу (кілт сөздер бойынша).

    PostgreSQL-дың ILIKE операторын қолданады.
    """
    pattern = f"%{query}%"
    stmt = (
        select(Assessment)
        .where(
            or_(
                Assessment.student_name.ilike(pattern),
                Assessment.subject.ilike(pattern),
                Assessment.teacher.ilike(pattern),
                Assessment.comment.ilike(pattern),
                Assessment.class_name.ilike(pattern),
                Assessment.assessment_type.ilike(pattern),
            )
        )
        .order_by(Assessment.date.desc(), Assessment.id.desc())
        .limit(limit)
    )
    return list(session.scalars(stmt))