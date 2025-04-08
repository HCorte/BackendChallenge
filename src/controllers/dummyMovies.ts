import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import Movie from "../db/mysql/models/movie.js";
import { ErrorException } from "../utils/error.js";

import { Request, Response, NextFunction } from "express";

/**
 *
 * @param req
 * @param res
 * @param next
 *
 * later on improve and make shure only a admin user could call this endpoint
 * or some other control to not use it lightly
 */
export const dummyMovies = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const filePath = path.join(__dirname, "../../dummyData/movies.json");
        const data = await fs.readFile(filePath, "utf-8");
        const movies = JSON.parse(data);

        const dataMovies = await Movie.insertMany(movies);

        res.status(200).json({
            message: "Dummy Movies Inserted in bulk",
            data: dataMovies,
        });

        // } else {
        //     res.status(400).json({
        //         error: "Bad Request",
        //         data: {
        //             status: 3,
        //         },
        //     });
        // }
    } catch (error) {
        error instanceof ErrorException ? next(error) : console.warn(error);
    }
};
