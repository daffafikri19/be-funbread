"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = require("../controllers/product");
const category_product_1 = require("../controllers/category-product");
const route = express_1.default.Router();
// product
route.get("/api/product/all/display", product_1.getProductForDisplay);
route.get("/api/product/all/report", product_1.getProductForReport);
route.post("/api/product/get/:id", product_1.getProductById);
route.post("/api/product/create", product_1.createNewProduct);
route.patch("/api/product/update/:id", product_1.updateProduct);
route.post("/api/product/delete/:id", product_1.deleteProduct);
// category
route.get("/api/product/category/all", category_product_1.getCategoryProduct);
route.post("/api/product/category/get/:id", category_product_1.getCategoryProductById);
route.post("/api/product/category/create", category_product_1.createCategoryProduct);
route.patch("/api/product/category/update/:id", category_product_1.updateCategoryProduct);
route.post("/api/product/category/delete/:id", category_product_1.deleteCategoryProduct);
exports.default = route;
