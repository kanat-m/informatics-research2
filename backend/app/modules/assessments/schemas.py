from datetime import date as date_type
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AssessmentBase(BaseModel):
    student_name: str = Field(min_length=2, max_length=200)
    subject: str = Field(min_length=2, max_length=100)
    grade: int = Field(ge=2, le=5)
    assessment_type: str = Field(min_length=2, max_length=50)
    date: date_type
    class_name: str = Field(min_length=1, max_length=20)
    teacher: str | None = Field(default=None, max_length=200)
    comment: str | None = None


class AssessmentCreate(AssessmentBase):
    pass


class AssessmentUpdate(BaseModel):
    student_name: str | None = Field(default=None, min_length=2, max_length=200)
    subject: str | None = Field(default=None, min_length=2, max_length=100)
    grade: int | None = Field(default=None, ge=2, le=5)
    assessment_type: str | None = Field(default=None, min_length=2, max_length=50)
    date: date_type | None = None
    class_name: str | None = Field(default=None, min_length=1, max_length=20)
    teacher: str | None = Field(default=None, max_length=200)
    comment: str | None = None


class AssessmentOut(AssessmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
