import express from "express";
import router from "./router";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router, morgan("dev"));

app.get("/", (req, res) => {
  console.log("we got a get request on /");
  res.status(200);
  res.json({ message: "hello" });
});

export default app;
