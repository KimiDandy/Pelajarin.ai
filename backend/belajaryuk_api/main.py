from fastapi import FastAPI
from belajaryuk_api.routers import auth_router
from belajaryuk_api.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(auth_router.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}
