from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.routes import board_router, note_router
from core.database import init_firebase

init_firebase()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(board_router)
app.include_router(note_router)


@app.get("/")
def read_root():
    return {"message": "To-do task"}

@app.get("/health")
def health():
    return {"status": "ok"}