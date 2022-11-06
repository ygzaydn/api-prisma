import express from 'express'

const app = express();

app.get("/", (req, res) => {
  console.log("we got a get request on /");
  res.status(200);
  res.json({ message: "hello" });
});

export default app;
