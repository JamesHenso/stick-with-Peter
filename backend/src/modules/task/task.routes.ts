import { Router } from "express";
import { validate } from "../../common/middleware/validate.middleware.js";
import { authenticate } from "../../common/middleware/auth.middleware.js";
import * as taskController from "./task.controller.js";
import { createTaskSchema, updateTaskSchema, taskIdParamSchema } from "./task.schema.js";

export const taskRouter: Router = Router();

taskRouter.use(authenticate);

taskRouter.patch("/:taskId", validate(updateTaskSchema), taskController.handleUpdateTask);
taskRouter.delete("/:taskId", validate(taskIdParamSchema), taskController.handleDeleteTask);

// Thêm task vào note tồn tại — mount chung dưới /api/notes
export const noteTaskRouter: Router = Router();

noteTaskRouter.use(authenticate);

noteTaskRouter.post("/:id/tasks", validate(createTaskSchema), taskController.handleAddTask);
