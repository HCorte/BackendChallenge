/* eslint-disable indent */
import express, {Request} from "express";
import { body } from "express-validator";

// import { User } from "../db/mongodb/models/user.js";
import { findUser } from "../services/authService.js";
import { signup, login } from "../controllers/auth.js";
import { ErrorException, ErrorType } from "../utils/error.js";
import { checkDBConnection } from "../middleware/is-connected.js";

const router = express.Router();

router.post(
    "/signup",
    checkDBConnection,
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email.")
            .custom(async (value) => {
                const userDoc = await findUser({
                    email: value,
                });
                if (userDoc) {
                    return Promise.reject("E-mail address already exists");
                }
            })
            .normalizeEmail(),
        body("password")
            .trim()
            .isLength({
                min: 5,
            })
            .withMessage("Not a strong password"),
        body("firstname").trim().not().isEmpty(),
        body("lastname").trim().not().isEmpty(),
    ],
    signup
);

router.post("/login", checkDBConnection, login);

router.all("*", function (req: Request) {
    const error = new ErrorException("Bad Request");
    error.errorType = ErrorType.WARNING;
    error.statusCode = 400;
    error.data = {
        status: 8,
        path: req.originalUrl,
        method: req.method,
    };
    throw error;
});

export default router;
