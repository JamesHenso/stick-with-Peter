import z from "zod"

const taskInput = z.object({
    content: z.string().min(1, "Content is required"),
    style: z.enum(["PENCIL", "BRUSH"]).default("PENCIL"),
    isCompleted: z.boolean().default(false),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    dueDate: z.coerce.date().nullable().optional(),
    stickerId: z.uuid("Invalid sticker").nullable().optional()
})  

export const createNoteSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        positionX: z.number().int(),
        positionY: z.number().int(),
        tasks: z.array(taskInput).min(1, "Note must have at least 1 task")
    })
})

export const updateNoteMetaSchema = z.object({
    params: z.object({ id: z.uuid("Invalid note id" )}),
    body: z.object({
        title: z.string().min(1).optional(),
        isPinned: z.boolean().optional()
    })
})

export const updateNotePositionSchema = z.object({
    params: z.object({ id: z.uuid("Invalid note id" )}),
    body: z.object({
        positionX: z.number().int(),
        positionY: z.number().int()
    })
})

export const noteIdParamSchema = z.object({
    params: z.object({ id: z.uuid("Invalid note id") })
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>["body"]
export type UpdateNoteMetaInput = z.infer<typeof updateNoteMetaSchema>["body"]
export type UpdateNotePositionInput = z.infer<typeof updateNotePositionSchema>["body"]