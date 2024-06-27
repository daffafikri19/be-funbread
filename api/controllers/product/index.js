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
exports.deleteProduct = exports.updateProduct = exports.createNewProduct = exports.getProductById = exports.getProductForReport = exports.getProductForDisplay = void 0;
const prisma_1 = require("../../../lib/prisma");
const getProductForDisplay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, take, search, startDate, endDate } = req.query;
    let filter = {};
    try {
        if (search && search !== "") {
            filter = Object.assign(Object.assign({}, filter), { OR: [{ name: { contains: search } }] });
        }
        if (startDate && endDate) {
            const startDay = `${startDate.toString()}T00:00:00.000Z`;
            const endDay = `${endDate.toString()}T23:59:59.999Z`;
            filter = Object.assign(Object.assign({}, filter), { AND: [{ created_at: { gte: startDay, lte: endDay } }] });
        }
        const result = yield prisma_1.prisma.product.findMany({
            orderBy: {
                created_at: "desc",
            },
            take: Number(take),
            skip: Number(skip),
            where: filter,
            include: {
                category: true,
            },
        });
        const total = yield prisma_1.prisma.product.count({
            where: filter,
        });
        return res.status(200).json({
            message: "Berhasil fetch product data",
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
            errorMessage: error.message,
        });
    }
});
exports.getProductForDisplay = getProductForDisplay;
const getProductForReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allProducts = yield prisma_1.prisma.product.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                category: true,
            }
        });
        const noCategoryProducts = allProducts
            .filter((product) => !product.category.name.includes("Roti Kecil") &&
            !product.category.name.includes("Roti Sedang") &&
            !product.category.name.includes("Roti Besar"))
            .sort((a, b) => a.category.name.localeCompare(b.category.name));
        const smallBreadProducts = allProducts
            .filter((product) => product.category.name.includes("Roti Kecil"))
            .sort((a, b) => a.category.name.localeCompare(b.category.name));
        const mediumBreadProducts = allProducts
            .filter((product) => product.category.name.includes("Roti Sedang"))
            .sort((a, b) => a.category.name.localeCompare(b.category.name));
        const largeBreadProducts = allProducts
            .filter((product) => product.category.name.includes("Roti Besar"))
            .sort((a, b) => a.category.name.localeCompare(b.category.name));
        const sortedProducts = [
            ...noCategoryProducts,
            ...smallBreadProducts,
            ...mediumBreadProducts,
            ...largeBreadProducts,
        ];
        return res.status(200).json({
            message: "Berhasil fetch data produk",
            data: sortedProducts,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.getProductForReport = getProductForReport;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const result = yield prisma_1.prisma.product.findUnique({
            where: {
                id,
            },
            include: {
                category: true,
            },
        });
        return res.status(200).json({
            message: "Berhasil fetch produk",
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
exports.getProductById = getProductById;
const createNewProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, picture, price, category, max_age } = req.body;
    try {
        const existingCategory = yield prisma_1.prisma.category_product.findFirst({
            where: {
                name: category,
            },
        });
        if (!existingCategory) {
            return res.status(404).json({
                message: `Kategori ${category} tidak ditemukan`,
            });
        }
        const result = yield prisma_1.prisma.product.create({
            data: {
                name,
                picture,
                price,
                category: {
                    connect: {
                        id: existingCategory.id,
                    },
                },
                max_age,
            },
        });
        return res.status(201).json({
            message: "Berhasil membuat produk",
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
exports.createNewProduct = createNewProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, picture, price, category, max_age } = req.body;
    const existingProduct = yield prisma_1.prisma.product.findUnique({
        where: {
            id,
        },
    });
    if (!existingProduct) {
        return res.status(404).json({
            message: "Produk tidak ditemukan",
        });
    }
    const existingCategory = yield prisma_1.prisma.category_product.findFirst({
        where: {
            name: category,
        },
    });
    if (!existingCategory) {
        return res.status(404).json({
            message: "Kategori tidak ditemukan",
        });
    }
    try {
        yield prisma_1.prisma.product.update({
            where: {
                id: existingProduct.id,
            },
            data: {
                name,
                picture,
                price,
                category: {
                    connect: {
                        id: existingCategory.id,
                    },
                },
                max_age,
            },
        });
        return res.status(200).json({
            message: "Berhasil edit produk",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const existingProduct = yield prisma_1.prisma.product.findUnique({
        where: {
            id,
        },
    });
    if (!existingProduct) {
        return res.status(404).json({
            message: "Produk tidak ditemukan",
        });
    }
    try {
        yield prisma_1.prisma.product.delete({
            where: {
                id: existingProduct.id,
            },
        });
        return res.status(200).json({
            message: "Berhasil menghapus produk",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.deleteProduct = deleteProduct;
