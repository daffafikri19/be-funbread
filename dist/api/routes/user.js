"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const user_role_1 = require("../controllers/user-role");
const route = express_1.default.Router();
// User
route.get("/api/user/all", user_1.getAllUser);
route.post("/api/user/get/:id", user_1.findUserByID);
route.patch("/api/user/update/:id", user_1.editUserAccount);
route.post("/api/user/delete/:id", user_1.deleteUserAccount);
// User Role
route.get("/api/user/role/all", user_role_1.getAllUserRole);
route.post("/api/user/role", user_role_1.createNewRole);
route.patch("/api/user/role/update/:id", user_role_1.editRole);
route.post("/api/user/role/delete/:id", user_role_1.deleteRole);
exports.default = route;
