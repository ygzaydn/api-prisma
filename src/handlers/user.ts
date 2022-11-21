import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";
import { NextFunction, Request, Response } from "express";

import { IError } from "../types/types";

export const createNewUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const hash = await hashPassword(req.body.password);

        // Prisma client is aware all of the models that we've created. So we can use .user method.
        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                password: hash,
            },
        });

        const token = createJWT(user);
        res.json({ token });
    } catch (err: IError | undefined | any) {
        err.type = "input";
        next(err);
    }
};

export const signIn = async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.body.username,
        },
    });

    if (user) {
        const isValid = await comparePasswords(
            req.body.password,
            user.password
        );

        if (!isValid) {
            res.status(401);
            res.json({ message: "nope" });
            return;
        }

        const token = createJWT(user);
        res.json({ token });
    }
    res.status(401);
    res.json({ message: "nope" });
    return;
};
