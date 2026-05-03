import axios from "axios";

const API_BASE = "http://localhost:8000/api";

// ─── Types ──────────────────────────────────────────────────
export interface Note {
	id: string;
	board_id: string;
	content: string;
	col_idx: number | null;
	row_idx: number | null;
}

export interface Board {
	id: string;
	name: string;
	grid_cols: number;
	grid_rows: number;
	notes: Note[];
}

// ─── Board API ──────────────────────────────────────────────
export const getDefaultBoard = async (token: string): Promise<Board> => {
	const res = await axios.get<Board>(`${API_BASE}/boards/default`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

// ─── Note API ───────────────────────────────────────────────
export const createNote = async (
	token: string,
	boardId: string,
	content: string,
	col_idx?: number | null,
	row_idx?: number | null,
): Promise<Note> => {
	const res = await axios.post<Note>(
		`${API_BASE}/notes/${boardId}`,
		{ content, col_idx: col_idx ?? null, row_idx: row_idx ?? null },
		{ headers: { Authorization: `Bearer ${token}` } },
	);
	return res.data;
};

export const updateNotePosition = async (
	token: string,
	boardId: string,
	noteId: string,
	col_idx: number,
	row_idx: number,
): Promise<Note> => {
	const res = await axios.patch<Note>(
		`${API_BASE}/notes/${boardId}/${noteId}`,
		{ col_idx, row_idx },
		{ headers: { Authorization: `Bearer ${token}` } },
	);
	return res.data;
};

export const updateNoteContent = async (
	token: string,
	boardId: string,
	noteId: string,
	content: string,
): Promise<Note> => {
	const res = await axios.patch<Note>(
		`${API_BASE}/notes/${boardId}/${noteId}`,
		{ content },
		{ headers: { Authorization: `Bearer ${token}` } },
	);
	return res.data;
};

export const deleteNote = async (
	token: string,
	boardId: string,
	noteId: string,
): Promise<void> => {
	await axios.delete(`${API_BASE}/notes/${boardId}/${noteId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
};
