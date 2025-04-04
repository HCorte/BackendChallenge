import { MySqlError } from "../types/error/mysqlError";

const mysqlErrorMessages: { [key: string]: string } = {
    ER_ACCESS_DENIED_ERROR:
        "Access denied! Please check your database credentials.",
    ER_BAD_DB_ERROR: "The specified database does not exist.",
    ER_TABLE_EXISTS_ERROR: "The table already exists.",
    ER_NO_SUCH_TABLE: "The specified table does not exist.",
    ER_DUP_ENTRY: "Duplicate entry detected! Ensure unique values are used.",
    ER_LOCK_WAIT_TIMEOUT: "The request timed out due to a lock wait timeout.",
};

export function getMySqlError(error: MySqlError): {
    msg: string;
    code: string;
} {
    if (error.code && mysqlErrorMessages[error.code]) {
        return { msg: mysqlErrorMessages[error.code], code: error.code };
    }
    if (error.code && error.message) {
        return { msg: error.message, code: error.code };
    }
    return { msg: "An unknown MySQL error occurred.", code: "" };
}
