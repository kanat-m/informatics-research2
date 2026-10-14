from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db import get_session

from . import service
from .dependencies import get_current_user
from .models import User
from .schemas import LoginRequest, Token, UserCreate, UserOut
from .security import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, session: Session = Depends(get_session)):
    """Жаңа пайдаланушыны тіркеу."""
    try:
        return service.create_user(session, data)
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status.HTTP_409_CONFLICT, "User with this email already exists"
        )


@router.post("/login", response_model=Token)
def login(data: LoginRequest, session: Session = Depends(get_session)):
    """Кіру және JWT токен алу."""
    user = service.authenticate(session, data.email, data.password)
    if user is None:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED, "Invalid email or password"
        )

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return Token(access_token=token)


@router.get("/me", response_model=UserOut)
def read_me(current_user: User = Depends(get_current_user)):
    """Ағымдағы пайдаланушы туралы ақпарат."""
    return current_user