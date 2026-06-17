from pydantic import BaseModel
from datetime import datetime


class CommentCreate(BaseModel):
    """Schema for creating a comment or reply."""
    content: str
    parent_id: int | None = None


class VoteCreate(BaseModel):
    """Schema for upvoting or downvoting a comment."""
    value: int  # +1 or -1


class CommentResponse(BaseModel):
    """Schema for a comment in API responses."""
    id: int
    post_id: int
    author_id: int
    author_username: str | None = None
    author_avatar: str | None = None
    parent_id: int | None = None
    content: str
    status: str
    score: int = 0  # net vote score
    user_vote: int | None = None  # current user's vote on this comment
    created_at: datetime

    model_config = {"from_attributes": True}
