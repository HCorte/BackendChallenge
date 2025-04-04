import jwt from "jsonwebtoken";
import {
    ErrorException,
    // errorHandling
} from "../utils/error.js";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
    username: string;
    email: string;
    userId: string;
}
/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader) {
            const error = new ErrorException("Not authenticated.");
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(" ")[1];
        let decodedToken;

        decodedToken = jwt.verify(
            token,
            "NodeJS rules and keeps growing its base"
        ) as JwtPayload;
        if (!decodedToken) {
            const error = new ErrorException("Not authenticated.");
            error.statusCode = 401;
            throw error;
        }
        req.userId = decodedToken.userId;
        req.username = decodedToken.email;
        next();
    } catch (error: unknown) {
        if (error instanceof jwt.TokenExpiredError) {
            console.info("JWT expired:", error.message);
            res.status(401).json({
                error: "Unauthorized",
                message: "Session expired. Please log in again.",
            });
        } else if (error instanceof jwt.JsonWebTokenError) {
            //more generic message against any illicit attemps to access
            res.status(401).json({
                error: "Unauthorized",
                message: "Authentication failed. Please log in again.",
                //message: "Invalid token. Please log in again.",
            });
            console.error("JWT error:", error.message);
        } else if (error instanceof jwt.NotBeforeError) {
            res.status(401).json({
                error: "Unauthorized",
                message: "Authentication failed. Please log in again.",
            });
            console.error("JWT not active yet:", error.message);
        } else if (
            error instanceof ErrorException &&
            error.statusCode === 401
        ) {
            res.status(401).json({
                error: "AuthorizationHeaderMissing",
                message: "Authentication failed. Please log in again.",
            });
        } else {
            res.status(500).json({
                error: "InternalServerError",
                message: "Something went wrong. Please Contact support.",
            });
            // error instanceof ErrorException
            //     ? next(errorHandling(error))
            //     : console.warn(error);
        }
    }
};
