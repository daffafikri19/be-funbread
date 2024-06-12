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
exports.deleteReportStock = exports.editReportStockShift2 = exports.editReportStockShift1 = exports.createReportStockShift2 = exports.createReportStockShift1 = exports.fetchReportShiftToday = exports.fetchReportShiftYesterday = exports.fetchAllReport = void 0;
const prisma_1 = require("../../../../lib/prisma");
const fetchAllReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield prisma_1.prisma.report_stock.findMany({
            orderBy: {
                report_date: "desc",
            },
            take: Number(take),
            skip: Number(skip),
            where: filter,
            include: {
                report_shift_1: {
                    select: {
                        reporter: true,
                        values: true,
                    },
                },
                report_shift_2: {
                    select: {
                        reporter: true,
                        values: true
                    },
                },
            },
        });
        const total = yield prisma_1.prisma.report_stock.count({
            where: filter,
        });
        return res.status(200).json({
            message: "Berhasil fetch data report stok",
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
exports.fetchAllReport = fetchAllReport;
const fetchReportShiftYesterday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.body;
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const startDay = new Date(yesterday);
    startDay.setUTCHours(0, 0, 0, 0);
    const endDay = new Date(yesterday);
    endDay.setUTCHours(23, 59, 59, 999);
    try {
        const result = yield prisma_1.prisma.report_stock.findFirst({
            where: {
                report_date: {
                    gte: startDay.toISOString(),
                    lte: endDay.toISOString(),
                },
            },
            select: {
                id: true,
                report_date: true,
                report_shift_1: true,
                report_shift_2: true,
            },
        });
        return res.status(200).json({
            message: "berhasil fetch laporan kemarin",
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
exports.fetchReportShiftYesterday = fetchReportShiftYesterday;
const fetchReportShiftToday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date(Date.now());
    const startDay = new Date(today);
    startDay.setUTCHours(0, 0, 0, 0);
    const endDay = new Date(today);
    endDay.setUTCHours(23, 59, 59, 999);
    try {
        const result = yield prisma_1.prisma.report_stock.findFirst({
            where: {
                report_date: {
                    gte: startDay.toISOString(),
                    lte: endDay.toISOString(),
                },
            },
            select: {
                id: true,
                report_date: true,
                report_shift_1: true,
            },
        });
        return res.status(200).json({
            message: "berhasil fetch laporan kemarin",
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
exports.fetchReportShiftToday = fetchReportShiftToday;
const createReportStockShift1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reporter, values, grand_total, date } = req.body;
    const existingUser = yield prisma_1.prisma.user.findUnique({
        where: {
            name: reporter,
        },
    });
    if (!existingUser) {
        return res.status(404).json({
            message: "Akun pengguna tidak ditemukan",
        });
    }
    try {
        yield prisma_1.prisma.report_stock.create({
            data: {
                grand_total: grand_total,
                report_date: date,
                report_shift_1: {
                    create: {
                        reporter: existingUser.id,
                        values: values,
                    },
                },
            },
        });
        return res.status(201).json({
            message: "Laporan shift 1 berhasil dibuat",
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
exports.createReportStockShift1 = createReportStockShift1;
const createReportStockShift2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { report_id, reporter, values, grand_total } = req.body;
    const existingUser = yield prisma_1.prisma.user.findUnique({
        where: {
            name: reporter,
        },
    });
    if (!existingUser) {
        return res.status(400).json({
            message: "Akun pengguna tidak ditemukan",
        });
    }
    const existingReport = yield prisma_1.prisma.report_stock.findUnique({
        where: {
            id: report_id,
        },
    });
    if (!existingReport) {
        return res.status(404).json({
            message: "tidak dapat membuat laporan stok shift 2 sebelum shift 1",
        });
    }
    try {
        yield prisma_1.prisma.report_stock.update({
            where: {
                id: report_id,
            },
            data: {
                report_shift_2: {
                    create: {
                        values,
                        reporter: existingUser.id,
                    },
                },
                grand_total: {
                    increment: grand_total
                }
            },
        });
        return res.status(201).json({
            message: "Laporan stok shift 2 berhasil dibuat",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.createReportStockShift2 = createReportStockShift2;
const editReportStockShift1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { report_id, values } = req.body;
    try {
        const report = yield prisma_1.prisma.report_stock_shift_1.findUnique({
            where: {
                id: report_id,
            },
        });
        if (!report) {
            return res.status(404).json({
                message: "Id laporan stok tidak ditemukan",
            });
        }
        yield prisma_1.prisma.report_stock_shift_1.update({
            where: {
                id: report.id,
            },
            data: {
                values,
            },
        });
        return res.status(200).json({
            message: "Berhasil edit data laporan ini"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.editReportStockShift1 = editReportStockShift1;
const editReportStockShift2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { report_id, values } = req.body;
    try {
        const report = yield prisma_1.prisma.report_stock_shift_2.findUnique({
            where: {
                id: report_id,
            },
        });
        if (!report) {
            return res.status(404).json({
                message: "ID laporan stok tidak ditemukan",
            });
        }
        yield prisma_1.prisma.report_stock_shift_2.update({
            where: {
                id: report.id,
            },
            data: {
                values,
            },
        });
        return res.status(200).json({
            message: "Berhasil edit data laporan ini"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.editReportStockShift2 = editReportStockShift2;
const deleteReportStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { report_id } = req.body;
    try {
        const existingReport = yield prisma_1.prisma.report_stock.findUnique({
            where: {
                id: report_id,
            },
        });
        if (!existingReport) {
            return res.status(404).json({
                message: "Id laporan tidak ditemukan",
            });
        }
        yield prisma_1.prisma.report_stock.delete({
            where: {
                id: existingReport.id,
            },
        });
        return res.status(200).json({
            message: "Berhasil menghapus data laporan ini",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.deleteReportStock = deleteReportStock;
