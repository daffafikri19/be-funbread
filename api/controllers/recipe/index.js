"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecipe = exports.editRecipe = exports.CreateRecipe = exports.getRecipeById = exports.fetchAllRecipes = void 0;
const prisma_1 = require("../../../lib/prisma");
const fetchAllRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, take, search } = req.query;
    let filter = {};
    try {
        if (search && search !== "") {
            filter = Object.assign(Object.assign({}, filter), { OR: [{ name: { contains: search } }] });
        }
        const data = yield prisma_1.prisma.recipe.findMany({
            take: Number(take),
            skip: Number(skip),
            where: filter,
            include: {
                recipes_ingredient: {
                    include: {
                        ingredients: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        const total = yield prisma_1.prisma.recipe.count({
            where: filter,
        });
        return res.status(200).json({
            message: "Berhasil fetch data resep",
            data: {
                result: data,
                metadata: {
                    hasNextPage: Number(skip) + Number(take) < total,
                    totalPages: Math.ceil(total / Number(take)),
                    totalData: total,
                },
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.fetchAllRecipes = fetchAllRecipes;
const getRecipeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.prisma.recipe.findUnique({
            where: {
                id: req.body.id,
            },
            include: {
                recipes_ingredient: {
                    include: {
                        ingredients: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!result) {
            return res.status(404).json({
                message: "Data laporan id tidak ditemukan",
            });
        }
        return res.status(200).json({
            message: "Berhasil fetch",
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.getRecipeById = getRecipeById;
const CreateRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recipes = req.body;
    try {
        yield prisma_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            for (const recipe of recipes) {
                const ingredientNames = recipe.bahan.map((bahan) => bahan.ingredients);
                const ingredients = yield prisma.ingredient.findMany({
                    where: {
                        name: {
                            in: ingredientNames,
                        },
                    },
                });
                const missingIngredients = ingredientNames.filter((name) => !ingredients.some((ingredient) => ingredient.name === name));
                if (missingIngredients.length) {
                    throw new Error(`Ingredient(s) "${missingIngredients.join(", ")}" tidak ditemukan`);
                }
                const ingredientMap = new Map(ingredients.map((ingredient) => [ingredient.name, ingredient.id]));
                const recipeIngredients = recipe.bahan.map((bahan) => ({
                    ingredient_id: ingredientMap.get(bahan.ingredients),
                    dose: bahan.dose,
                }));
                yield prisma.recipe.create({
                    data: {
                        name: recipe.nama,
                        notes: recipe.notes,
                        recipes_ingredient: {
                            create: recipeIngredients,
                        },
                    },
                });
            }
        }));
        res.status(201).json({
            message: "Berhasil membuat resep",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.CreateRecipe = CreateRecipe;
const editRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nama, notes, bahan } = req.body;
    try {
        yield prisma_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedRecipe = yield prisma.recipe.update({
                where: { id: parseInt(id) },
                data: {
                    name: nama,
                    notes: notes,
                },
            });
            yield prisma.recipes_ingredient.deleteMany({
                where: { recipe_id: updatedRecipe.id },
            });
            const ingredientNames = bahan.map((bahan) => bahan.ingredients);
            const ingredients = yield prisma.ingredient.findMany({
                where: {
                    name: {
                        in: ingredientNames,
                    },
                },
            });
            const missingIngredients = ingredientNames.filter((name) => !ingredients.some((ingredient) => ingredient.name === name));
            if (missingIngredients.length) {
                throw new Error(`Ingredient(s) "${missingIngredients.join(', ')}" tidak ditemukan`);
            }
            const ingredientMap = new Map(ingredients.map((ingredient) => [ingredient.name, ingredient.id]));
            yield prisma.recipes_ingredient.createMany({
                data: bahan.map((bahan) => ({
                    ingredient_id: ingredientMap.get(bahan.ingredients),
                    dose: bahan.dose,
                    recipe_id: updatedRecipe.id,
                })),
            });
        }));
        res.status(200).json({
            message: "Resep berhasil diperbarui",
        });
    }
    catch (error) {
        console.error("Error saat memperbarui resep:", error);
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.editRecipe = editRecipe;
const deleteRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingRecipe = yield prisma_1.prisma.recipe.findUnique({
            where: {
                id: req.body.id
            }
        });
        if (!existingRecipe) {
            return res.status(404).json({
                message: "ID resep tidak ditemukan"
            });
        }
        yield prisma_1.prisma.recipe.delete({
            where: {
                id: existingRecipe.id
            }
        });
        return res.status(200).json({
            message: "Berhasil menghapus resep"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.deleteRecipe = deleteRecipe;
