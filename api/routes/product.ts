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
import { createDetailProduct } from "../controllers/detail-product/create-detail";
import { getDetailProductById, getAllDetailProduct, getDetailProductByProductId } from "../controllers/detail-product/get-detail";

const route = express.Router();
// product
route.get("/api/product/all", getProduct)
route.post("/api/product/:id", getProductById)
route.post("/api/product/p-code/:product-code", getProductByProductCode)
route.post("/api/product/create", CreateNewProduct)

// category
route.get("/api/product/category/all", getCategoryProduct)
route.post("/api/product/category/create", CreateCategoryProduct)
// detail
route.get("/api/product/detail/all", getAllDetailProduct)
route.post("/api/product/detail/create", createDetailProduct)
route.post("/api/product/detail/:id", getDetailProductById)
route.post("/api/product/:product-id/detail/:detail-id", getDetailProductByProductId)

export default route

