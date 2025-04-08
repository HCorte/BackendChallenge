// import express, { Request, Response, NextFunction } from "express";
// import { body } from "express-validator";

// import { isAuth } from "../middleware/is-auth.js";
// import { getMovies, postMovie } from "../controllers/movie.js";

// import { ErrorException, ErrorType } from "../utils/error.js";

// const router = express.Router();

// router.put(
//     "/updateMovie",
//     isAuth,
//     [
//         body("title").trim().not().isEmpty(),
//         body("title")
//             .trim()
//             .isLength({
//                 max: 250,
//             })
//             .withMessage("Max 2500 caracter's reached"),
//         body("summary")
//             .trim()
//             .isLength({
//                 max: 2500,
//             })
//             .withMessage("Max 2500 caracter's reached"),
//         body("summary")
//             .trim()
//             .isLength({
//                 min: 1,
//             })
//             .withMessage("summary field can't be empty"),
//     ],
//     postMovie
// );

// router.get("/movies", isAuth, getMovies);

// router.post(
//     "/createMovie",
//     isAuth,
//     [
//         body("title").trim().not().isEmpty(),
//         body("title")
//             .trim()
//             .isLength({
//                 max: 250,
//             })
//             .withMessage("Max 2500 caracter's reached"),
//         body("summary")
//             .trim()
//             .isLength({
//                 max: 2500,
//             })
//             .withMessage("Max 2500 caracter's reached"),
//         body("summary")
//             .trim()
//             .isLength({
//                 min: 1,
//             })
//             .withMessage("summary field can't be empty"),
//     ],
//     postMovie
// );

// router.post("/create", isAuth, postMovie);

// router.all("*", function (req: Request, _res: Response, next: NextFunction) {
//     const path = req.path;
//     const error = new ErrorException("Bad request????????");

//     error.errorType = ErrorType.WARNING;
//     error.data = {
//         path,
//     };
//     error.statusCode = 400;

//     console.log(`\nError encountered for path: ${path}\n`, error);
//     next(error);
// });

// export default router;
