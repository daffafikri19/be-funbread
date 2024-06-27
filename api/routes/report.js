"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stock_1 = require("../controllers/report/stock");
const sales_1 = require("../controllers/report/sales");
const ingredient_1 = require("../controllers/report/ingredient");
const route = express_1.default.Router();
// Report Stock
route.get("/api/report/stock", stock_1.fetchAllReport);
route.get("/api/report/stock/today", stock_1.fetchReportShiftToday);
route.post("/api/report/stock/yesterday", stock_1.fetchReportShiftYesterday);
route.post("/api/report/stock/shift1", stock_1.createReportStockShift1);
route.post("/api/report/stock/shift2", stock_1.createReportStockShift2);
route.post("/api/report/stock/shift1/edit", stock_1.editReportStockShift1);
route.post("/api/report/stock/shift1/edit", stock_1.editReportStockShift2);
route.post("/api/report/stock/delete", stock_1.deleteReportStock);
// Report Sales
route.get("/api/report/sales/all", sales_1.fetchAllReportSales);
route.post("/api/report/sales/get/:id", sales_1.getSalesReportById);
route.post("/api/report/sales/create", sales_1.CreateReportSales);
// Report Ingredient
route.get("/api/report/ingredients/all", ingredient_1.fetchAllReportIngredients);
route.post("/api/report/ingredient/get/:id", ingredient_1.getReportIngredientById);
route.post("/api/report/ingredient/create", ingredient_1.createReportIngredient);
exports.default = route;
