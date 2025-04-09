import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import "./db/index.js"; // Triggers the database connection

import multer, { FileFilterCallback } from "multer";

import { ErrorException, ErrorType } from "./utils/error.js";

import { logger } from "./utils/logger.js";

import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movie.js";
import dummyDataRoutes from "./routes/dummyData.js";

import { get400 } from "./controllers/error.js";

const app = express();

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

(async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const images_path = path.join(__dirname, "images");

    const fileStorage = multer.diskStorage({
        destination: (_req, _file, cb: DestinationCallback) => {
            cb(null, "dist/images");
        },
        filename: (req, file: Express.Multer.File, cb: FileNameCallback) => {
            const timestamp = new Date().toISOString();
            const filename = `${timestamp}-${file.originalname}`;
            req.filename = filename;
            //req.images_path = images_path;
            cb(null, filename);
        },
    });

    const fileFilter = (
        _req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ): void => {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    app.use(bodyParser.json());
    app.use(
        multer({
            storage: fileStorage,
            fileFilter: fileFilter,
        }).single("image")
    );

    /**
     * render static images from the path /images
     */
    app.use("/images", express.static(images_path));

    app.use((_req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, PATCH, DELETE"
        );
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );
        next();
    });

    // to manually handle OPTIONS requests of CORS preflight:
    app.options('*', (_req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.status(200).end(); // Respond with 200 OK
      });

    app.use("/auth", authRoutes);
    app.use("/movie", movieRoutes);
    app.use("/dummy", dummyDataRoutes);
    app.use(get400);

    app.use(
        (
            error: ErrorException,
            _req: Request,
            res: Response,
            next: NextFunction
        ) => {
            const status = error.statusCode || 500;
            const message = error.message;
            const data = error.data;

            switch (error.errorType) {
                case ErrorType.WARNING:
                    logger.warn({
                        message: message,
                        errorData: error.data,
                        stack: error.stack,
                    });
                    break;

                case ErrorType.INFO:
                    logger.info({
                        message: message,
                        errorData: error.data,
                    });
                    break;

                case ErrorType.ERROR:
                    logger.error({
                        message: message,
                        errorData: error.data,
                        stack: error.stack,
                    });
                    break;

                //only logging to see the frontend integration and also track user mistakes to improve UI
                case ErrorType.VALIDATION:
                    logger.info({
                        message: message,
                        errorData: error.data,
                    });
                    break;

                default:
                    logger.error({
                        message: message,
                        errorData: error.data,
                        stack: error.stack,
                    });
                    break;
            }

            // console.log(`error middleware message: ${message}`);
            if (error.errorType === ErrorType.VALIDATION) {
                res.status(status).json({
                    message,
                    data,
                });
            } else {
                res.status(status).json({
                    message,
                });
            }
            next();
        }
    );

    try {
        app.listen(process.env.PORT || 8080);
    } catch (error) {
        console.error("Unexpected error:", error);
    }
})();
