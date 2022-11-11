import prisma from "../db";

import { Request, Response } from "express";

import { IRequest, JwtPayload } from "../types/types";

export const getProducts = async (req: IRequest, res: Response) => {
    try {
        const blabla = req.user as JwtPayload;
        const { id } = blabla;

        const products = await prisma.product.findMany({
            where: { id },
        });
        res.status(200);
        return res.json({ products });
    } catch (e) {
        res.status(400);
        res.json({ error: e });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const product = await prisma.product.findUnique({
            where: {
                id,
            },
        });
        if (product) {
            res.status(200);
            return res.json({ product });
        }
        res.status(404);
        return res.json({ error: `Product id:${id} not found` });
    } catch (e) {
        res.status(400);
        res.json({ error: e });
    }
};

export const postProduct = async (req: IRequest, res: Response) => {
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
            return res.json({ product });
        }
    } catch (e) {
        res.status(400);
        res.json({ error: e });
    }
};

export const updateProduct = async (req: IRequest, res: Response) => {
    try {
        const productID = req.params.id;
        const reqUser = req.user as JwtPayload;
        const { id } = reqUser;
        const product = await prisma.product.update({
            where: {
                id: productID,
            },
            data: {
                name: req.body.name,
                belongsToId: id,
            },
        });

        res.status(201);
        res.json({ product });
    } catch (e) {
        res.status(404);
        res.json({ error: e });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await prisma.product.delete({
            where: {
                id: req.params.id,
            },
        });
        res.status(200);
        res.json({ message: "Operation delete is successful." });
    } catch (e) {
        res.status(404);
        res.json({ error: e });
    }
};
