import { useNavigate } from "react-router-dom";
import cookBoardImage from "../../assets/cookboard.svg";
import "@fontsource/lexend/400.css";
import "@fontsource/lexend/500.css";
import "@fontsource/lexend/600.css";
import "@fontsource/lexend/700.css";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { auth, provider, db } from "../../firebaseConfig";
import { useAuth } from "../../hooks/useAuth";

async function saveUserToDb(user: {
	uid: string;
	displayName: string | null;
	email: string | null;
	photoURL: string | null;
}) {
	const userRef = ref(db, `users/${user.uid}`);
	const snapshot = await get(userRef);
	if (!snapshot.exists()) {
		await set(userRef, {
			displayName: user.displayName ?? "Anonymous",
			email: user.email ?? "",
			photoURL: user.photoURL ?? "",
			createdAt: Date.now(),
		});
	}
}

function CookBoard() {
	const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
	const { user, loading } = useAuth();
	const navigate = useNavigate();

	const handleOpenDesk = async () => {
		if (user) {
			navigate("/stick-note");
			return;
		}
		setIsLoggingIn(true);
		try {
			const result = await signInWithPopup(auth, provider);
			await saveUserToDb({
				uid: result.user.uid,
				displayName: result.user.displayName,
				email: result.user.email,
				photoURL: result.user.photoURL,
			});
			navigate("/stick-note");
		} catch (err) {
			console.error("Login error:", err);
		} finally {
			setIsLoggingIn(false);
		}
	};

	return (
		<div className="bg-linear-to-r from-[#fef6e4] to-[#f3d2c1] flex items-center justify-center h-screen w-full">
			<div className="relative flex items-center justify-center w-full h-full">
				<img
					src={cookBoardImage}
					alt="Cook board"
					className="w-5xl max-w-full min-h-screen object-contain"
				/>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-20 flex flex-col items-center justify-center font-lexend">
					<h1 className="text-[40px] font-bold text-[#2F2A1B] pb-2">
						stick it with Peter
					</h1>
					<p className="pb-4 text-2xl text-[#2F2A1B]">
						a simple way to focus on what matters
					</p>
					<button
						onClick={handleOpenDesk}
						disabled={isLoggingIn || loading}
						className="text-[#2D2926] font-semibold text-xl border-7 rounded-[36px] border-[#B86F3C] bg-white w-80 h-17.5 cursor-pointer hover:bg-[#E7CBC0] hover:-translate-y-1 transition-all duration-500 ease-in-out disabled:opacity-60"
					>
						{isLoggingIn ? "đang mở..." : "open your desk"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default CookBoard;
