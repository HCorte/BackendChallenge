import express, { Request, Response, NextFunction } from "express";

import { status, updateStatus } from "../controllers/user.js";
import { isAuth } from "../middleware/is-auth.js";

import { body } from "express-validator";
import { ErrorException } from "../utils/error.js";
import { checkDBConnection } from "../middleware/is-connected.js";

const router = express.Router();

router.get("/status", isAuth, status);

router.put(
    "/status",
    checkDBConnection,
    isAuth,
    [body("status").trim().not().isEmpty()],
    updateStatus
);

router.all("*", function (_req: Request, _res: Response, next: NextFunction) {
    const error = new ErrorException("Bad request");
    error.statusCode = 400;
    next(error);
});

export default router;
