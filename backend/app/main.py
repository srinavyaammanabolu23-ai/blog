from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.db.base import Base
from app.db.session import engine

from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.models.vote import Vote

from app.api.auth import router as auth_router
from app.api.posts import router as posts_router
from app.api.comments import router as comments_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="A component-based blogging platform with nested comments",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
origins = [
    "http://localhost:5173",
    "https://blog-299jflqm9-srinavyaammanabolu23-ais-projects.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(posts_router)
app.include_router(comments_router)


@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "docs": "/docs",
    }
