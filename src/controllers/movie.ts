import Movie from "../db/mysql/models/movie.js";
import { ErrorException } from "../utils/error.js";

import { Request, Response, NextFunction } from "express";

export const getMovies = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { currentPage, moviesPerPage } = req.query;
        const page = Number(currentPage) || 1;
        const limit = Number(moviesPerPage) || 30;
        const movies = await Movie.findWithPagination(page, limit);
        res.status(200).json({
            message: "List of Movies",
            movies,
        });
    } catch (error) {
        error instanceof ErrorException ? next(error) : console.warn(error);
    }
};

export const postMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.userId) {
            const {
                title,
                summary,
                dateRelease = new Date(),
                image,
                favorit = false,
            } = req.body;

            const filename = req.filename || image || "default_thumbnail.png";
            const movie = await Movie.create({
                userId: Number(req.userId),
                title,
                summary,
                filename,
                dateRelease,
                favorit,
            });
            res.status(200).json({
                message: "Movie created Successfully",
                data: movie,
            });
        } else {
            res.status(400).json({
                error: "Bad Request",
                data: {
                    status: 2,
                },
            });
        }
    } catch (error) {
        error instanceof ErrorException ? next(error) : console.warn(error);
    }
};
