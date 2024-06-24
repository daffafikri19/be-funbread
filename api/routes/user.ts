import express from "express";
import {
  getAllUser,
  findUserByID,
  editUserAccountByOwner,
  updateUserData,
  deleteUserAccount,
} from "../controllers/user";
import {
  getAllUserRole,
  getAllUserAndRole,
  getRoleById,
  createNewRole,
  editRole,
  deleteRole,
} from "../controllers/user-role";
import { verifyToken } from "../../middlewares/verify-token";

const route = express.Router();

// User
route.get("/api/user/all", getAllUser);
route.post("/api/user/get/:id", findUserByID);
route.patch("/api/user/update/:id", editUserAccountByOwner);
route.patch("/api/user/data/update/:id", updateUserData)
route.post("/api/user/delete/:id", deleteUserAccount);

// User Role
route.get("/api/user/role/all", getAllUserRole);
route.get("/api/user/role/data", getAllUserAndRole);
route.post("/api/user/role/get/:id", getRoleById);
route.post("/api/user/role", createNewRole);
route.patch("/api/user/role/update/:id", editRole);
route.post("/api/user/role/delete/:id", deleteRole);

export default route;
