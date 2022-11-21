import { Errback, Request } from "express";

export interface JwtPayload {
    id: string;
    iat: number;
    username: string;
}

export interface IRequest extends Request {
    user?: JwtPayload | string;
}

export interface IError extends Errback {
    type: "auth" | "input";
}
