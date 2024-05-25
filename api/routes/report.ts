import express from "express";
import {
  fetchAllReport,
  createReportStockShift1,
  createReportStockShift2,
  fetchReportShiftToday,
  fetchReportShiftYesterday,
} from "../controllers/report/stock";
import { verifyToken } from "../../middlewares/verify-token";

const route = express.Router();

// Report Stock
route.get("/api/report/stock", fetchAllReport);
route.get("/api/report/stock/today", fetchReportShiftToday);
route.post("/api/report/stock/yesterday", fetchReportShiftYesterday);
route.post("/api/report/stock/shift1", createReportStockShift1);
route.post("/api/report/stock/shift2", createReportStockShift2);

export default route;
