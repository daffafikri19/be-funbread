import express, { Request, Response } from "express";
import { Login, Register, Logout } from "../controllers/auth";
import { verifyToken } from "../../middlewares/verify-token";

const route = express.Router();

route.post("/api/auth/login",  Login);
route.post("/api/auth/register", Register);
route.post("/api/auth/logout", Logout);
route.get("/api/auth/test",  verifyToken, async (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'Tester secure route'
    })
})
export default route;
