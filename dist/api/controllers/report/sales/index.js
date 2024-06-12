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
exports.CreateReportSales = exports.getSalesReportById = exports.fetchAllReportSales = void 0;
const prisma_1 = require("../../../../lib/prisma");
const fetchAllReportSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, take, search, startDate, endDate } = req.query;
    let filter = {};
    try {
        if (search && search !== "") {
            filter = Object.assign(Object.assign({}, filter), { OR: [{ id: { contains: search } }] });
        }
        if (startDate && endDate) {
            const startDay = `${startDate.toString()}T00:00:00.000Z`;
            const endDay = `${endDate.toString()}T23:59:59.999Z`;
            filter = Object.assign(Object.assign({}, filter), { AND: [{ created_at: { gte: startDay, lte: endDay } }] });
        }
        const data = yield prisma_1.prisma.report_sales.findMany({
            orderBy: {
                report_date: "desc",
            },
            take: Number(take),
            skip: Number(skip),
            where: filter,
            include: {
                non_cash: {
                    select: {
                        description: true,
                        amount: true,
                        reciept: true
                    }
                },
                expences: {
                    select: {
                        description: true,
                        amount: true
                    }
                }
            },
        });
        const total = yield prisma_1.prisma.product.count({
            where: filter
        });
        return res.status(200).json({
            message: "Berhasil fetch data report keuangan",
            data: {
                result: data,
                metadata: {
                    hasNextPage: Number(skip) + Number(take) < total,
                    totalPages: Math.ceil(total / Number(take)),
                    totalData: total,
                }
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
exports.fetchAllReportSales = fetchAllReportSales;
const getSalesReportById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.prisma.report_sales.findUnique({
            where: {
                id: req.body.id
            },
            include: {
                expences: true,
                non_cash: true
            }
        });
        if (!result) {
            return res.status(404).json({
                message: "Data laporan id tidak ditemukan"
            });
        }
        return res.status(200).json({
            message: "Berhasil fetch",
            data: result
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.getSalesReportById = getSalesReportById;
const CreateReportSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reporter, non_cash, expences, total_income, total_cash, total_non_cash, total_expences } = req.body;
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
    try {
        yield prisma_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const report = yield prisma.report_sales.create({
                data: {
                    reporter: existingUser.id,
                    total_income,
                    total_cash,
                    total_non_cash,
                    total_expences,
                },
            });
            yield prisma.non_cash.createMany({
                data: non_cash.map((data) => (Object.assign(Object.assign({}, data), { report_id: report.id }))),
            });
            yield prisma.expences.createMany({
                data: expences.map((data) => (Object.assign(Object.assign({}, data), { report_id: report.id }))),
            });
        }));
        return res.status(200).json({
            message: "Berhasil membuat laporan",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.CreateReportSales = CreateReportSales;
