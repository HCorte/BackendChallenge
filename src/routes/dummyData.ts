import express, { Request, Response, NextFunction } from "express";

import { dummyMovies } from "../controllers/dummyMovies.js";
import { isAuth } from "../middleware/is-auth.js";

import { ErrorException } from "../utils/error.js";

const router = express.Router();

router.post("/saveDummyMovies", isAuth, dummyMovies);

router.all("*", function (_req: Request, _res: Response, next: NextFunction) {
    const error = new ErrorException("Bad request");
    error.data = {
        status: 7,
    };
    error.statusCode = 400;
    next(error);
});

export default router;
