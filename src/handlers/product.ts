import prisma from "../db";

import { Request, Response } from "express";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany();
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
