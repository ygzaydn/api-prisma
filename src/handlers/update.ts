import prisma from "../db";
import { Response } from "express";
import { JwtPayload, IRequest } from "../types/types";
import { Update } from "@prisma/client";

export const getUpdates = async (req: IRequest, res: Response) => {
    const token = req.user as JwtPayload;
    const { id } = token;

    try {
        const products = await prisma.product.findMany({
            where: {
                belongsToId: id,
            },
            include: { update: true },
        });

        const updates = products.reduce((allUpdates: Update[], product) => {
            return [...allUpdates, ...product.update];
        }, []);

        res.status(200);
        res.json({
            data: updates,
        });
    } catch (err) {
        res.status(404);
        res.json({ error: err });
    }
};

export const getUpdate = async (req: IRequest, res: Response) => {
    const token = req.user as JwtPayload;
    const { id } = token;
    const updateId = req.params.id;
    try {
        const update = await prisma.update.findUnique({
            where: {
                id: updateId,
            },
        });

        res.status(200);
        res.json({ data: update });
    } catch (err) {
        res.status(404);
        res.json({ error: err });
    }
};

export const postUpdate = async (req: IRequest, res: Response) => {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: req.body.id,
            },
        });

        if (!product) {
            res.status(404);
            res.json({ error: "Product not found" });
        }

        const update = await prisma.update.create({
            data: {
                ...req.body,
            },
        });

        res.status(201);
        res.json({ data: update });
    } catch (err) {
        res.status(404);
        res.json({ error: err });
    }
};

export const updateUpdate = async (req: IRequest, res: Response) => {
    try {
        const token = req.user as JwtPayload;
        const { id } = token;
        const products = await prisma.product.findMany({
            where: {
                belongsToId: id,
            },
            include: {
                update: true,
            },
        });

        const updates = products.reduce((allUpdates: Update[], product) => {
            return [...allUpdates, ...product.update];
        }, []);

        const match = updates.find((update) => update.id === req.params.id);

        if (!match) {
            res.status(404);
            res.json({ error: "Not found" });
        }

        const update = await prisma.update.update({
            where: {
                id: req.params.id,
            },
            data: {
                ...req.body,
            },
        });

        res.status(201);
        res.json({ data: update });
    } catch (err) {
        res.status(404);
        res.json({ error: err });
    }
};

export const deleteUpdate = async (req: IRequest, res: Response) => {
    try {
        const token = req.user as JwtPayload;
        const { id } = token;
        const products = await prisma.product.findMany({
            where: {
                belongsToId: id,
            },
            include: {
                update: true,
            },
        });

        const updates = products.reduce((allUpdates: Update[], product) => {
            return [...allUpdates, ...product.update];
        }, []);

        const match = updates.find((update) => update.id === req.params.id);

        if (!match) {
            res.status(404);
            res.json({ error: "Not found" });
        }

        const deleted = await prisma.update.delete({
            where: {
                id: req.params.id,
            },
        });

        res.status(201);
        res.json({ data: deleted, message: "Deleted" });
    } catch (err) {
        res.status(404);
        res.json({ error: err });
    }
};
