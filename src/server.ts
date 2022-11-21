import express, { NextFunction, Request, Errback, Response } from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import { protect } from "./middlewares/protect";

import { createNewUser, signIn } from "./handlers/user";

import { IError } from "./types/types";

interface MyRequest extends Request {
    secretHeader?: String;
}

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: MyRequest, res, next) => {
    req.secretHeader = "myMiddleware";
    next();
});

app.use("/api", protect, router);

app.post("/user", createNewUser);
app.post("/signin", signIn);

app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    if (err.type === "auth") {
        res.status(401).json({ message: "unauthorized" });
    } else if (err.type === "input") {
        res.status(400).json({ message: "invalid input" });
    } else {
        res.status(500).json({ message: "server error" });
    }
});

app.get("/", (req, res) => {
    console.log("we got a get request on /");
    res.status(200);
    res.json({ message: "hello" });
});

export default app;
