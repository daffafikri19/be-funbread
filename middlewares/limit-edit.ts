import { NextFunction, Request, Response } from "express";

export const checkLimitUpdateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createTime  = req.body.report_date;
        
        console.log("CREATED TIME :", createTime)
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error at middleware function",
            error: error
        })
    }
}