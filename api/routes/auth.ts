import express from "express";
import { Login } from "../controllers/auth/login";
import { Register } from "../controllers/auth/register";
import { Logout } from "../controllers/auth/logout";

const route = express.Router();

route.post("/api/auth/login", Login);
route.post("/api/auth/register", Register);
route.delete("/api/auth/logout", Logout);
export default route;
