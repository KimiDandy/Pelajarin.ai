from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Pelajarin.ai API"
    API_V1_STR: str = "/api/v1"
    CLIENT_ORIGIN: str

    # Database
    DATABASE_URL: str

    # JWT
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    ALGORITHM: str

    # Google Gemini API Keys (comma-separated string)
    GEMINI_API_KEYS: str = ""

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
