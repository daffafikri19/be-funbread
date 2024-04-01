import express from "express";
import { Login } from "../controllers/auth/login";
import { Register } from "../controllers/auth/register";
import { Logout } from "../controllers/auth/logout";
import { VerifyAccess } from "../../middlewares/verify-access";
import { VerifyToken } from "../../middlewares/verify-token";
import { setCorsHeaders } from "../../middlewares/allow-cred";
import { refreshToken } from "../controllers/auth/refresh-token";

const route = express.Router();

route.get("/api/auth/token", setCorsHeaders, refreshToken);
route.post("/api/auth/login", Login);
route.post("/api/auth/register", Register);
route.delete("/api/auth/logout", Logout);
export default route;
