import express from "express";
// import { body } from "express-validator";

import { body } from "express-validator";

import { getMovies, postMovie } from "../controllers/movie.js";
import { isAuth } from "../middleware/is-auth.js";
import { ErrorException, ErrorType } from "../utils/error.js";

const router = express.Router();

router.get("/movies", isAuth, getMovies);

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

// router.put("/taskCompleted", checkDBConnection, isAuth, completeTask);

router.all("*", function () {
    const error = new ErrorException("Bad Request");
    error.errorType = ErrorType.WARNING;
    error.data = {
        status: 5,
    };
    error.statusCode = 400;
    throw error;
});

export default router;
