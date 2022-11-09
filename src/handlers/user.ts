import prisma from "../db";
import { createJWT, hashPassword } from "../modules/auth";
import { Request, Response } from "express";

export const createNewUser = async (req: Request, res: Response) => {
  const hash = await hashPassword(req.body.password);

  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: hash,
    },
  });

  const token = createJWT(user);
  res.json({ token });
};
