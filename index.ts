import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./api/routes/auth";

dotenv.config();

const app = express();
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
