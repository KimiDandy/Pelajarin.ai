from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from belajaryuk_api.routers import auth_router, course_router
from belajaryuk_api.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CLIENT_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(course_router.router, prefix="/api/v1/courses", tags=["Courses"]) 

# Database initialization on startup
from belajaryuk_api.db.session import engine
from belajaryuk_api.db.base import Base
# Import all models to ensure they are registered with Base's metadata
from belajaryuk_api.models import user, course, module, sub_topic, assessment

@app.on_event("startup")
def on_startup():
    print("--- Initializing Database ---")
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("--- Database is fresh and ready ---")


@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}
