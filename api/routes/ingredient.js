"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ingredients_1 = require("../controllers/ingredients");
const category_ingredient_1 = require("../controllers/category-ingredient");
const route = express_1.default.Router();
// ingredients
route.get("/api/ingredients/all", ingredients_1.getAllIngredients);
route.get("/api/ingredients/all/report", ingredients_1.getAllIngredientsForReport);
route.get("/api/ingredients/all/recipe", ingredients_1.getIngredientForRecipe);
route.post("/api/ingredient/get/:id", ingredients_1.getIngredientById);
route.post("/api/ingredient/create", ingredients_1.createIngredient);
route.patch("/api/ingredient/update/:id", ingredients_1.editIngredient);
route.post("/api/ingredient/delete/:id", ingredients_1.deleteIngredient);
// category
route.get("/api/ingredients/category/all", category_ingredient_1.getCategoryIngredients);
route.post("/api/ingredient/category/get/:id", category_ingredient_1.getCategoryIngredientById);
route.post("/api/ingredient/category/create", category_ingredient_1.createCategoryIngredient);
route.patch("/api/ingredient/category/update/:id", category_ingredient_1.updateCategoryIngredient);
route.post("/api/ingredient/category/delete/:id", category_ingredient_1.deleteCategoryIngredient);
exports.default = route;
