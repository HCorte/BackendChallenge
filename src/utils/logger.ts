import winston, { createLogger, format, transports } from "winston";

export const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        format.printf(({ timestamp, level, message, errorData, stack }) => {
            // Log structure with separate keys for message, errorData, and stack
            return JSON.stringify({
                timestamp,
                level,
                message,
                errorData: errorData || undefined, // Separate errorData field
                stack: stack || undefined, // Separate stack trace field
            });
        })
        // format.json()
    ),
    defaultMeta: {
        service: "user-service",
    },
    transports: [
        //
        // - Write all logs with importance level of `error` or higher to `error.log`
        //   (i.e., error, fatal, but not other levels)
        //
        new transports.File({
            filename: "error.log",
            level: "error",
        }),
        //
        // - Write all logs with importance level of `info` or higher to `combined.log`
        //   (i.e., fatal, error, warn, and info, but not trace)
        //
        new transports.File({
            filename: "combined.log",
        }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new transports.Console({
            format: winston.format.simple(),
        })
    );
}
