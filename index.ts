import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { bindFlmngr } from "@flmngr/flmngr-server-node-express";

import authRoute from "./api/routes/auth";
import userRoute from "./api/routes/user";
import productRoute from "./api/routes/product";
import ingredientRoute from "./api/routes/ingredient";
import reportRoute from "./api/routes/report";

dotenv.config();

const app = express();

app.use(cookieParser())
app.use(express.json());

app.use(
  cors({
    origin: process.env.APPLICATION_URL,
    credentials: true,
  })
);

app.use(authRoute);
app.use(userRoute);
app.use(productRoute);
app.use(ingredientRoute);
app.use(reportRoute);

bindFlmngr({
  app: app,
  urlFileManager: "/flmngr",
  urlFiles: "/files/",
  dirFiles: "./files",
});

app.listen(5000, () => {
  console.log(`server successfully running at http://localhost:5000`);
});
