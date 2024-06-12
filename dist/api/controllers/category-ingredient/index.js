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
exports.deleteCategoryIngredient = exports.updateCategoryIngredient = exports.createCategoryIngredient = exports.getCategoryIngredientById = exports.getCategoryIngredients = void 0;
const prisma_1 = require("../../../lib/prisma");
const getCategoryIngredients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.prisma.ingredient_category.findMany();
        return res.status(200).json({
            message: "Berhasil fetch data kategori bahan baku",
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
exports.getCategoryIngredients = getCategoryIngredients;
const getCategoryIngredientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.prisma.ingredient_category.findUnique({
            where: {
                id: req.body.id
            }
        });
        if (!result) {
            return res.status(404).json({
                message: "Kategori tidak ditemukan"
            });
        }
        return res.status(200).json({
            message: "Berhasil fetch data kategori",
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
exports.getCategoryIngredientById = getCategoryIngredientById;
const createCategoryIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        yield prisma_1.prisma.ingredient_category.create({
            data: {
                name,
            },
        });
        return res.status(201).json({
            message: "Berhasil membuat kategori bahan baku",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message
        });
    }
});
exports.createCategoryIngredient = createCategoryIngredient;
const updateCategoryIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name } = req.body;
    const existingCategory = yield prisma_1.prisma.ingredient_category.findUnique({
        where: {
            id,
        },
    });
    if (!existingCategory) {
        return res.status(404).json({
            message: "Kategori bahan baku tidak ditemukan",
        });
    }
    try {
        yield prisma_1.prisma.ingredient_category.update({
            where: {
                id: existingCategory.id,
            },
            data: {
                name,
            },
        });
        return res.status(200).json({
            message: "Kategori bahan baku berhasil diubah",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message
        });
    }
});
exports.updateCategoryIngredient = updateCategoryIngredient;
const deleteCategoryIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const existingCategory = yield prisma_1.prisma.ingredient_category.findUnique({
        where: {
            id,
        },
    });
    if (!existingCategory) {
        return res.status(404).json({
            message: "Kategori bahan baku tidak ditemukan",
        });
    }
    try {
        yield prisma_1.prisma.ingredient_category.delete({
            where: {
                id: existingCategory.id,
            }
        });
        return res.status(200).json({
            message: "Kategori bahan baku berhasil dihapus",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message
        });
    }
});
exports.deleteCategoryIngredient = deleteCategoryIngredient;
