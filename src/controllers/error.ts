import { Request, Response, NextFunction } from "express";

export const get400 = (_req: Request, res: Response, _next: NextFunction) => {
    res.status(400).json({
        message: "Bad Request",
    });
};
