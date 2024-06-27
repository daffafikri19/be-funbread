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
exports.createReportIngredient = exports.getReportIngredientById = exports.fetchAllReportIngredients = void 0;
const prisma_1 = require("../../../../lib/prisma");
const fetchAllReportIngredients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, take, search, startDate, endDate } = req.query;
    let filter = {};
    try {
        if (search && search !== "") {
            filter = Object.assign(Object.assign({}, filter), { OR: [{ id: { contains: search } }] });
        }
        if (startDate && endDate) {
            const startDay = `${startDate.toString()}T00:00:00.000Z`;
            const endDay = `${endDate.toString()}T23:59:59.999Z`;
            filter = Object.assign(Object.assign({}, filter), { AND: [{ report_date: { gte: startDay, lte: endDay } }] });
        }
        const data = yield prisma_1.prisma.report_ingredient.findMany({
            orderBy: {
                report_date: "desc",
            },
            take: Number(take),
            skip: Number(skip),
            where: filter,
            include: {
                detail: true,
            },
        });
        const total = yield prisma_1.prisma.report_ingredient.count();
        return res.status(200).json({
            message: "Berhasil fetch data report bahan baku",
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
exports.fetchAllReportIngredients = fetchAllReportIngredients;
const getReportIngredientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.prisma.report_ingredient.findUnique({
            where: {
                id: req.body.id,
            },
            include: {
                detail: {
                    include: {
                        ingredient: true
                    }
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
exports.getReportIngredientById = getReportIngredientById;
const createReportIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, reporter, details } = req.body;
    const today = new Date(date);
    const startDay = new Date(today);
    startDay.setUTCHours(0, 0, 0, 0);
    const endDay = new Date(today);
    endDay.setUTCHours(23, 59, 59, 999);
    try {
        const existingUser = yield prisma_1.prisma.user.findUnique({
            where: {
                name: reporter,
            },
        });
        if (!existingUser) {
            return res.status(404).json({
                message: "User tidak ditemukan",
            });
        }
        const existingReport = yield prisma_1.prisma.report_ingredient.findFirst({
            where: {
                reporter: existingUser.id,
                report_date: {
                    gte: startDay,
                    lte: endDay,
                },
            },
        });
        if (existingReport) {
            return res.status(409).json({
                message: "Laporan bahan baku untuk hari ini sudah ada",
            });
        }
        const result = yield prisma_1.prisma.report_ingredient.create({
            data: {
                reporter: existingUser.name,
                report_date: today,
                detail: {
                    create: details.map((detail) => ({
                        ingredient_id: parseInt(detail.id),
                        quantity: detail.quantity,
                        pieces: detail.pieces,
                    })),
                },
            },
            include: {
                detail: true,
            },
        });
        return res.status(201).json({
            message: "Berhasil membuat laporan bahan baku",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.createReportIngredient = createReportIngredient;
