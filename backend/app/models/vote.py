from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base


class Vote(Base):
    """Vote model for comment upvotes/downvotes. One vote per user per comment."""

    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    comment_id = Column(Integer, ForeignKey("comments.id"), nullable=False)
    value = Column(Integer, nullable=False)  # +1 (upvote) or -1 (downvote)

    # Relationships
    user = relationship("User", back_populates="votes")
    comment = relationship("Comment", back_populates="votes")

    # Ensure one vote per user per comment
    __table_args__ = (
        UniqueConstraint("user_id", "comment_id", name="uq_user_comment_vote"),
    )

    def __repr__(self) -> str:
        return f"<Vote(user_id={self.user_id}, comment_id={self.comment_id}, value={self.value})>"
