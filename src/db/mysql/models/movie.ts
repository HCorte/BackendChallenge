import {
    Pool,
    ResultSetHeader,
    QueryResult,
    FieldPacket,
} from "mysql2/promise";
import MySQL, { MySqlError } from "../connection.js";
import { today } from "../../../utils/dates.js";
import { ErrorException, ErrorType } from "../../../utils/error.js";

class Movie {
    private static pool: Pool = MySQL.getPool(); // Use the shared connection pool

    constructor(
        public id: number,
        public userId: number,
        public title: string,
        public summary: string,
        public thumbnail: string,
        public dateRelease: Date,
        public revenue: number,
        // public categories: string[],
        // public actorsList: string[],
        // public favorit: boolean = false
    ) {}

    static async create({
        userId,
        title,
        summary,
        dateRelease = today(),
        filename,
        revenue,
        // categories = [],
        // actorsList = [],
        // favorit = false,
    }: {
        userId: number;
        title: string;
        summary: string;
        filename: string;
        dateRelease: Date;
        revenue: number;
        // categories: string[];
        // actorsList?: string[];
        // favorit: boolean;
    }) {
        try {
            //categories,
            //actorsList,
            const query = `
                INSERT INTO movie (
                    user_id, 
                    title, 
                    summary,  
                    thumbnail,
                    dateRelease,
                    revenue
                ) 
                VALUES (?, ?, ?, ?, ?, ?);
            `;
            const [result] = await this.pool.execute<ResultSetHeader>(query, [
                userId,
                title,
                summary,
                filename,
                dateRelease,
                revenue,
                // categories,
                // actorsList,
                // favorit ? 1 : 0,
            ]);
            return new Movie(
                result.insertId,
                userId,
                title,
                summary,
                filename,
                dateRelease,
                revenue,
                // categories,
                // actorsList,
                // favorit
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                const mysqlError = error as MySqlError;
                const { code, errno, sqlState, sqlMessage } = mysqlError;
                if (mysqlError.errno === 1062) {
                    console.info({
                        message:
                            "Invalid this title already exist try another one",
                        ...(code && { code }),
                        ...(errno && { errno }),
                        ...(sqlState && { sqlState }),
                        ...(sqlMessage && { sqlMessage }),
                    });
                    return {
                        error: true,
                        message:
                            "Invalid this Movie already exist try another one",
                    };
                } else {
                    console.error({
                        message: "General SQL Error",
                        ...(code && { code }),
                        ...(errno && { errno }),
                        ...(sqlState && { sqlState }),
                        ...(sqlMessage && { sqlMessage }),
                    });
                    const error = new ErrorException(
                        "Movie Creation - General SQL Error"
                    );
                    error.statusCode = 500;
                    error.errorType = ErrorType.ERROR;
                    error.data = {
                        ...(code && { code }),
                        ...(errno && { errno }),
                        ...(sqlState && { sqlState }),
                        ...(sqlMessage && { sqlMessage }),
                    };
                    throw error;
                }
            }
            return;
        }
    }

    static async insertMany(
        movies: {
            userId: number;
            title: string;
            summary: string;
            image: string;
            dateRelease: Date;
            revenue: number;
            // favorit: boolean;
        }[]
    ) {
        try {
            const query = `
                INSERT INTO movie (
                    user_id,
                    title,
                    summary,
                    thumbnail,
                    dateRelease,
                    revenue
                )
                VALUES ?;
            `;

            const values = movies.map((movie) => [
                movie.userId || 1,
                movie.title,
                movie.summary,
                movie.image,
                movie.dateRelease,
                movie.revenue,
                // movie.favorit ? 1 : 0,
            ]);

            // return values;

            const [result] = await this.pool.query<ResultSetHeader>(query, [
                values,
            ]);

            return {
                moviesInserted: result.affectedRows,
                info: result.info,
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                const mysqlError = error as MySqlError;
                const { code, errno, sqlState, sqlMessage } = mysqlError;
                if (mysqlError.errno === 1062) {
                    console.info({
                        message:
                            "Invalid this title already exist try another one",
                        ...(code && { code }),
                        ...(errno && { errno }),
                        ...(sqlState && { sqlState }),
                        ...(sqlMessage && { sqlMessage }),
                    });
                    return {
                        error: true,
                        message:
                            "Invalid this Movie already exist try another one",
                    };
                } else {
                    console.error({
                        message: "General SQL Error",
                        ...(code && { code }),
                        ...(errno && { errno }),
                        ...(sqlState && { sqlState }),
                        ...(sqlMessage && { sqlMessage }),
                    });
                    const error = new ErrorException(
                        "Movie Creation - General SQL Error"
                    );
                    error.statusCode = 500;
                    error.errorType = ErrorType.ERROR;
                    error.data = {
                        ...(code && { code }),
                        ...(errno && { errno }),
                        ...(sqlState && { sqlState }),
                        ...(sqlMessage && { sqlMessage }),
                    };
                    throw error;
                }
            }
            return;
        }
    }

