import Movie from "../db/mysql/models/movie.js";
import { ErrorException } from "../utils/error.js";

import { Request, Response, NextFunction } from "express";

export const getMoviesWithFilters = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { ntop, year } = req.query;
        const numberOfTopMovies = Number(ntop) || 10;
        const yearReleased = Number(year) || 0;

        const host = req.get("host"); // e.g., 'localhost:3000' or 'example.com'
        const protocol = req.protocol; // 'http' or 'https'

        const movies = await Movie.findWithFilter(
            numberOfTopMovies,
            yearReleased
        );
        if (movies) {
            movies.map((movie) => {
                if (!movie.thumbnail?.includes("http")) {
                    movie.thumbnail = `${protocol}://${host}/images/${movie.thumbnail}`;
                }
            });
            res.status(200).json({
                message: "List of Movies",
                movies,
            });
        } else {
            res.status(200).json({
                message: "List of Movies",
                movies: [],
            });
        }
    } catch (error) {
        error instanceof ErrorException ? next(error) : console.warn(error);
    }
};

export const getMovieById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { movieId } = req.query;
        if (movieId) {
            const movie = await Movie.findById(movieId as string);
            res.status(200).json({
                message: "Movie Detail",
                data: {
                    movieId,
                    movie,
                },
            });
        }
    } catch (error) {
        error instanceof ErrorException ? next(error) : console.warn(error);
    }
};

export const getMovies = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { currentPage, moviesPerPage } = req.query;
        const page = Number(currentPage) || 1;
        const limit = Number(moviesPerPage) || 30;

        const host = req.get("host"); // e.g., 'localhost:3000' or 'example.com'
        const protocol = req.protocol; // 'http' or 'https'

        const movies = await Movie.findWithPagination(page, limit);
        if (movies) {
            movies.map((movie) => {
                if (!movie.thumbnail?.includes("http")) {
                    movie.thumbnail = `${protocol}://${host}/images/${movie.thumbnail}`;
                }
            });
            res.status(200).json({
                message: "List of Movies",
                movies,
            });
        } else {
            res.status(200).json({
                message: "List of Movies",
                movies: [],
            });
        }
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
                revenue = 0,
                // favorit = false,
            } = req.body;

            const filename = req.filename || image || "default_thumbnail.png";
            const movie = await Movie.create({
                userId: Number(req.userId),
                title,
                summary,
                filename,
                dateRelease,
                revenue,
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
