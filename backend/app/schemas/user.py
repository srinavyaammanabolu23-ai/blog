from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    """Schema for user registration."""
    username: str
    email: EmailStr
    password: str
    role: str = "reader"  # admin | author | reader


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user data in API responses."""
    id: int
    username: str
    email: str
    role: str
    avatar_url: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
