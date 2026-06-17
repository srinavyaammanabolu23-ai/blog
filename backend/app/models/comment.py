from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class Comment(Base):
    """Hierarchical comment model with self-referential parent_id for nesting."""

    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)  # NULL = top-level
    content = Column(Text, nullable=False)
    status = Column(String(20), default="visible", nullable=False)  # visible | hidden | flagged
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    post = relationship("Post", back_populates="comments")
    author = relationship("User", back_populates="comments")
    parent = relationship("Comment", remote_side=[id], backref="replies")
    votes = relationship("Vote", back_populates="comment", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Comment(id={self.id}, post_id={self.post_id}, parent_id={self.parent_id})>"
