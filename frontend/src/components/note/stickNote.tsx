import { useLottie } from "lottie-react";
import frogAnimation from "../../assets/frog-smooth.json";
import paperNote from "../../assets/paper.svg";
import penBin from "../../assets/pen.svg";
import recycleBin from "../../assets/recycle.svg";
import pinNoteSvg from "../../assets/pinNote.svg";
import SlideUpNote from "./slideUpNote";
import GroupNote from "./groupNote";
import FormNote from "./formNote";
import { useState, useEffect, useCallback, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
	DndContext,
	type DragEndEvent,
	type DragStartEvent,
	useSensor,
	useSensors,
	PointerSensor,
	DragOverlay,
	defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
	getDefaultBoard,
	createNote,
	updateNotePosition,
	updateNoteContent,
	deleteNote,
	type Note,
	type Board,
} from "../../api/boardAPI";

// Kích thước bảng cố định
const GRID_COLS = 10;
const GRID_ROWS = 10;

import { DroppableCell, DroppableBin, DraggableNote } from "./dndNote";

function StickNote() {
	const [isOpenPen, setIsOpenPen] = useState<boolean>(false);
	const [isOpenNote, setIsOpenNote] = useState<boolean>(false);
	const { user, loading } = useAuth();
	const navigate = useNavigate();

	// ─── Board & Notes state ────────────────────────────────
	const [board, setBoard] = useState<Board | null>(null);
	const [notes, setNotes] = useState<Note[]>([]);

	// ─── "Sticking mode" state ──────────────────────────────
	// Khi user nhấn tick ở formNote → note content sẵn sàng ghim
	const [stickyContent, setStickyContent] = useState<string | null>(null);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	// ─── Editing note state ─────────────────────────────────
	const [editingNote, setEditingNote] = useState<Note | null>(null);

	// ─── Dragging note state for overlay ────────────────────
	const [activeDragNote, setActiveDragNote] = useState<Note | null>(null);

	// ─── Board ref for grid coordinate calculation ──────────
	const boardRef = useRef<HTMLDivElement>(null);

	// ─── Lottie ─────────────────────────────────────────────
	const options = {
		animationData: frogAnimation,
		loop: true,
		autoplay: true,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};
	const { View } = useLottie(options);

	// ─── Dnd Sensors ────────────────────────────────────────
	// Khoảng cách 5px để phân biệt drag và click
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
	);

	// ─── Load board on mount ────────────────────────────────
	useEffect(() => {
		const loadBoard = async () => {
			if (user) {
				try {
					const token = await user.getIdToken();
					const boardData = await getDefaultBoard(token);
					setBoard(boardData);
					const pinned = boardData.notes.filter(
						(n) => n.col_idx !== null && n.row_idx !== null,
					);
					setNotes(pinned);
				} catch (error) {
					console.error("Failed to load board:", error);
				}
			}
		};
		loadBoard();
	}, [user]);

	// ─── Track mouse when in sticking mode ──────────────────
	useEffect(() => {
		if (stickyContent === null) return;
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({ x: e.clientX, y: e.clientY });
		};
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") setStickyContent(null);
		};
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("keydown", handleEscape);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("keydown", handleEscape);
		};
	}, [stickyContent]);

	// ─── Check if cell is occupied ──────────────────────────
	const isCellOccupied = useCallback(
		(col: number, row: number): boolean => {
			return notes.some((n) => n.col_idx === col && n.row_idx === row);
		},
		[notes],
	);

	// ─── Get note at cell ───────────────────────────────────
	const getNoteAtCell = useCallback(
		(col: number, row: number): Note | undefined => {
			return notes.find((n) => n.col_idx === col && n.row_idx === row);
		},
		[notes],
	);

	// ─── Handle click on grid cell → pin note ───────────────
	const handleCellClick = async (col: number, row: number) => {
		if (!stickyContent || !board || !user) return;
		if (isCellOccupied(col, row)) return;

		const content = stickyContent;
		setStickyContent(null); // Tắt sticking mode ngay

		try {
			const token = await user.getIdToken();
			const newNote = await createNote(
				token,
				board.id,
				content,
				col,
				row,
			);
			setNotes((prev) => [...prev, newNote]);
		} catch (error) {
			console.error("Failed to pin note:", error);
		}
	};

	// ─── Handle "tick complete" from formNote ───────────────
	const handleNoteComplete = (content: string) => {
		if (editingNote) {
			handleSaveNoteContent(editingNote.id, content);
			setEditingNote(null);
		} else {
			setStickyContent(content);
		}
	};

	// ─── Note click → open formNote to edit ─────────────────
	const handleNoteClick = (note: Note) => {
		if (stickyContent) return; // Đang trong sticking mode → bỏ qua
		setEditingNote(note);
	};

	// ─── Save edited note content ───────────────────────────
	const handleSaveNoteContent = async (noteId: string, content: string) => {
		if (!user || !board) return;
		try {
			const token = await user.getIdToken();
			const updated = await updateNoteContent(
				token,
				board.id,
				noteId,
				content,
			);
			setNotes((prev) =>
				prev.map((n) => (n.id === noteId ? updated : n)),
			);
		} catch (error) {
			console.error("Failed to update note:", error);
		}
	};

	// ─── Handle Drag Start ──────────────────────────────────
	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const note = notes.find((n) => n.id === active.id);
		if (note) setActiveDragNote(note);
	};

	// ─── Handle Drag End ────────────────────────────────────
	const handleDragEnd = async (event: DragEndEvent) => {
		setActiveDragNote(null);
		const { active, over } = event;
		if (!over || !user || !board) return;

		const note = notes.find((n) => n.id === active.id);
		if (!note) return;

		// Thả vào thùng rác
		if (over.id === "recycle-bin") {
			const previousNotes = [...notes];
			setNotes((prev) => prev.filter((n) => n.id !== note.id));
			try {
				const token = await user.getIdToken();
				await deleteNote(token, board.id, note.id);
			} catch (error) {
				console.error("Failed to delete note:", error);
				setNotes(previousNotes); // Rollback
			}
			return;
		}

		// Thả vào một ô lưới khác
		const { col, row } = over.data.current as { col: number; row: number };
		if (note.col_idx === col && note.row_idx === row) return;

		// Optimistic update
		const previousNotes = [...notes];
		setNotes((prev) =>
			prev.map((n) =>
				n.id === note.id ? { ...n, col_idx: col, row_idx: row } : n,
			),
		);

		try {
			const token = await user.getIdToken();
			await updateNotePosition(token, board.id, note.id, col, row);
		} catch (error) {
			console.error("Failed to move note:", error);
			setNotes(previousNotes); // Rollback
		}
	};

	// ─── Logout ─────────────────────────────────────────────
	const handleLogout = async () => {
		await signOut(auth);
		navigate("/");
	};

	return (
		<DndContext
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			sensors={sensors}
		>
			<div
				className={`min-h-screen flex flex-col items-center pt-5 px-4 bg-[#FEECBF] ${
					stickyContent ? "cursor-none" : ""
				}`}
			>
				<div className="relative">
					{/* ─── Brown corkboard ────────────────────── */}
					<div
						ref={boardRef}
						className="relative w-150 h-110 border-4 rounded-lg border-[#B86F3C] bg-[#DCA077] shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)]"
					>
						{/* ─── Grid overlay (invisible cells) ──── */}
						<div
							className="absolute inset-0 z-10 grid p-2"
							style={{
								gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
								gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
							}}
						>
							{Array.from({ length: GRID_ROWS }).map((_, row) =>
								Array.from({ length: GRID_COLS }).map(
									(_, col) => {
										const occupied = isCellOccupied(
											col,
											row,
										);
										const noteInCell = getNoteAtCell(
											col,
											row,
										);
										return (
											<DroppableCell
												key={`${col}-${row}`}
												col={col}
												row={row}
												isOccupied={occupied}
												isSticking={!!stickyContent}
												onCellClick={() =>
													handleCellClick(col, row)
												}
											>
												{noteInCell && (
													<DraggableNote
														note={noteInCell}
														onClick={
															handleNoteClick
														}
													/>
												)}
											</DroppableCell>
										);
									},
								),
							)}
						</div>
					</div>

					{/* ─── Frog animation + desk items ────────── */}
					<div className="absolute top-30 flex flex-col items-center justify-center w-full h-full pointer-events-none">
						<div style={{ width: "100%", height: "100%" }}>
							{View}
						</div>
					</div>

					{/* ─── Action buttons (desk items) ────────── */}
					<div className="absolute top-157 right-10 flex items-center z-0">
						<img
							src={paperNote}
							alt="paperNote"
							className="w-14 h-14 shrink-0 cursor-pointer hover:scale-110 transition-transform"
							onClick={() => setIsOpenNote(true)}
						/>
						<img
							src={penBin}
							alt="penBin"
							className="w-14 h-14 shrink-0 -translate-y-3 scale-150 origin-center cursor-pointer hover:scale-[1.65] transition-transform"
							onClick={() => setIsOpenPen(true)}
						/>
						<DroppableBin>
							<img
								src={recycleBin}
								alt="recycleBin"
								className="w-14 h-14 shrink-0"
							/>
						</DroppableBin>
					</div>

					{/* ─── User info ──────────────────────────── */}
					{!loading && user && (
						<div className="mt-3 flex items-center gap-2 lg:mt-0 lg:absolute lg:left-full lg:top-8 lg:ml-6">
							<div className="flex items-center gap-3 pr-4 pl-2 py-2 bg-[#FEF6E4] border-2 border-[#B86F3C] rounded-[40px] shadow-sm">
								<img
									src={user.photoURL ?? ""}
									alt={user.displayName ?? "User"}
									className="w-14 h-14 rounded-full border-2 border-[#B86F3C] object-cover"
								/>
								<div className="font-lexend text-[#6B3A1F] font-bold text-[15px] uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-35 leading-normal tracking-wide">
									{user.displayName}
								</div>
							</div>
							<button
								onClick={handleLogout}
								title="Đăng xuất"
								className="px-5 py-2 bg-[#FEF6E4] border-2 border-[#B86F3C] rounded-[40px] shadow-sm text-[#6B3A1F] font-bold text-[15px] uppercase tracking-wide hover:bg-[#B86F3C] hover:text-[#FEF6E4] transition-colors cursor-pointer flex items-center justify-center"
							>
								Log out
							</button>
						</div>
					)}
				</div>

				{/* ─── Overlays ──────────────────────────────── */}
				<SlideUpNote
					isOpen={isOpenPen}
					onClose={() => setIsOpenPen(false)}
				/>

				{/* GroupNote contains its own FormNote for new notes from menu */}
				<GroupNote
					isOpen={isOpenNote}
					onClose={() => setIsOpenNote(false)}
					onNoteComplete={handleNoteComplete}
				/>

				{/* Direct FormNote for editing existing notes */}
				<FormNote
					isOpen={!!editingNote}
					onClose={() => setEditingNote(null)}
					initialContent={editingNote?.content}
					onNoteComplete={handleNoteComplete}
				/>

				{/* ─── pinNote.svg follows cursor ────────────── */}
				{stickyContent && (
					<div
						className="fixed z-200 pointer-events-none"
						style={{
							left: mousePos.x - 23,
							top: mousePos.y - 10,
						}}
					>
						<img
							src={pinNoteSvg}
							alt="pin note"
							className="w-12 h-14 drop-shadow-lg animate-pulse"
						/>
					</div>
				)}

				{/* ─── Drag Overlay cho hiệu ứng mượt mà ─────── */}
				<DragOverlay
					dropAnimation={{
						sideEffects: defaultDropAnimationSideEffects({
							styles: {
								active: {
									opacity: "0.5",
								},
							},
						}),
					}}
				>
					{activeDragNote ? (
						<div className="flex items-center justify-center scale-125 cursor-grabbing drop-shadow-2xl">
							<img
								src={pinNoteSvg}
								alt="pinned note"
								className="w-12 h-14 object-contain pointer-events-none"
							/>
						</div>
					) : null}
				</DragOverlay>
			</div>
		</DndContext>
	);
}

export default StickNote;
