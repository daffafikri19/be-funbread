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
import recipeRoute from "./api/routes/recipe";
import summaryRoute from "./api/routes/summary";
import accessRoute from "./api/routes/access";

dotenv.config();

process.env.TZ = 'Asia/Jakarta';
const app = express();

app.use(cookieParser())
app.use(express.json());

app.use(
  cors({
    origin: [`${process.env.APPLICATION_URL}`, 'http://112.0.5615.136:8080', 'http://192.168.1.11:3000'],
    credentials: true,
  })
);
app.use(authRoute);
app.use(userRoute);
app.use(productRoute);
app.use(ingredientRoute);
app.use(reportRoute);
app.use(recipeRoute);
app.use(summaryRoute);
app.use(accessRoute);

bindFlmngr({
  app: app,
  urlFileManager: "/flmngr",
  urlFiles: "/files/",
  dirFiles: "./files",
});

app.listen(5000, () => {
  console.log(`server successfully running at http://localhost:5000`);
});
