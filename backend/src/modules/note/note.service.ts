import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/utils/appError.js";
import type { CreateNoteInput, UpdateNoteMetaInput, UpdateNotePositionInput } from "./note.schema.js";

export const MAX_NOTES = 50

export const getMyNotes = (userId: string) => {
    return prisma.note.findMany({
        where: {userId},
        select: { id: true, positionX: true, positionY: true, isPinned: true },
        orderBy: {updated_at: "desc"}
    })
}

export const getMyNoteById = async (userId: string, id: string) => {
    await requireMyNote(userId, id)

    return prisma.note.findUnique({
        where: { id },
        include: {
            tasks: {
                include: {sticker: true}
            }
        }
    })
}

export const createNote = async(userId: string, data: CreateNoteInput) => {
    const count = await prisma.note.count({ where: {userId}})
    if(count >= MAX_NOTES) throw new AppError("Note limit reached", 409)

    return prisma.note.create({
        data: {
            userId,
            title: data.title,
            positionX: data.positionX,
            positionY: data.positionY,
            tasks: {
                create: data.tasks.map(({ content, style, isCompleted, priority, dueDate, stickerId }) => ({
                    content,
                    style,
                    isCompleted,
                    priority,
                    dueDate: dueDate ?? null,
                    ...(stickerId === undefined ? {} : { stickerId }),
                })),
            },
        },
        include: { tasks: { include: { sticker: true } } }
    })
}

const requireMyNote = async(userId: string, id: string) => {
    const note = await prisma.note.findFirst({ where: {id, userId} }) 
    if(!note) throw new AppError("Note not found", 404)
    return note
}

export const updateNoteMeta = async (userId: string, id: string, data: UpdateNoteMetaInput) => {
    await requireMyNote(userId, id)

    return prisma.note.update({ 
        where: { id }, 
        data: {
            ...(data.title === undefined ? {} : { title: data.title }),
            ...(data.isPinned === undefined ? {} : { isPinned: data.isPinned })
        } 
    })
};

export const moveNote = async (userId: string, id: string, data: UpdateNotePositionInput) => {
    await requireMyNote(userId, id)

    return prisma.note.update({
        where: {id},
        data: {
            positionX: data.positionX,
            positionY: data.positionY
        }
    })
}

export const deleteNote = async(userId: string, id: string) => {
    await requireMyNote(userId, id)
    return prisma.note.delete({
        where: {id}
    })
}