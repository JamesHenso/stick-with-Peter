from core.database import get_db_ref

# ─── Board Service ───────────────────────────────────────────

class BoardService:
    @staticmethod
    def get_board(user_id: str, board_id: str):
        ref = get_db_ref(f"boards/{user_id}/{board_id}")
        data = ref.get()
        if not data:
            return None
        return {"id": board_id, **data}
    
    @staticmethod
    def get_board_with_notes(user_id: str, board_id: str):
        board = BoardService.get_board(user_id, board_id)
        if not board:
            return None
        notes = NoteService.get_all_notes(user_id, board_id)
        board["notes"] = notes
        return board

    @staticmethod
    def create_board(user_id: str, name: str, grid_cols: int = 10, grid_rows: int = 10):
        ref = get_db_ref(f"boards/{user_id}")
        new_board = {
            "name": name,
            "grid_cols": grid_cols,
            "grid_rows": grid_rows,
        }
        new_ref = ref.push(new_board)
        return {"id": new_ref.key, **new_board}
    
    @staticmethod
    def get_or_create_default_board(user_id: str):
        ref = get_db_ref(f"boards/{user_id}")
        data = ref.get() or {}

        if data:
            first_key = next(iter(data))
            board = {"id": first_key, **data[first_key]}
            notes = NoteService.get_all_notes(user_id, first_key)
            board["notes"] = notes
            return board
        
        board = BoardService.create_board(user_id, "My Board")
        board["notes"] = []
        return board


# ─── Note Service ────────────────────────────────────────────

class NoteService:
    @staticmethod
    def get_all_notes(user_id: str, board_id: str):
        ref = get_db_ref(f"notes/{user_id}/{board_id}")
        data = ref.get() or {}
        return [{"id": k, "board_id": board_id, **v} for k, v in data.items()]

    @staticmethod
    def create_note(user_id: str, board_id: str, content: str, col_idx: int = None, row_idx: int = None):

        board = BoardService.get_board(user_id, board_id)
        if not board:
            return None, "Board khong ton tai"

        if col_idx is not None and row_idx is not None:
            conflict = NoteService._check_cell_occupied(user_id, board_id, col_idx, row_idx)
            if conflict:
                return None, "Da co note khac"

        ref = get_db_ref(f"notes/{user_id}/{board_id}")
        new_note = {
            "content": content,
            "col_idx": col_idx,
            "row_idx": row_idx,
        }
        new_ref = ref.push(new_note)
        return {"id": new_ref.key, "board_id": board_id, **new_note}, None

    @staticmethod
    def update_note_position(user_id: str, board_id: str, note_id: str, col_idx: int, row_idx: int):

        ref = get_db_ref(f"notes/{user_id}/{board_id}/{note_id}")
        current = ref.get()
        if not current:
            return None, "Note khong ton tai"
        
        conflict = NoteService._check_cell_occupied(user_id, board_id, col_idx, row_idx, exclude_note_id=note_id)
        if conflict:
            return None, "Da co note khac"
        
        ref.update({"col_idx": col_idx, "row_idx": row_idx})
        current["col_idx"] = col_idx
        current["row_idx"] = row_idx
        return {"id": note_id, "board_id": board_id, **current}, None
    
    @staticmethod
    def update_note_content(user_id: str, board_id: str, note_id: str, content: str):
        ref = get_db_ref(f"notes/{user_id}/{board_id}/{note_id}")
        current = ref.get()
        if not current:
            return None
        ref.update({"content": content})
        current["content"] = content
        return {"id": note_id, "board_id": board_id, **current}
    
    @staticmethod
    def delete_note(user_id: str, board_id: str, note_id: str):
        ref = get_db_ref(f"notes/{user_id}/{board_id}/{note_id}")
        if not ref.get():
            return False
        ref.delete()
        return True

    @staticmethod
    def _check_cell_occupied(user_id: str, board_id: str, col_idx: int, row_idx: int, exclude_note_id: str = None):

        all_notes = NoteService.get_all_notes(user_id, board_id)
        for note in all_notes:
            if note.get("col_idx") == col_idx and note.get("row_idx") == row_idx:
                if exclude_note_id and note["id"] == exclude_note_id:
                    continue
                return True
        return False