import closeNote from "../../assets/close.svg";
import toolTip from "../../assets/tooltip.svg";
import Note from "../../assets/stick.svg";
import BrainStorm from "../../assets/brainstorm.svg";
import Goals from "../../assets/goals.svg";
import Scan from "../../assets/polaroid.svg";
import { useState } from "react";
import FormNote from "./formNote";
interface GroupNoteProps {
	isOpen: boolean;
	onClose: () => void;
	onNoteComplete?: (content: string) => void;
}

function GroupNote({ isOpen, onClose, onNoteComplete }: GroupNoteProps) {
	const [isOpenNote, setIsOpenNote] = useState<boolean>(false);
	return (
		<div
			className={`fixed inset-0 z-20 bg-gray-300/40 backdrop-blur-sm transition-all duration-300 ease-in-out 
            ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
			onClick={onClose}
			aria-hidden={!isOpen}
		>
			{!isOpenNote && (
				<div
					className={`fixed top-143 right-148 z-50 scale-130 transition-all duration-400 ease-in-out
            ${isOpen ? "blur-none" : "blur-sm"}`}
					onClick={(event) => event.stopPropagation()}
					style={{ height: "70vh" }}
				>
					<div className="relative inline-block">
						<img src={toolTip} alt="toolTip" className="block" />
						<div className="absolute top-3 left-3.5 flex items-center justify-center gap-4">
							<img
								className="cursor-pointer"
								src={Note}
								alt="Note"
								onClick={(event) => {
									event.stopPropagation();
									setIsOpenNote(true);
								}}
							/>
							<img src={BrainStorm} alt="BrainStorm" />
							<img src={Goals} alt="Goals" />
							<img src={Scan} alt="Scan" />
						</div>
					</div>

					<img
						src={closeNote}
						alt="closeNote"
						className="mt-3 translate-x-45 cursor-pointer"
						onClick={(event) => {
							event.stopPropagation();
							onClose();
						}}
					/>
				</div>
			)}
			<FormNote
				isOpen={isOpenNote}
				onClose={() => setIsOpenNote(false)}
				onNoteComplete={(content) => {
					setIsOpenNote(false);
					onClose();
					onNoteComplete?.(content);
				}}
			/>
		</div>
	);
}

export default GroupNote;
