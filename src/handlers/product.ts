import prisma from "../db";

import { NextFunction, Response } from "express";
import { IRequest, JwtPayload, IError } from "../types/types";

export const getProducts = async (req: IRequest, res: Response) => {
    try {
        const blabla = req.user as JwtPayload;
        const { id } = blabla;

        const user = await prisma.user.findUnique({
            where: { id },
            include: { product: true },
        });
        res.status(200);
        return res.json({ data: user?.product });
    } catch (e) {
        res.status(400);
        res.json({ error: e });
    }
};

export const getProduct = async (req: IRequest, res: Response) => {
    try {
        const token = req.user as JwtPayload;
        const { id } = token;

        const productID = req.params.id;

        const product = await prisma.product.findUnique({
            where: {
                id_belongsToId: {
                    id: productID,
                    belongsToId: id,
                },
            },
        });

        res.status(200);
        return res.json({ data: product });
    } catch (e) {
        res.status(404);
        res.json({ error: e });
    }
};

export const postProduct = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const reqUser = req.user as JwtPayload;
        const { id } = reqUser;

        const product = await prisma.product.create({
            data: {
                name: req.body.name,
                belongsToId: id,
            },
        });
        if (product) {
            res.status(200);
            return res.json({ data: product });
        }
    } catch (e: IError | any) {
        e.type = "input";
        next(e);
    }
};

export const updateProduct = async (req: IRequest, res: Response) => {
    try {
        const productID = req.params.id;
        const reqUser = req.user as JwtPayload;

        const { id } = reqUser;
        const product = await prisma.product.update({
            where: {
                id_belongsToId: {
                    id: productID,
                    belongsToId: id,
                },
            },
            data: {
                name: req.body.name,
            },
        });

        res.status(201);
        res.json({ data: product });
    } catch (e) {
        res.status(404);
        res.json({ error: e });
    }
};

export const deleteProduct = async (req: IRequest, res: Response) => {
    try {
        const productID = req.params.id;
        const reqUser = req.user as JwtPayload;
        const { id } = reqUser;

        await prisma.product.delete({
            where: {
                id_belongsToId: {
                    id: productID,
                    belongsToId: id,
                },
            },
        });
        res.status(200);
        res.json({ message: "Record deleted." });
    } catch (e) {
        res.status(404);
        res.json({ error: e });
    }
};
