from pydantic import BaseModel
from datetime import datetime
from typing import Any


class BlockData(BaseModel):
    """Schema for a single content block in a post."""
    type: str  # header | richtext | media | code
    data: dict[str, Any]


class PostCreate(BaseModel):
    """Schema for creating a new post."""
    title: str
    summary: str | None = None
    blocks: list[BlockData]


class PostUpdate(BaseModel):
    """Schema for updating a post."""
    title: str | None = None
    summary: str | None = None
    blocks: list[BlockData] | None = None


class PostResponse(BaseModel):
    """Schema for a post in API responses."""
    id: int
    title: str
    summary: str | None = None
    slug: str
    blocks: list[dict[str, Any]]
    author_id: int
    author_username: str | None = None
    author_avatar: str | None = None
    comment_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PostListResponse(BaseModel):
    """Schema for paginated post list."""
    posts: list[PostResponse]
    total: int
    page: int
    per_page: int
