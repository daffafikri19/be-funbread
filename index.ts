import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { bindFlmngr } from "@flmngr/flmngr-server-node-express";

import authRoute from "./api/routes/auth";
import productRoute from "./api/routes/product";
import ingredientRoute from "./api/routes/ingredient";

dotenv.config();

const app = express();

app.use(cookieParser())
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(authRoute);
app.use(productRoute);
app.use(ingredientRoute);

bindFlmngr({
  app: app,
  urlFileManager: "/flmngr",
  urlFiles: "/files/",
  dirFiles: "./files",
});

app.listen(5000, () => {
  console.log(`server successfully running at http://localhost:5000`);
});
