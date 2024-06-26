import express from "express";
import {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  editIngredient,
  deleteIngredient,
} from "../controllers/ingredients";
import {
  getCategoryIngredients,
  getCategoryIngredientById,
  createCategoryIngredient,
  updateCategoryIngredient,
  deleteCategoryIngredient,
} from "../controllers/category-ingredient";
import { verifyToken } from "../../middlewares/verify-token";
const route = express.Router();

// ingredients
route.get("/api/ingredients/all", getAllIngredients);
route.post("/api/ingredient/get/:id", getIngredientById);
route.post("/api/ingredient/create", createIngredient);
route.patch("/api/ingredient/update/:id", editIngredient);
route.post("/api/ingredient/delete/:id", deleteIngredient);

// category
route.get("/api/ingredients/category/all", getCategoryIngredients);
route.post("/api/ingredient/category/get/:id", getCategoryIngredientById);
route.post("/api/ingredient/category/create", createCategoryIngredient);
route.patch("/api/ingredient/category/update/:id", updateCategoryIngredient);
route.post("/api/ingredient/category/delete/:id", deleteCategoryIngredient);

export default route;
