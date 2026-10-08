import type { Request, Response, NextFunction } from "express";
import * as noteService from "./note.service.js"

export const handleGetNotes = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{
        const data = await noteService.getMyNotes(req.user!.id)
        res.status(200).json({
            success: true,
            data
        })
    } catch(error){
        next(error)
    }
}

export const handleGetNoteById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{
        const data = await noteService.getMyNoteById(req.user!.id, req.params.id as string)
        res.status(200).json({
            success: true,
            data
        })
    } catch(error){
        next(error)
    }
}

export const handleCreateNote = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{
        const data = await noteService.createNote(req.user!.id, req.body)
        res.status(201).json({
            success: true,
            message: "Note created",
            data
        })
    } catch(error){
        next(error)
    }
}

export const handleUpdateNoteSchema = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{
        const data = await noteService.updateNoteMeta(req.user!.id, req.params.id as string, req.body)
        res.status(200).json({
            success: true,
            data
        })
    } catch(error){
        next(error)
    }
}

export const handleMoveNote = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{
        const data = await noteService.moveNote(req.user!.id, req.params.id as string, req.body)
        res.status(200).json({
            success: true,
            data
        })
    } catch(error){
        next(error)
    }
}

export const handleDeleteNote = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{
        await noteService.deleteNote(req.user!.id, req.params.id as string)
        res.status(200).json({
            success: true,
            message: "Note deleted",
        })
    } catch(error){
        next(error)
    }
}