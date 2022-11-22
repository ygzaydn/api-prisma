import jwt from "jsonwebtoken";

import * as bcrypt from "bcrypt";
import config from "../config";

interface User {
    id: string;
    username: string;
}

export const comparePasswords = (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, 5);
};

export const createJWT = (user: User) => {
    const token = jwt.sign(
        { id: user.id, username: user.username },
        config.jwtSecret!
    );
    return token;
};
