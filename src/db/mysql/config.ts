import dotenv from "dotenv";
dotenv.config();

export const dbConfig = {
    user: process.env.MYSQL_DB_USER as string,
    password: process.env.MYSQL_DB_PASSWORD as string,
    host: process.env.MYSQL_DB_HOST as string,
    database: process.env.MYSQL_DB_NAME as string,
    //params: process.env.MYSQL_DB_PARAMS || "", // Optional parameters (e.g., ?retryWrites=true&w=majority)
    waitForConnections: true,
    connectionLimit: 10, // Number of connections in the pool
    queueLimit: 0,
};
