import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    FIREBASE_URL: str = os.getenv("FIREBASE_DATABASE_URL")
    FIREBASE_KEY_PATH: str = "serviceAccountKey.json"


settings = Settings()