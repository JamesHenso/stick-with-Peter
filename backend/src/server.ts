import "dotenv/config";
import express from "express";
import { authRouter } from "./modules/auth/auth.routes.js";
import { noteRouter } from "./modules/note/note.routes.js";
import { taskRouter, noteTaskRouter } from "./modules/task/task.routes.js";
import { errorHandler } from "./common/middleware/error.middleware.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "OK" });
});

app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);
app.use("/api/notes", noteTaskRouter);
app.use("/api/tasks", taskRouter);

app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
