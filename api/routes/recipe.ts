import express from "express";
import { fetchAllRecipes, getRecipeById, CreateRecipe, editRecipe, deleteRecipe } from "../controllers/recipe";
const route = express.Router();

route.get("/api/recipe/all", fetchAllRecipes);
route.post("/api/recipe/get/:id", getRecipeById);
route.post("/api/recipe/create", CreateRecipe);
route.patch("/api/recipe/edit/:id", editRecipe);
route.post("/api/recipe/delete/:id", deleteRecipe);

export default route;
