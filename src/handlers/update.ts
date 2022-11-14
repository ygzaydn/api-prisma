import prisma from "../db";
import { Request, Response } from "express";
import { JwtPayload, IRequest } from "../types/types";

export const getUpdates = async (req: IRequest, res: Response) => {
    const token = req.user as JwtPayload;
    const { id } = token;

    try {
        const updates = await prisma.product.findMany({
            where: {
                belongsToId: id,
            },
            include: { update: true },
        });

        res.status(200);
        res.json({ data: updates });
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
