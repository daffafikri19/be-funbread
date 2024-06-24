import express from "express";

import { fetchAllAccessData, getAccessDataByRoleId , createOrUpdateAccessData } from "../controllers/access";

const route = express.Router();

route.get("/api/access/all", fetchAllAccessData)
route.post("/api/access/get/:id", getAccessDataByRoleId)
route.post("/api/access/create-or-update", createOrUpdateAccessData)

export default route