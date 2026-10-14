"""Дерекқорды сынақ бағалау деректерімен толтыру.

Іске қосу:
    docker compose exec backend python -m scripts.seed
"""

import random
from datetime import date, timedelta

from sqlalchemy import select

from app.db import SessionLocal
from app.modules.assessments.models import Assessment

STUDENTS = [
    "Асқар Нұрланов",
    "Айгүл Серікқызы",
    "Мереке Нұрсая",
    "Данияр Ахметов",
    "Аружан Бекова",
    "Ерасыл Қайратов",
    "Жанна Смағұлова",
    "Нұрсұлтан Оспанов",
    "Мадина Тұрсынова",
    "Арман Жүнісов",
    "Камила Ержанова",
    "Санжар Мұхамедов",
    "Аида Сейітқали",
    "Тимур Байжанов",
    "Әсем Қабылова",
]

TEACHERS = [
    "Айгүл Серікқызы",
    "Асқар Нұрланов",
    "Гүлнар Оспанова",
    "Бақытжан Ерғалиев",
    "Ләззат Ахметова",
]

SUBJECTS = [
    "Математика",
    "Физика",
    "Информатика",
    "Қазақ тілі",
    "Орыс тілі",
    "Ағылшын тілі",
    "Химия",
    "Биология",
    "География",
    "Тарих",
]

CLASSES = ["5А", "5Б", "6А", "7А", "7Б", "8А", "9А", "9Б", "10А", "10Б", "11А"]

ASSESSMENT_TYPES = ["ТЖБ", "БЖБ", "Тоқсандық", "Жылдық", "Ағымдық"]

COMMENTS = [
    "Үздік жұмыс",
    "Жақсы нәтиже",
    "Жақсартуға болады",
    "Тапсырманы толық орындады",
    "Қосымша жұмыс қажет",
    None,
    None,
    None,
]


def random_date() -> date:
    """Соңғы 6 айдың ішінде кездейсоқ күн."""
    days_ago = random.randint(0, 180)
    return date.today() - timedelta(days=days_ago)


def make_assessment() -> Assessment:
    """Бір Assessment нысанын жасау."""
    grade = random.choices([2, 3, 4, 5], weights=[1, 3, 4, 5])[0]
    return Assessment(
        student_name=random.choice(STUDENTS),
        subject=random.choice(SUBJECTS),
        grade=grade,
        assessment_type=random.choice(ASSESSMENT_TYPES),
        date=random_date(),
        class_name=random.choice(CLASSES),
        teacher=random.choice(TEACHERS),
        comment=random.choice(COMMENTS),
    )


def main() -> None:
    random.seed(42)  # қайталанатын деректер

    with SessionLocal() as session:
        existing = session.scalar(select(Assessment).limit(1))
        if existing is not None:
            print("Дерекқорда бағалаулар бар. Seed өткізілді.")
            return

        assessments = [make_assessment() for _ in range(40)]
        session.add_all(assessments)
        session.commit()

        print(f"Дерекқорға {len(assessments)} бағалау қосылды.")


if __name__ == "__main__":
    main()