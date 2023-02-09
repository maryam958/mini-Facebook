import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import connection from "./DB/connection.js";
import * as allRoutes from "./modules/index.route.js";
import schedule from "node-schedule";
import QRCode from "qrcode";

const app = express();
 
app.use(express.json());
app.use(`${process.env.baseURL}user`, allRoutes.userRouter);
app.use(`${process.env.baseURL}auth`, allRoutes.authRouter);
app.use(`${process.env.baseURL}post`, allRoutes.postRouter);
app.use(`${process.env.baseURL}comment`, allRoutes.commentRouter);


const job = schedule.scheduleJob("0 1 * * * *", function () {
  console.log("The answer to life, the universe, and everything!");
});

app.get("/", (req, res) => {
  QRCode.toDataURL("Hello from QR Code")
    .then((url) => {
      console.log(url);
      res.json({ message: "Hello from QR Code", url });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("*", (req, res) => {
  res.json({ message: "Invalid Api" });
});

connection();
app.listen(3000, () => {
  console.log("Server is running");
});
