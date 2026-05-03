import firebase_admin
from firebase_admin import credentials, db
from core.config import settings

def init_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate(settings.FIREBASE_KEY_PATH)
        firebase_admin.initialize_app(cred, {
            'databaseURL': settings.FIREBASE_URL
        })

def get_db_ref(path: str):
    init_firebase()
    return db.reference(path)