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
exports.deleteIngredient = exports.editIngredient = exports.createIngredient = exports.getIngredientForRecipe = exports.getIngredientById = exports.getAllIngredientsForReport = exports.getAllIngredients = void 0;
const prisma_1 = require("../../../lib/prisma");
const getAllIngredients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, take, search } = req.query;
    let filter = {};
    try {
        if (search && search !== "") {
            filter = Object.assign(Object.assign({}, filter), { OR: [{ name: { contains: search } }] });
        }
        const result = yield prisma_1.prisma.ingredient.findMany({
            take: Number(take),
            skip: Number(skip),
            where: filter,
            include: {
                category: true,
            },
        });
        const total = yield prisma_1.prisma.ingredient.count({
            where: filter,
        });
        return res.status(200).json({
            message: "Berhasil fetch data bahan baku",
            data: {
                result: result,
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
            errorMessage: error.message
        });
    }
});
exports.getAllIngredients = getAllIngredients;
const getAllIngredientsForReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.prisma.ingredient.findMany();
        return res.status(200).json({
            message: "Berhasil fetch data ingredients",
            data: result
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message
        });
    }
});
exports.getAllIngredientsForReport = getAllIngredientsForReport;
const getIngredientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const result = yield prisma_1.prisma.ingredient.findUnique({
            where: {
                id
            },
            include: {
                category: true,
            }
        });
        if (!result) {
            return res.status(404).json({
                message: "Bahan baku tidak ditemukan"
            });
        }
        return res.status(200).json({
            message: "Berhasil fetch data ingredient",
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message
        });
    }
});
exports.getIngredientById = getIngredientById;
const getIngredientForRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.prisma.ingredient.findMany({
            select: {
                id: true,
                name: true
            }
        });
        return res.status(200).json({
            message: "berhasil fetch",
            data: result
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message
        });
    }
});
exports.getIngredientForRecipe = getIngredientForRecipe;
const createIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, price, unit } = req.body;
    try {
        if (!category) {
            return res.status(400).json({
                message: "Kategori tidak boleh kosong"
            });
        }
        const existingCategory = yield prisma_1.prisma.ingredient_category.findFirst({
            where: {
                name: category,
            },
        });
        if (!existingCategory) {
            return res.status(404).json({
                message: "Kategori tidak ditemukan",
            });
        }
        yield prisma_1.prisma.ingredient.create({
            data: {
                name,
                category: {
                    connect: {
                        id: existingCategory.id,
                    },
                },
                price,
                unit: unit
            },
        });
        return res.status(201).json({
            message: "Berhasil membuat data bahan baku",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message
        });
    }
});
exports.createIngredient = createIngredient;
const editIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, category, price, unit } = req.body;
    try {
        const existingIngredient = yield prisma_1.prisma.ingredient.findUnique({
            where: {
                id,
            },
        });
        if (!existingIngredient) {
            return res.status(404).json({
                message: "Data bahan baku tidak ditemukan",
            });
        }
        const existingCategory = yield prisma_1.prisma.ingredient_category.findFirst({
            where: {
                name: category,
            },
        });
        if (!existingCategory) {
            return res.status(404).json({
                message: "Kategori tidak ditemukan",
            });
        }
        yield prisma_1.prisma.ingredient.update({
            where: {
                id: existingIngredient.id,
            },
            data: {
                name,
                category: {
                    connect: {
                        id: existingCategory.id,
                    },
                },
                price,
                unit
            },
        });
        return res.status(200).json({
            message: "Berhasil edit data bahan baku",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message
        });
    }
});
exports.editIngredient = editIngredient;
const deleteIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const existingIngredient = yield prisma_1.prisma.ingredient.findUnique({
            where: {
                id,
            },
        });
        if (!existingIngredient) {
            return res.status(404).json({
                message: "Data bahan baku tidak ditemukan",
            });
        }
        yield prisma_1.prisma.ingredient.delete({
            where: {
                id,
            },
        });
        return res.status(200).json({
            message: "Berhasil menghapus data bahan baku",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message
        });
    }
});
exports.deleteIngredient = deleteIngredient;
