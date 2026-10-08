import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/utils/appError.js";
import type { CreateTaskInput, UpdateTaskInput } from "./task.schema.js";

const requireMyTask = async(userId: string, taskId: string) => {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            note: { userId }
        }
    })
    if(!task) throw new AppError("Task not found", 404)
    return task
}

export const addTask = async(userId: string, noteId: string, data: CreateTaskInput) => {
    const note = await prisma.note.findFirst({
        where: {
            id: noteId,
            userId
        }
    })
    if(!note) throw new AppError("Note not found", 404)
    
    const { dueDate, stickerId, ...taskData } = data

    return prisma.task.create({
        data: {
            noteId,
            ...taskData,
            ...(dueDate !== undefined ? { dueDate } : {}),
            ...(stickerId !== undefined ? { stickerId } : {})
        }
    })
}

export const updateTask = async(userId: string, taskId: string, data: UpdateTaskInput) => {
    await requireMyTask(userId, taskId)

    return prisma.task.update({
        where: {id: taskId},
        data: {
            ...(data.content !== undefined ? { content: data.content } : {}),
            ...(data.style !== undefined ? { style: data.style } : {}),
            ...(data.isCompleted !== undefined ? { isCompleted: data.isCompleted } : {}),
            ...(data.priority !== undefined ? { priority: data.priority } : {}),
            ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
            ...(data.stickerId !== undefined ? { stickerId: data.stickerId } : {})
        }
    })
}

export const deleteTask = async(userId: string, taskId: string) => {
    await requireMyTask(userId, taskId)
    return prisma.task.delete({ where: {id: taskId}})
}