// import { ErrorException, errorHandling } from "../utils/error.js";
import { Request, Response, NextFunction } from "express";
import { PoolConnection } from "mysql2/promise";
import MySQL from "../db/mysql/connection.js";
import dotenv from "dotenv";
dotenv.config();

export const checkDBConnection = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let connection: PoolConnection | null = null;

        connection = await MySQL.getConnection();
        req.db = connection;

        res.on("finish", async () => {
            if (connection) {
                connection.release(); //Always release connection after request
            }
        });

        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ message: "Database connection failed" });
    }
};
