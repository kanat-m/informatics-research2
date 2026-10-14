from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import User
from .schemas import UserCreate
from .security import hash_password, verify_password


def get_user_by_email(session: Session, email: str) -> User | None:
    """Email бойынша пайдаланушыны табу."""
    return session.scalar(select(User).where(User.email == email))


def get_user_by_id(session: Session, user_id: int) -> User | None:
    """ID бойынша пайдаланушыны табу."""
    return session.get(User, user_id)


def create_user(session: Session, data: UserCreate) -> User:
    """Жаңа пайдаланушы жасау."""
    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def authenticate(session: Session, email: str, password: str) -> User | None:
    """Пайдаланушыны аутентификациялау."""
    user = get_user_by_email(session, email)
    if user is None:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user