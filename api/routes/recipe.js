"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recipe_1 = require("../controllers/recipe");
const route = express_1.default.Router();
route.get("/api/recipe/all", recipe_1.fetchAllRecipes);
route.post("/api/recipe/get/:id", recipe_1.getRecipeById);
route.post("/api/recipe/create", recipe_1.CreateRecipe);
route.patch("/api/recipe/edit/:id", recipe_1.editRecipe);
route.post("/api/recipe/delete/:id", recipe_1.deleteRecipe);
exports.default = route;
