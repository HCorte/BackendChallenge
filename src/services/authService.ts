// import { User } from "../db/mongodb/models/user.js";
// import User from "../db/mysql/models/user.js";
import dotenv from "dotenv";
dotenv.config();

import User from "../db/mysql/models/user.js";

type UserSignUp = {
    username: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
};

type DeleteUser = {
    username: string;
    // email: string;
};

export const createUser = async ({
    username,
    email,
    password,
    firstname,
    lastname,
}: UserSignUp) => {
    const savedUser = await User.create({
        username,
        email,
        password,
        firstname,
        lastname,
    });
    return savedUser;
};

export const deleteUser = async ({ username }: DeleteUser) => {
    const deleteUser = await User.deleteByUsername(username);
    return deleteUser;
};

export const findUser = async ({ email }: { email: string }) => {
    const user = await User.findOne({
        email: email,
    });
    if (!user) {
        return null;
    }
    return user;
};
