import { useEffect } from "react";
import paperNote from "../../assets/note.svg";
import frogHand from "../../assets/froghand.svg";
interface SlideUpNoteProps {
	isOpen: boolean;
	onClose: () => void;
}

function SlideUpNote({ isOpen, onClose }: SlideUpNoteProps) {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);
	return (
		<div
			className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-all duration-500 ease-in-out ${
				isOpen
					? "opacity-100 pointer-events-auto"
					: "opacity-0 pointer-events-none"
			}`}
			onClick={onClose}
			aria-hidden={!isOpen}
		>
			<div
				className={`absolute bottom-0 left-130 z-60 translate-y-full 
        ${isOpen ? "animate-[push-and-exit_3s_ease-in-out_forwards]" : ""}`}
			>
				<img src={frogHand} alt="frogHand" className="w-120" />
			</div>
			<div
				className={`fixed bottom-40 left-0 right-0 z-50 w-140 mx-auto transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${
					isOpen ? "translate-y-0" : "translate-y-[120%]"
				}`}
				style={{ height: "70vh" }}
				onClick={(event) => event.stopPropagation()}
			>
				<img src={paperNote} alt="paperNote" />
			</div>
		</div>
	);
}

export default SlideUpNote;
