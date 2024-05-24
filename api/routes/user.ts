import express from "express";
import {
  getAllUser,
  findUserByID,
  editUserAccount,
  deleteUserAccount,
} from "../controllers/user";
import {
  getAllUserRole,
  createNewRole,
  editRole,
  deleteRole,
} from "../controllers/user-role";
import { verifyToken } from "../../middlewares/verify-token";

const route = express.Router();

// User
route.get("/api/user/all", getAllUser);
route.post("/api/user/get/:id", findUserByID);
route.patch("/api/user/update/:id", editUserAccount);
route.post("/api/user/delete/:id", deleteUserAccount);

// User Role
route.get("/api/user/role/all", getAllUserRole);
route.post("/api/user/role", createNewRole);
route.patch("/api/user/role/update/:id", editRole);
route.post("/api/user/role/delete/:id", deleteRole);

export default route;
