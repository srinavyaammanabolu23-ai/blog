import re
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func as sa_func
from app.core.deps import get_db, get_current_user, require_current_user, require_role
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.schemas.post import PostCreate, PostUpdate, PostResponse, PostListResponse

router = APIRouter(prefix="/api/posts", tags=["Posts"])


def _slugify(text: str) -> str:
    """Generate a URL-safe slug from a title string."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")


def _post_to_response(post: Post) -> PostResponse:
    """Convert a Post ORM object to a PostResponse schema."""
    return PostResponse(
        id=post.id,
        title=post.title,
        summary=post.summary,
        slug=post.slug,
        blocks=post.blocks or [],
        author_id=post.author_id,
        author_username=post.author.username if post.author else None,
        author_avatar=post.author.avatar_url if post.author else None,
        comment_count=len(post.comments) if post.comments else 0,
        created_at=post.created_at,
        updated_at=post.updated_at,
    )


@router.get("/", response_model=PostListResponse)
def list_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """List all posts with pagination."""
    total = db.query(sa_func.count(Post.id)).scalar()
    posts = (
        db.query(Post)
        .order_by(Post.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return PostListResponse(
        posts=[_post_to_response(p) for p in posts],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/{slug}", response_model=PostResponse)
def get_post(slug: str, db: Session = Depends(get_db)):
    """Get a single post by its slug."""
    post = db.query(Post).filter(Post.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return _post_to_response(post)


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    payload: PostCreate,
    current_user: User = Depends(require_role("author", "admin")),
    db: Session = Depends(get_db),
):
    """Create a new blog post with structured block content."""
    slug = _slugify(payload.title)

    # Ensure slug uniqueness by appending a suffix if needed
    base_slug = slug
    counter = 1
    while db.query(Post).filter(Post.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    post = Post(
        title=payload.title,
        summary=payload.summary,
        slug=slug,
        blocks=[block.model_dump() for block in payload.blocks],
        author_id=current_user.id,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return _post_to_response(post)


@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    payload: PostUpdate,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing post. Only the owner or an admin can update."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Ownership / admin check
    if post.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to edit this post")

    if payload.title is not None:
        post.title = payload.title
        # Re-generate slug
        slug = _slugify(payload.title)
        base_slug = slug
        counter = 1
        while db.query(Post).filter(Post.slug == slug, Post.id != post.id).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        post.slug = slug

    if payload.summary is not None:
        post.summary = payload.summary

    if payload.blocks is not None:
        post.blocks = [block.model_dump() for block in payload.blocks]

    db.commit()
    db.refresh(post)
    return _post_to_response(post)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db),
):
    """Delete a post. Only the owner or an admin can delete."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")

    db.delete(post)
    db.commit()
