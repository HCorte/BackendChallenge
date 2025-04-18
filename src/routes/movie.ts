import express, {Request} from "express";
// import { body } from "express-validator";

import { body } from "express-validator";

import { getMovies, postMovie, getMovieById, getMoviesWithFilters } from "../controllers/movie.js";
import { isAuth } from "../middleware/is-auth.js";
import { ErrorException, ErrorType } from "../utils/error.js";

const router = express.Router();

router.get("/movies", isAuth, getMovies);

router.get("/moviesfiltered", isAuth, getMoviesWithFilters),

router.post(
    "/create",
    isAuth,
    [
        body("title").trim().not().isEmpty(),
        body("title")
            .trim()
            .isLength({
                max: 250,
            })
            .withMessage("Max 2500 caracter's reached"),
        body("summary")
            .trim()
            .isLength({
                max: 2500,
            })
            .withMessage("Max 2500 caracter's reached"),
        body("summary")
            .trim()
            .isLength({
                min: 1,
            })
            .withMessage("summary field can't be empty"),
    ],
    postMovie
);

router.get("/movieById", isAuth, getMovieById);

router.all("*", function (req: Request) {
    const error = new ErrorException("Bad Request");
    error.errorType = ErrorType.WARNING;
    error.statusCode = 400;
    error.data = {
        status: 5,
        path: req.originalUrl,
        method: req.method,
    };
    throw error;
});

export default router;
