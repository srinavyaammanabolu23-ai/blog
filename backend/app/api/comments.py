from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func as sa_func
from app.core.deps import get_db, get_current_user, require_current_user
from app.models.user import User
from app.models.comment import Comment
from app.models.vote import Vote
from app.models.post import Post
from app.schemas.comment import CommentCreate, CommentResponse, VoteCreate

router = APIRouter(prefix="/api/posts/{post_id}/comments", tags=["Comments"])


def _comment_to_response(comment: Comment, current_user_id: int | None = None) -> CommentResponse:
    """Convert a Comment ORM object to a CommentResponse schema."""
    # Calculate net score from votes
    score = sum(v.value for v in comment.votes) if comment.votes else 0

    # Find current user's vote if logged in
    user_vote = None
    if current_user_id and comment.votes:
        for v in comment.votes:
            if v.user_id == current_user_id:
                user_vote = v.value
                break

    return CommentResponse(
        id=comment.id,
        post_id=comment.post_id,
        author_id=comment.author_id,
        author_username=comment.author.username if comment.author else None,
        author_avatar=comment.author.avatar_url if comment.author else None,
        parent_id=comment.parent_id,
        content=comment.content,
        status=comment.status,
        score=score,
        user_vote=user_vote,
        created_at=comment.created_at,
    )


@router.get("/", response_model=list[CommentResponse])
def list_comments(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get all comments for a post (flat list — frontend builds the tree)."""
    # Verify post exists
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comments = (
        db.query(Comment)
        .filter(Comment.post_id == post_id, Comment.status == "visible")
        .order_by(Comment.created_at.asc())
        .all()
    )

    uid = current_user.id if current_user else None
    return [_comment_to_response(c, uid) for c in comments]


@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    post_id: int,
    payload: CommentCreate,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db),
):
    """Create a new comment or reply on a post."""
    # Verify post exists
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # If replying to a parent, verify the parent exists and belongs to the same post
    if payload.parent_id is not None:
        parent = db.query(Comment).filter(
            Comment.id == payload.parent_id, Comment.post_id == post_id
        ).first()
        if not parent:
            raise HTTPException(status_code=404, detail="Parent comment not found")

    comment = Comment(
        post_id=post_id,
        author_id=current_user.id,
        parent_id=payload.parent_id,
        content=payload.content,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return _comment_to_response(comment, current_user.id)


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    post_id: int,
    comment_id: int,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db),
):
    """Delete a comment. Only the author or an admin can delete."""
    comment = db.query(Comment).filter(
        Comment.id == comment_id, Comment.post_id == post_id
    ).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")

    db.delete(comment)
    db.commit()


@router.post("/{comment_id}/vote", response_model=CommentResponse)
def vote_comment(
    post_id: int,
    comment_id: int,
    payload: VoteCreate,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db),
):
    """Upvote or downvote a comment. Toggles off if same vote is cast again."""
    if payload.value not in (1, -1):
        raise HTTPException(status_code=400, detail="Vote value must be 1 or -1")

    comment = db.query(Comment).filter(
        Comment.id == comment_id, Comment.post_id == post_id
    ).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    existing_vote = db.query(Vote).filter(
        Vote.user_id == current_user.id, Vote.comment_id == comment_id
    ).first()

    if existing_vote:
        if existing_vote.value == payload.value:
            # Same vote → toggle off (remove the vote)
            db.delete(existing_vote)
        else:
            # Different vote → switch
            existing_vote.value = payload.value
    else:
        # New vote
        vote = Vote(
            user_id=current_user.id,
            comment_id=comment_id,
            value=payload.value,
        )
        db.add(vote)

    db.commit()
    db.refresh(comment)
    return _comment_to_response(comment, current_user.id)
