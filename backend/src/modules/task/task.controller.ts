import type { Request, Response, NextFunction } from "express"
import * as taskService from "./task.service.js"

export const handleAddTask = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{
        const data = await taskService.addTask(req.user!.id, req.params.id as string, req.body)
        res.status(201).json({
            success: true,
            message: "Task added",
            data
        })
    } catch(error){
        next(error)
    }
}

export const handleUpdateTask = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{
        const data = await taskService.updateTask(req.user!.id, req.params.taskId as string, req.body)
        res.status(200).json({
            success: true,
            data
        })
    } catch(error){
        next(error)
    }
}

export const handleDeleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{
        await taskService.deleteTask(req.user!.id, req.params.taskId as string)
        res.status(200).json({
            success: true,
            message: "Task deleted",
        })
    } catch(error){
        next(error)
    }
}