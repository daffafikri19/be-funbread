import express from "express";
import { GetAllUser } from "../controllers/user/get-user";
import { VerifyToken } from "../../middlewares/verify-token";
import { VerifyAccess } from "../../middlewares/verify-access";

const route = express.Router();
route.get("/api/user/all", VerifyToken, GetAllUser);

export default route;
