import z from "zod"

const taskBody = z.object({
    content: z.string().min(1, "Content is required").optional(),
    style: z.enum(["PENCIL", "BRUSH"]).optional(),
    isCompleted: z.boolean().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    dueDate: z.coerce.date().nullable().optional(),
    stickerId: z.uuid("Invalid sticker").nullable().optional(),
})

export const createTaskSchema = z.object({
    params: z.object({ id: z.uuid("Invalid note id") }),
    body: z.object({
        content: z.string().min(1, "Content required"),
        style: z.enum(["PENCIL", "BRUSH"]).default("PENCIL"),
        isCompleted: z.boolean().default(false),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
        dueDate: z.coerce.date().nullable().optional(),
        stickerId: z.uuid("Invalid sticker").nullable().optional()
    })
})

export const updateTaskSchema = z.object({
    params: z.object({ taskId: z.uuid("Invalid task id") }),
    body: taskBody.refine((d) => Object.keys(d).length > 0, { message: "At least one field required" })
})

export const taskIdParamSchema = z.object({
    params: z.object({ taskId: z.uuid("Invalid task id") }),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>["body"]
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>["body"]