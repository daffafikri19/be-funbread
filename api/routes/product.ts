import express from "express";
import {
  createNewProduct,
  deleteProduct,
  getProductForDisplay,
  getProductForReport,
  getProductById,
  updateProduct,
} from "../controllers/product";
import {
  createCategoryProduct,
  getCategoryProductById,
  deleteCategoryProduct,
  getCategoryProduct,
  updateCategoryProduct,
} from "../controllers/category-product";
import { verifyToken } from "../../middlewares/verify-token";

const route = express.Router();
// product
route.get("/api/product/all/display", getProductForDisplay);
route.get("/api/product/all/report", getProductForReport);
route.post("/api/product/get/:id", getProductById);
route.post("/api/product/create", createNewProduct);
route.patch("/api/product/update/:id", updateProduct);
route.post("/api/product/delete/:id", deleteProduct);

// category
route.get("/api/product/category/all", getCategoryProduct);
route.post("/api/product/category/get/:id", getCategoryProductById);
route.post("/api/product/category/create", createCategoryProduct);
route.patch("/api/product/category/update/:id", updateCategoryProduct);
route.post("/api/product/category/delete/:id", deleteCategoryProduct);

export default route;
