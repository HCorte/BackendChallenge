import User from "../db/mysql/models/user.js";
import { ErrorException, errorHandling } from "../utils/error.js";

import { Request, Response, NextFunction } from "express";

export const status = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.userId) {
            const user = await User.findById(req.userId);
            if (!user) {
                const error = new ErrorException("Invalid user");
                error.statusCode = 404; //401
                throw error;
            }
            res.status(200).json({
                status: user.status,
            });
        } else {
            res.status(400).json({
                error: "Bad Request",
            });
        }
    } catch (error) {
        error instanceof ErrorException
            ? next(errorHandling(error))
            : console.warn(error);
    }
};

export const updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.userId) {
            const { status } = req.body;
            const user = (await User.findById(req.userId))!;
            user.status = status || "updated";
            if (!user) {
                const error = new ErrorException("User not found");
                error.statusCode = 404;
                throw error;
            }

            await user.update();
            res.status(200).json({
                message: "user status updated successfully",
                status: user.status,
            });
        } else {
            res.status(400).json({
                error: "Bad Request",
            });
        }
    } catch (error) {
        error instanceof ErrorException
            ? next(errorHandling(error))
            : console.warn(error);
    }
};
