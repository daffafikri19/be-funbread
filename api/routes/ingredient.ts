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
  createCategoryIngredient,
  updateCategoryIngredient,
  deleteCategoryIngredient,
} from "../controllers/category-ingredient";
const route = express.Router();

// ingredients
route.get("/api/ingredients/all", getAllIngredients);
route.post("/api/ingredients/get/:id", getIngredientById);
route.post("/api/ingredients/get/:id", getIngredientById);
route.post("/api/ingredients/create", createIngredient);
route.patch("/api/ingredients/update/:id", editIngredient);
route.post("/api/ingredients/delete/:id", deleteIngredient);

// category
route.get("/api/ingredients/category/all", getCategoryIngredients);
route.post("/api/ingredients/category/create", createCategoryIngredient);
route.patch("/api/ingredients/category/update/:id", updateCategoryIngredient);
route.post("/api/ingredients/category/delete/:id", deleteCategoryIngredient);

export default route;
