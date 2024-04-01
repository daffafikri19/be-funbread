import express from "express";
import { 
    getProduct, 
    getProductById,
    getProductByProductCode
} from "../controllers/product/get-product";
import { 
    CreateNewProduct,
 } from "../controllers/product/create-product";
import { CreateCategoryProduct } from "../controllers/category-product/create-category";
import { getCategoryProduct } from "../controllers/category-product/get-category";

const route = express.Router();
// product
route.get("/api/product/all", getProduct)
route.post("/api/product/get/:id", getProductById)
route.post("/api/product/p-code/:product-code", getProductByProductCode)
route.post("/api/product/create", CreateNewProduct)

// category
route.get("/api/product/category/all", getCategoryProduct)
route.post("/api/product/category/create", CreateCategoryProduct)

export default route

