import express from "express";
import {
  totalSalesShiftSummary,
  topSellingProduct,
  periodedSalesSummary,
  current5ReportData,
} from "../controllers/summary";

const route = express.Router();
route.get("/api/summary/total-sales-shift", totalSalesShiftSummary);
route.get("/api/summary/top-selling-product", topSellingProduct);
route.get("/api/summary/sales-period", periodedSalesSummary);
route.get("/api/summary/top-data-report", current5ReportData);

export default route;