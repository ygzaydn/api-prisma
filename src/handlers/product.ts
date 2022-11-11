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

export const postProduct = async (req: Request, res: Response) => {
    try {
        const product = await prisma.product.create({
            data: {
                name: req.body.name,
                belongsToId: req.body.userID,
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

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const product = await prisma.product.update({
            where: {
                id,
            },
            data: {
                name: req.body.name,
                belongsToId: req.body.userID,
            },
        });

        res.status(201);
        res.json({ product });
    } catch (e) {
        res.status(404);
        res.json({ error: e });
    }
};
