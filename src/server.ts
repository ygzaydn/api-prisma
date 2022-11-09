import express, { Request } from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import { protect } from "./middlewares/protect";

import { createNewUser, signIn } from "./handlers/user";

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

app.get("/", (req, res) => {
  console.log("we got a get request on /");
  res.status(200);
  res.json({ message: "hello" });
});

export default app;
