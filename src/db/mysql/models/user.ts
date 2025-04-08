import { Pool, ResultSetHeader } from "mysql2/promise";
import MySQL, { MySqlError } from "../connection.js"; // Import the database connection
import { ErrorException, ErrorType } from "../../../utils/error.js";

class User {
    private static pool: Pool = MySQL.getPool(); // Use the shared connection pool

    constructor(
        public id: number,
        public username: string,
        public email: string,
        public password: string,
        public firstname: string,
        public lastname: string,
        public status?: string
    ) {}

    /** CREATE: Add a new user */
    //save
    static async create(userData: {
        username: string;
        password: string;
        email: string;
        firstname: string;
        lastname: string;
    }) {
        try {
            const { username, password, email, firstname, lastname } = userData;
            const query = `
                INSERT INTO user (username, password, email, firstname, lastname) 
                VALUES (?, ?, ?, ?, ?)
            `;
            const [result] = await this.pool.execute<ResultSetHeader>(query, [
                username,
                password,
                email,
                firstname,
                lastname,
            ]);
            return new User(
                result.insertId,
                username,
                email,
                password,
                firstname,
                lastname
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                const mysqlError = error as MySqlError;
                const { code, errno, sqlState, sqlMessage } = mysqlError;
                if (mysqlError.errno === 1062) {
                    console.info({
                        message:
                            "Invalid this username already exist try another one",
                        ...(code && { code }),
                        ...(errno && { errno }),
                        ...(sqlState && { sqlState }),
                        ...(sqlMessage && { sqlMessage }),
                    });
                    return {
                        error: true,
                        message:
                            "Invalid this username already exist try another one",
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
                        "User Creation - General SQL Error"
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

    // static async save() {
    //     const user = await this.findOne({ email: this.email });
    //     if (user) {
    //         return this.update(user.id, this.username, this.email, this.name);
    //     } else {
    //         return this.create(userData);
    //     }
    // }

    static async findOne(fieldValue: { [key: string]: string }) {
        const field = Object.keys(fieldValue)[0];
        const value = fieldValue[field];
        const query = `SELECT * FROM user WHERE ${field} = ?`;
        const [rows] = await this.pool.execute(query, [value]);
        const typedRows = rows as any[];
        if (typedRows.length > 0) {
            const user = typedRows[0];
            return new User(
                user.id,
                user.username,
                user.email,
                user.password,
                user.name,
                user.status
            );
        }
        return null;
    }

    static async findById(id: string) {
        const idNum = Number(id);
        return this.getById(idNum);
    }

    /** READ: Get user by ID */
    static async getById(id: number) {
        const query = `SELECT * FROM user WHERE id = ?`;
        const [rows] = await this.pool.execute(query, [id]);
        const typedRows = rows as any[];
        if (typedRows.length > 0) {
            const user = typedRows[0];
            return new User(
                user.id,
                user.username,
                user.email,
                user.password,
                user.name,
                user.status
            );
        }
        return null;
    }

    async update() {
        const query = `
                UPDATE user SET username = ?, email = ?, firstname = ?, lastname = ? 
                WHERE id = ?
            `;
        await User.pool.execute(query, [
            this.username,
            this.email,
            this.firstname,
            this.lastname,
            this.id,
        ]);
    }

    /** DELETE: Remove user by ID */
    static async deleteOne(id: number) {
        const query = `DELETE FROM user WHERE id = ?`;
        await this.pool.execute(query, [id]);
    }

    static async deleteByUsername(username: string) {
        const query = `DELETE FROM user WHERE username = ?`;
        await this.pool.execute(query, [username]);
    }
}

export default User;
