from pydantic import BaseModel
from typing import Optional, List

# BOARD SCHEMAS

class BoardWithNotesResponse(BaseModel):
    id: str
    name: str
    grid_cols: int
    grid_rows: int
    notes: List["NoteResponse"] = []


# STICKYNOTE SCHEMAS

class NoteCreate(BaseModel):
    content: str
    col_idx: Optional[int] = None
    row_idx: Optional[int] = None

class NotePatch(BaseModel):
    col_idx: Optional[int] = None
    row_idx: Optional[int] = None
    content: Optional[str] = None

class NoteResponse(BaseModel):
    id: str
    board_id: str
    content: str    
    col_idx: Optional[int] = None
    row_idx: Optional[int] = None