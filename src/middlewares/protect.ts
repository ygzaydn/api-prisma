import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { IRequest, JwtPayload } from "../types/types";

export const protect = (req: IRequest, res: Response, next: NextFunction) => {
    const bearer = req.header("authorization");

    if (!bearer) {
        res.status(401);
        res.send("Not authorized");
        return;
    }

    const [, token] = bearer.split(" ");
    if (!token) {
        res.status(401);
        res.send("Not authorized");
        return;
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;
        req.user = payload;
        next();
        return;
    } catch (e) {
        console.error(e);
        res.status(401);
        res.send("Not valid token");
        return;
    }
};
