import { Routes, Route } from "react-router-dom";
import CookBoard from "./components/home/cookBoard";
import StickNote from "./components/note/stickNote";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<CookBoard />} />
			<Route path="/stick-note" element={<StickNote />} />
		</Routes>
	);
};

export default App;
