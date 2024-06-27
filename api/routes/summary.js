"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const summary_1 = require("../controllers/summary");
const route = express_1.default.Router();
route.get("/api/summary/total-sales-shift", summary_1.totalSalesShiftSummary);
route.get("/api/summary/top-selling-product", summary_1.topSellingProduct);
route.get("/api/summary/sales-period", summary_1.periodedSalesSummary);
route.get("/api/summary/current-report-data", summary_1.current5ReportData);
exports.default = route;
