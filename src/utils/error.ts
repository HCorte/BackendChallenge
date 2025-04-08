import { ErrorType } from "../types/error/errorType.js";

export { ErrorType };

export class ErrorException extends Error {
    //public readonly message: string;
    //public statusCode: number;
    //private data: object;
    constructor(
        readonly message: string,
        public statusCode: number = 500,
        public errorType: ErrorType = ErrorType.ERROR,
        public data?: object
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

// export const errorHandling = (error: ErrorException) => {
//     if (!error.statusCode) {
//         error.statusCode = 500;
//     }
//     return error;
// };
