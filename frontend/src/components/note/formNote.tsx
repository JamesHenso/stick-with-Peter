import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import "@fontsource/caveat/700.css";
import "@fontsource/patrick-hand/index.css";
import sticker from "../../assets/sticker.svg";
import pencil from "../../assets/pencil.svg";
import brush from "../../assets/brush.svg";

interface FormNoteProps {
	isOpen: boolean;
	onClose: () => void;
	onNoteComplete?: (content: string) => void;
	initialContent?: string;
}

function FormNote({
	isOpen,
	onClose,
	onNoteComplete,
	initialContent,
}: FormNoteProps) {
	const [tasks, setTasks] = useState<
		{ id: string; description: string; is_completed: boolean }[]
	>([]);
	const [newTask, setNewTask] = useState<string>("");
	const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
	const [prevContent, setPrevContent] = useState(initialContent);

	if (isOpen !== prevIsOpen || initialContent !== prevContent) {
		setPrevIsOpen(isOpen);
		setPrevContent(initialContent);

		if (isOpen) {
			if (initialContent) {
				let parsedTasks: {
					id: string;
					description: string;
					is_completed: boolean;
				}[] = [];
				try {
					parsedTasks = JSON.parse(initialContent);
				} catch {
					parsedTasks = initialContent
						.split("\n")
						.filter((line) => line.trim() !== "")
						.map((line, index) => {
							const is_completed = line.startsWith("✓");
							const description = line.replace(/^[✓○]\s*/, "");
							return {
								id: `task-${index}`,
								description,
								is_completed,
							};
						});
				}
				setTasks(parsedTasks);
			} else {
				setTasks([]);
			}
		}
	}

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	const handleAddTask = () => {
		if (newTask.trim() !== "") {
			setTasks([
				...tasks,
				{
					id: Math.random().toString(36).substring(2, 9),
					description: newTask,
					is_completed: false,
				},
			]);
			setNewTask("");
		}
	};

	const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddTask();
		}
	};

	const handleToggleTask = (taskID: string) => {
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				taskID === task.id
					? { ...task, is_completed: !task.is_completed }
					: task,
			),
		);
	};

	const handleDeleteTask = (taskID: string) => {
		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskID));
	};

	const handleTickComplete = (event: React.MouseEvent) => {
		event.stopPropagation();

		if (tasks.length === 0) {
			onClose();
			return;
		}

		const content = JSON.stringify(tasks);

		if (onNoteComplete) {
			onNoteComplete(content);
		} else {
			onClose();
		}
	};

	return (
		<div
			className={`fixed inset-0 z-30 bg-linear-to-r from-[#fef6e4] to-[#f3d2c1] backdrop-blur-sm transition-all duration-500 ease-in-out
            ${
				isOpen
					? "opacity-100 pointer-events-auto"
					: "opacity-0 pointer-events-none"
			}`}
			onClick={onClose}
			aria-hidden={!isOpen}
		>
			<div
				className={`relative p-4 flex flex-col z-50 mx-auto mt-20 w-125 min-h-90 border-6 border-[#b47605] bg-[#f8c760] rounded-[8px_8px_36px_8px] shadow-lg transform transition-all duration-500 ease-in-out
                ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
				onClick={(event) => event.stopPropagation()}
			>
				<h4 className="text-[36px] font-caveat font-bold text-center opacity-40">
					add title
				</h4>
				<div className="flex flex-col gap-1">
					{tasks.map((task) => (
						<div
							key={task.id}
							className="flex items-center justify-between p-[6px_12px_6px_8px]"
						>
							<div className="flex items-center gap-2.5 flex-1 min-w-0">
								<button
									type="button"
									onClick={() => handleToggleTask(task.id)}
									className={`border-3 w-5 h-5 rounded-sm cursor-pointer flex items-center justify-center
                                        ${task.is_completed ? "bg-[#639922] border-[#639922]" : "border-[#b47605] bg-[#f8c760]"}`}
								>
									{task.is_completed && (
										<svg
											width="14"
											height="14"
											viewBox="0 0 52 52"
											fill="none"
										>
											<path
												d="M14 26 L22 34 L38 18"
												fill="none"
												stroke="#FFFFFF"
												strokeWidth="6"
												strokeLinecap="round"
												strokeLinejoin="round"
												transform="translate(26,26) scale(1.2) translate(-26,-26)"
											></path>
										</svg>
									)}
								</button>

								<span
									className={`text-[22px] font-semibold font-patrick-hand flex-1 ${
										task.is_completed
											? "line-through opacity-50"
											: ""
									}`}
								>
									{task.description}
								</span>
							</div>

							<button
								onClick={() => handleDeleteTask(task.id)}
								className="ml-2 shrink-0 opacity-50 hover:opacity-100 hover:text-red-600 font-bold transition-opacity cursor-pointer px-1"
								title="Delete"
							>
								x
							</button>
						</div>
					))}
				</div>
				<div className="flex items-center mt-1 gap-2.5 p-[6px_12px_6px_8px] opacity-60">
					<button
						type="button"
						className="border-3 w-5 h-5 border-[#b47605] bg-[#f8c760] rounded-sm cursor-pointer"
						onClick={handleAddTask}
					></button>
					<input
						type="text"
						value={newTask}
						onChange={(e) => setNewTask(e.target.value)}
						onKeyDown={handleInputKeyDown}
						placeholder="tap to add ..."
						className="w-full bg-transparent text-[20px] font-bold font-patrick-hand outline-none placeholder:text-[#2d2926]/55"
					/>
				</div>
				{/* ─── Tick (✓) button — ghim note lên bảng ── */}
				<button
					className="absolute z-40 top-74 left-109 cursor-pointer"
					onClick={handleTickComplete}
				>
					<svg
						width="52"
						height="52"
						viewBox="0 0 52 52"
						fill="none"
						style={{ display: "block", overflow: "visible" }}
					>
						<line
							x1="52"
							y1="0"
							x2="0"
							y2="0"
							stroke="#b47605"
							strokeWidth="4"
							strokeLinecap="round"
						></line>
						<line
							x1="0"
							y1="52"
							x2="0"
							y2="0"
							stroke="#b47605"
							strokeWidth="4"
							strokeLinecap="round"
						></line>
						<path
							d="M14 26 L22 34 L38 18"
							fill="none"
							stroke="#b47605"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
							transform="translate(26,26) scale(0.8) translate(-26,-26)"
						></path>
					</svg>
				</button>
				<div className="absolute z-40 top-100 left-80 -translate-x-70 flex">
					<img src={sticker} alt="" />
					<img src={pencil} alt="" />
					<img src={brush} alt="" />
				</div>
			</div>
		</div>
	);
}

export default FormNote;
