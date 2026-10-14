"""Embedding-сіз іздеу: PostgreSQL-дың толық мәтіндік іздеуі."""


def build_search_text(
    student_name: str,
    subject: str,
    class_name: str,
    assessment_type: str,
    teacher: str | None,
    comment: str | None,
    grade: int,
) -> str:
    """Барлық өрістерден іздеу мәтінін жасау."""
    parts = [
        student_name,
        subject,
        class_name,
        assessment_type,
        teacher or "",
        comment or "",
        str(grade),
    ]
    return " ".join(p for p in parts if p)