"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const access_1 = require("../controllers/access");
const route = express_1.default.Router();
route.get("/api/access/all", access_1.fetchAllAccessData);
route.post("/api/access/get/:id", access_1.getAccessDataByRoleId);
route.post("/api/access/create-or-update", access_1.createOrUpdateAccessData);
exports.default = route;