    async update() {
        try {
            const query = `
                UPDATE movie 
                SET title = ?, 
                summary = ?, 
                dateRelease = ?, 
                categories = ?, 
                actorsList = ?,
                revenue = ?
                WHERE id = ?
            `;
            await Movie.pool.execute(query, [
                this.title,
                this.summary,
                this.dateRelease,
                // this.categories,
                // this.actorsList,
                this.revenue,
            ]);
            return {
                message: `Movie ${this.title} as been updated`,
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                const mysqlError = error as MySqlError;
                const { code, errno, sqlState, sqlMessage } = mysqlError;

                console.error({
                    message: "General SQL Error",
                    ...(code && { code }),
                    ...(errno && { errno }),
                    ...(sqlState && { sqlState }),
                    ...(sqlMessage && { sqlMessage }),
                });
                const err = new ErrorException(
                    "Update Movie - General SQL Error"
                );
                err.statusCode = 500;
                err.errorType = ErrorType.ERROR;
                err.data = {
                    ...(code && { code }),
                    ...(errno && { errno }),
                    ...(sqlState && { sqlState }),
                    ...(sqlMessage && { sqlMessage }),
                };
                throw err;
            }
            return;
        }
    }

    static async findWithPagination(
        currentPage: number = 1,
        moviesPerPage: number = 30
    ) {
        try {
            const limit = moviesPerPage < 70 ? moviesPerPage : 30;
            const offset = (currentPage-1) * limit;

            const query = `
                SELECT * FROM movie 
                ORDER BY dateRelease DESC
                LIMIT ? OFFSET ?;
            `;

            /**
             * bug seems to work only when working with strings and not numbers
             * using this package mysql2/promise
             */
            const [moviesResult, _]: [QueryResult, FieldPacket[]] =
                await this.pool.execute(query, [
                    limit.toString(),
                    offset.toString(),
                ]); //
            // const movies = moviesResult as {
            //     id: number;
            //     technician_id: number;
            //     summary: string;
            //     date_created: string;
            //     status: string;
            // }[]; // Type assertion
            return moviesResult;
        } catch (error: unknown) {
            if (error instanceof Error) {
                const mysqlError = error as MySqlError;
                const { code, errno, sqlState, sqlMessage } = mysqlError;

                console.error({
                    message: "General SQL Error",
                    ...(code && { code }),
                    ...(errno && { errno }),
                    ...(sqlState && { sqlState }),
                    ...(sqlMessage && { sqlMessage }),
                });
                const err = new ErrorException(
                    "Get Movies With Pagination - General SQL Error"
                );
                err.statusCode = 500;
                err.errorType = ErrorType.ERROR;
                err.data = {
                    ...(code && { code }),
                    ...(errno && { errno }),
                    ...(sqlState && { sqlState }),
                    ...(sqlMessage && { sqlMessage }),
                };
                throw err;
            }
            return;
        }
    }

    static async findById(id: string) {
        try {
            const query = `SELECT * FROM movie WHERE id = ?`;
            const [movieResult, _]: [QueryResult, FieldPacket[]] =
                await this.pool.execute(query, [id]);
            const movie = movieResult as {
                id: number;
                user_id: number;
                title: string;
                dateRelease: string;
                revenue: number;
            }[]; // Type assertion
            return movie[0];
        } catch (error: unknown) {
            if (error instanceof Error) {
                const mysqlError = error as MySqlError;
                const { code, errno, sqlState, sqlMessage } = mysqlError;

                console.error({
                    message: "General SQL Error",
                    ...(code && { code }),
                    ...(errno && { errno }),
                    ...(sqlState && { sqlState }),
                    ...(sqlMessage && { sqlMessage }),
                });
                const err = new ErrorException(
                    "Get Movie By Id - General SQL Error"
                );
                err.statusCode = 500;
                err.errorType = ErrorType.ERROR;
                err.data = {
                    ...(code && { code }),
                    ...(errno && { errno }),
                    ...(sqlState && { sqlState }),
                    ...(sqlMessage && { sqlMessage }),
                };
                throw err;
            }
            return;
        }
    }

    // static async deleteOne(id: number) {
    //     const query = `DELETE FROM movie WHERE id = ?`;
    //     await this.pool.execute(query, [id]);
    // }

    // static async deleteByUsername(username: string) {
    //     const query = `DELETE FROM movie WHERE username = ?`;
    //     await this.pool.execute(query, [username]);
    // }
}

export default Movie;
