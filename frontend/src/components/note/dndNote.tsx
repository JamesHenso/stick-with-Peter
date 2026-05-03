import { useDroppable, useDraggable } from "@dnd-kit/core";
import pinNoteSvg from "../../assets/pinNote.svg";
import { type Note } from "../../api/boardAPI";

export function DroppableCell({
	col,
	row,
	children,
	isOccupied,
	isSticking,
	onCellClick,
}: {
	col: number;
	row: number;
	children: React.ReactNode;
	isOccupied: boolean;
	isSticking: boolean;
	onCellClick: () => void;
}) {
	const { setNodeRef, isOver } = useDroppable({
		id: `cell-${col}-${row}`,
		data: { col, row },
		disabled: isOccupied,
	});
	return (
		<div
			ref={setNodeRef}
			className={`
                relative rounded-sm transition-all duration-150
                ${isSticking && !isOccupied ? "hover:bg-[#B86F3C]/30 hover:border hover:border-dashed hover:border-yellow-400 cursor-none" : ""}
                ${isSticking && isOccupied ? "cursor-not-allowed" : ""}
                ${isOver && !isOccupied ? "bg-[#B86F3C]/30 border border-dashed border-yellow-400 scale-105" : ""}
            `}
			onClick={onCellClick}
		>
			{children}
		</div>
	);
}

export function DroppableBin({ children }: { children: React.ReactNode }) {
	const { setNodeRef, isOver } = useDroppable({
		id: "recycle-bin",
	});
	return (
		<div
			ref={setNodeRef}
			className={`relative transition-all duration-200 ${isOver ? "scale-125 brightness-110 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]" : ""}`}
		>
			{children}
		</div>
	);
}

export function DraggableNote({
	note,
	onClick,
}: {
	note: Note;
	onClick: (note: Note) => void;
}) {
	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
		id: note.id,
		data: note,
	});

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			className={`absolute inset-0 flex items-center justify-center 
                ${isDragging ? "opacity-0" : "transition-transform duration-200 cursor-grab hover:scale-110 drop-shadow-md"}`}
			onClick={(e) => {
				e.stopPropagation();
				onClick(note);
			}}
		>
			<img
				src={pinNoteSvg}
				alt="pinned note"
				className="w-12 h-14 object-contain pointer-events-none"
			/>
		</div>
	);
}
