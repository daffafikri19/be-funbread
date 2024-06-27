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
exports.deleteCategoryProduct = exports.updateCategoryProduct = exports.createCategoryProduct = exports.getCategoryProductById = exports.getCategoryProduct = void 0;
const prisma_1 = require("../../../lib/prisma");
const getCategoryProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    let filter = {};
    try {
        if (search && search !== "") {
            filter = Object.assign(Object.assign({}, filter), { OR: [{ name: { contains: search } }] });
        }
        const result = yield prisma_1.prisma.category_product.findMany({
            where: filter
        });
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
exports.getCategoryProduct = getCategoryProduct;
const getCategoryProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.prisma.category_product.findUnique({
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
exports.getCategoryProductById = getCategoryProductById;
const createCategoryProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        yield prisma_1.prisma.category_product.create({
            data: {
                name,
            },
        });
        return res.status(201).json({
            message: "Berhasil membuat kategori produk",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message
        });
    }
});
exports.createCategoryProduct = createCategoryProduct;
const updateCategoryProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name } = req.body;
    try {
        const existingCategory = yield prisma_1.prisma.category_product.findUnique({
            where: {
                id,
            },
        });
        if (!existingCategory) {
            return res.status(404).json({
                message: "Kategori tidak ditemukan",
            });
        }
        yield prisma_1.prisma.category_product.update({
            where: {
                id: existingCategory.id,
            },
            data: {
                name,
            },
        });
        return res.status(200).json({
            message: "Kategori berhasil diubah",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message
        });
    }
});
exports.updateCategoryProduct = updateCategoryProduct;
const deleteCategoryProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const existingCategory = yield prisma_1.prisma.category_product.findUnique({
        where: {
            id,
        },
    });
    if (!existingCategory) {
        return res.status(404).json({
            message: "Kategori tidak ditemukan",
        });
    }
    try {
        yield prisma_1.prisma.category_product.delete({
            where: {
                id: existingCategory.id,
            }
        });
        return res.status(200).json({
            message: "Kategori berhasil dihapus",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message
        });
    }
});
exports.deleteCategoryProduct = deleteCategoryProduct;
