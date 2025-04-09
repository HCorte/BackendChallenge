import mysql, { Pool, PoolConnection } from "mysql2/promise";
import { dbConfig } from "./config.js";
import { MySqlError } from "../../types/error/mysqlError.js";
import { getMySqlError } from "../../utils/mysqlErrorHandler.js";

export { MySqlError };
class MySQL {
    private static instance: MySQL;
    private pool: Pool | null = null;

    private constructor() {} // Private constructor to enforce singleton

    public static getInstance() {
        if (!MySQL.instance) {
            MySQL.instance = new MySQL();
        }
        return MySQL.instance;
    }

    public async createPool(): Promise<void> {
        try {
            this.pool = mysql.createPool(dbConfig);
            // Try to execute a simple query to check if the connection pool is working
            await this.pool.query("SELECT 1");
            console.log("Database exists and pool is connected!");
        } catch (error: unknown) {
            if (error instanceof Error) {
                const mysqlError = error as MySqlError; // Type assertion
                if (mysqlError.errno === 1049) {
                    console.error(`\n\nerror: ${mysqlError.sqlMessage}\n\n`);
                    /**
                     * the database does not exist then it created here
                     * not running in the background because of errors that could be
                     * triggered because of not finishing the db in time for a query
                     */
                    try {
                        await this.createDatabaseIfNotExists();
                        this.pool = mysql.createPool(dbConfig);
                        console.log("Database created and pool established!");
                    } catch (dbCreationError) {
                        /**
                         * If database creation fails, handle the failure
                         * in a future release implement with retries logic
                         */
                        console.error(
                            "Error creating database:",
                            dbCreationError
                        );
                        throw new Error(
                            "Failed to create the database after error 1049."
                        );
                    }
                }
            }
        }
    }

    // Function to create the database if it doesn't exist
    private createDatabaseIfNotExists = async (): Promise<void> => {
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
        });

        try {
            // Create the database
            await connection.query(
                `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`
            );
        } catch (err) {
            console.error("Error creating database:", err);
            throw err; // Rethrow the error to be caught in the caller function
        } finally {
            // Close the temporary connection
            await connection.end();
        }
    };

    // Get a connection from the pool
    public async getConnection(): Promise<PoolConnection> {
        if (!this.pool) {
            throw new Error("MySQL pool is not initialized.");
        }
        return this.pool.getConnection();
    }

    public async setupDatabase() {
        if (!this.pool) {
            throw new Error("Database pool has not been initialized.");
        }

        const connection = await this.pool.getConnection();
        try {
            // Run initial setup queries
            await connection.beginTransaction(); // Start transaction

            await connection.execute(`
                CREATE TABLE IF NOT EXISTS user(
                    id int NOT NULL AUTO_INCREMENT, 
                    username VARCHAR(45) NOT NULL,
                    password VARCHAR(300) NOT NULL,
                    email VARCHAR(45) NOT NULL,
                    firstname VARCHAR(45) NOT NULL,
                    lastname VARCHAR(45) NOT NULL,
                    UNIQUE (username),
                    KEY idx_email (email),
                    PRIMARY KEY (id)  
                );
            `);

            // status tinyint NOT NULL,
            //categories
            //actorsList
            await connection.execute(`
                    CREATE TABLE IF NOT EXISTS movie(
                        id int NOT NULL AUTO_INCREMENT, 
                        user_id INT NOT NULL,
                        title VARCHAR(250),
                        summary VARCHAR(2500) NOT NULL,
                        thumbnail VARCHAR(255),
                        dateRelease DATETIME NOT NULL,
                        yearRelease SMALLINT NOT NULL,
                        revenue INT NOT NULL,
                        PRIMARY KEY (id),
                        FOREIGN KEY (user_id) REFERENCES user(id),
                        UNIQUE (user_id, title),
                        INDEX idx_yearRelease (yearRelease)
                    );              
                `);

            /**
             * Index's and keys
             */
            // await connection.execute(`
            //         ALTER TABLE user
            //         ADD INDEX idx_email (email);
            //     `);

            /**
             * insert dummy data into the respective tables
             */

            // await connection.execute(`
            //         INSERT INTO user(
            //             username,
            //             password,
            //             email,
            //             firstname,
            //             lastname
            //         ) VALUES(
            //             'username 1',
            //             'dummy1',
            //             'dummyemail@gmail.com',
            //             'firstname 1',
            //             'lastname 1'
            //         );
            //     `);

            await connection.commit(); // Commit transaction if everything is successful
            console.log("Database setup completed successfully.");
        } catch (error: unknown) {
            await connection.rollback(); // Rollback transaction on error

            if (error instanceof Error) {
                const mysqlError = error as MySqlError; // Type assertion

                console.error(
                    `Database setup failed: ${JSON.stringify(
                        getMySqlError(mysqlError)
                    )}`
                );
            } else {
                console.error("Database setup failed:", error);
            }
        } finally {
            connection.release();
        }
    }

    public getPool(): Pool {
        if (!this.pool) {
            throw new Error(
                "Database pool has not been initialized. Call MySQL.createPool() first."
            );
        }

        return this.pool;
    }

    // Close the pool when the app shuts down
    public async closePool(): Promise<void> {
        if (this.pool) {
            console.log("Closing MySQL pool...");
            await this.pool.end();
            return;
        }
        console.log("MySQL pool already closed");
    }
}

export default MySQL.getInstance();
