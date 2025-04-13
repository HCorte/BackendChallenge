/* eslint-disable indent */
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { ErrorException, ErrorType } from "../utils/error.js";
import { Request, Response, NextFunction } from "express";
import { createUser, findUserByUsername } from "../services/authService.js";
import User from "../db/mysql/models/user.js";

export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new ErrorException("User Signup - Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            error.errorType = ErrorType.VALIDATION;
            throw error;
        }
        const { username, email, password, firstname, lastname } = req.body;
        const hashPassword = await bcrypt.hash(password, 12);

        const userCreated = await createUser({
            username,
            email,
            password: hashPassword,
            firstname,
            lastname,
        });
        if (userCreated && userCreated instanceof User) {
            res.status(201).json({
                message: "User created successfully",
                userId: userCreated.id,
            });
        } else {
            const error = new ErrorException(
                "User Signup Failed try again later"
            );
            error.statusCode = 500;
            error.errorType = ErrorType.ERROR;
            error.data = {
                username,
                email,
            };
            throw error;
        }
    } catch (error) {
        error instanceof ErrorException ? next(error) : console.warn(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, password } = req.body;
        if (!(username && password)) {
            const error = new ErrorException("Bad Request");
            error.statusCode = 400;
            error.errorType = ErrorType.WARNING;
            throw error;
        }

        const user = await findUserByUsername({ username });
        if (!user) {
            const error = new ErrorException(
                "This username or password is invalid"
            );
            error.statusCode = 401;
            error.errorType = ErrorType.INFO;
            error.data = {
                username,
            };
            throw error;
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            const error = new ErrorException(
                "This username or password is invalid"
            );
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                username: user.username,
                email: user.email,
                userId: user.id,
            },
            "NodeJS rules and keeps growing its base",
            {
                expiresIn: "8h",
                //expiresIn: "1m", //for testing purposes
            }
        );
        res.status(200).json({
            message: "login success",
            token,
            userId: user.id,
        });
        return;
    } catch (err) {
        err instanceof ErrorException ? next(err) : console.warn(err);
    }
};
