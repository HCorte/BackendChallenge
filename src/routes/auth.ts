/* eslint-disable indent */
import express from "express";
import { body } from "express-validator";

// import { User } from "../db/mongodb/models/user.js";
import { findUser } from "../services/authService.js";
import { signup, login } from "../controllers/auth.js";

import { ErrorException } from "../utils/error.js";
import { checkDBConnection } from "../middleware/is-connected.js";

const router = express.Router();

router.put(
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

router.all("*", function () {
    const error = new ErrorException("Bad request");
    error.statusCode = 400;
    throw error;
});

export default router;
