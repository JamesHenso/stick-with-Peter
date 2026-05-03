from fastapi import APIRouter, Depends, HTTPException
from schemas.schemas import (
    BoardWithNotesResponse,
    NoteCreate, NotePatch, NoteResponse,
)
from services.service import BoardService, NoteService
from dependencies.auth import get_current_user

# ─── Board Routes ────────────────────────────────────────────

board_router = APIRouter(prefix="/api/boards", tags=["Boards"])

@board_router.get("/default", response_model=BoardWithNotesResponse)
async def get_default_board(user = Depends(get_current_user)):
    return BoardService.get_or_create_default_board(user['uid'])

@board_router.get("/{board_id}", response_model=BoardWithNotesResponse)
async def get_board(board_id: str, user = Depends(get_current_user)):
    result = BoardService.get_board_with_notes(user['uid'], board_id)
    if not result:
        raise HTTPException(status_code=404, detail="Board khong ton tai")
    return result


# ─── Note Routes ─────────────────────────────────────────────

note_router = APIRouter(prefix="/api/notes", tags=["Notes"])

@note_router.post("/{board_id}", status_code=201, response_model=NoteResponse)
async def create_note(board_id: str, payload: NoteCreate, user = Depends(get_current_user)):
    result, error = NoteService.create_note(
        user['uid'], board_id, payload.content, payload.col_idx, payload.row_idx
    )
    if error:
        if "note khac" in error:
            raise HTTPException(status_code=409, detail=error)
        raise HTTPException(status_code=404, detail=error)
    return result

@note_router.patch("/{board_id}/{note_id}", response_model=NoteResponse)
async def update_note(board_id: str, note_id: str, payload: NotePatch, user = Depends(get_current_user)):
    if payload.content is not None:
        result = NoteService.update_note_content(user['uid'], board_id, note_id, payload.content)
        if not result:
            raise HTTPException(status_code=404, detail="Note khong ton tai")
        if payload.col_idx is None and payload.row_idx is None:
            return result

    if payload.col_idx is not None and payload.row_idx is not None:
        result, error = NoteService.update_note_position(
            user['uid'], board_id, note_id, payload.col_idx, payload.row_idx
        )
        if error:
            if "note khac" in error:
                raise HTTPException(status_code=409, detail=error)
            raise HTTPException(status_code=404, detail=error)
        return result

    raise HTTPException(status_code=400, detail="Can cung cap col_idx va row_idx hoac content")

@note_router.delete("/{board_id}/{note_id}")
async def delete_note(board_id: str, note_id: str, user = Depends(get_current_user)):
    success = NoteService.delete_note(user['uid'], board_id, note_id)
    if not success:
        raise HTTPException(status_code=404, detail="Note khong ton tai")
    return {"message": "Xoa note thanh cong"}
