import { Router } from "express";
import { validate } from "../../common/middleware/validate.middleware.js";
import { authenticate } from "../../common/middleware/auth.middleware.js";
import * as noteController from "./note.controller.js";
import { createNoteSchema, updateNoteMetaSchema, updateNotePositionSchema, noteIdParamSchema } from "./note.schema.js";

export const noteRouter: Router = Router()

noteRouter.use(authenticate)

noteRouter.get("/", noteController.handleGetNotes)
noteRouter.get("/:id", validate(noteIdParamSchema), noteController.handleGetNoteById)
noteRouter.post("/", validate(createNoteSchema), noteController.handleCreateNote)
noteRouter.patch("/:id/position", validate(updateNotePositionSchema), noteController.handleMoveNote)
noteRouter.patch("/:id", validate(updateNoteMetaSchema), noteController.handleUpdateNoteSchema)
noteRouter.delete("/:id", validate(noteIdParamSchema), noteController.handleDeleteNote)