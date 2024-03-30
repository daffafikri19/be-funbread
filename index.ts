import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./api/routes/auth";
import {bindFlmngr} from "@flmngr/flmngr-server-node-express";

dotenv.config();

const app = express();

bindFlmngr({
  app: app,
  urlFileManager: "/flmngr",
  urlFiles: "/files/",
  dirFiles: "./files"
});

app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);
app.use(authRoute);

app.listen(3000, () => {
  console.log(`Backend successfully running at http://localhost:3000`);
});
