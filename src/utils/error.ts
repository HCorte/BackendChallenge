import { ErrorType } from "../types/error/errorType.js";

export { ErrorType };

export class ErrorException extends Error {
    //public readonly message: string;
    //public statusCode: number;
    //private data: object;
    constructor(
        readonly message: string,
        public statusCode?: number,
        public errorType: ErrorType = ErrorType.ERROR,
        public data?: object
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
}

export const errorHandling = (error: ErrorException) => {
    if (!error.statusCode) {
        error.statusCode = 500;
    }
    return error;
};
