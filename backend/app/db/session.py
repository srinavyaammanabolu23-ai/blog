import os
import shutil
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import get_settings

settings = get_settings()

db_url = settings.DATABASE_URL
connect_args = {}

if db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False
    
    # VERCEL WORKAROUND: Copy DB to /tmp to make it writable
    if os.environ.get("VERCEL"):
        tmp_db_path = "/tmp/blog.db"
        if not os.path.exists(tmp_db_path):
            try:
                base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
                source_db = os.path.join(base_dir, "blog.db")
                if os.path.exists(source_db):
                    shutil.copy2(source_db, tmp_db_path)
            except Exception as e:
                print(f"Failed to copy DB: {e}")
        
        db_url = f"sqlite:///{tmp_db_path}"

engine = create_engine(db_url, connect_args=connect_args, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
