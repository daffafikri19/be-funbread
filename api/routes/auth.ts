import express from "express";
import { Login } from "../controllers/auth/login";
import { Register } from "../controllers/auth/register";
import { Logout } from "../controllers/auth/logout";
import { VerifyAccess } from "../../middlewares/verify-access";
import { VerifyToken } from "../../middlewares/verify-token";

const route = express.Router();

route.post("/api/auth/login", Login);
route.post("/api/auth/register", VerifyAccess, VerifyToken, Register);
route.post("/api/auth/logout", VerifyToken, Logout);
export default route;
