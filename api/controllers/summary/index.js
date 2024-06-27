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
exports.current5ReportData = exports.periodedSalesSummary = exports.topSellingProduct = exports.totalSalesShiftSummary = void 0;
const prisma_1 = require("../../../lib/prisma");
const date_fns_1 = require("date-fns");
// total penjualan per shift
const totalSalesShiftSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = req.query;
    let filter = {};
    try {
        if (startDate && endDate) {
            const startDay = `${startDate.toString()}T00:00:00.000Z`;
            const endDay = `${endDate.toString()}T23:59:59.999Z`;
            filter = Object.assign(Object.assign({}, filter), { AND: [{ report_date: { gte: startDay, lte: endDay } }] });
        }
        const data = yield prisma_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const dataReport = yield prisma.report_stock.findMany({
                where: filter,
                orderBy: {
                    report_date: "desc",
                },
                select: {
                    grand_total: true,
                    report_shift_1: {
                        select: {
                            values: true,
                        },
                    },
                    report_shift_2: {
                        select: {
                            values: true,
                        },
                    },
                },
            });
            return dataReport;
        }));
        let result = {
            all: 0,
            shift_1: 0,
            shift_2: 0,
        };
        data.forEach((report) => {
            if (report.report_shift_1 && report.report_shift_1.values) {
                const shift1Total = Object.values(report.report_shift_1.values).reduce((sum, item) => {
                    return sum + (item.total_price || 0);
                }, 0);
                result.shift_1 += shift1Total;
            }
            if (report.report_shift_2 && report.report_shift_2.values) {
                const shift2Total = Object.values(report.report_shift_2.values).reduce((sum, item) => {
                    return sum + (item.total_price || 0);
                }, 0);
                result.shift_2 += shift2Total;
            }
        });
        result.all = result.shift_1 + result.shift_2;
        return res.status(200).json({
            message: "berhasil fetch",
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
exports.totalSalesShiftSummary = totalSalesShiftSummary;
const topSellingProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { topCount, startDate, endDate } = req.query;
    const count = topCount ? parseInt(topCount.toString()) : 5;
    let filter = {};
    try {
        if (startDate && endDate) {
            const startDay = `${startDate.toString()}T00:00:00.000Z`;
            const endDay = `${endDate.toString()}T23:59:59.999Z`;
            filter = Object.assign(Object.assign({}, filter), { AND: [{ report_date: { gte: startDay, lte: endDay } }] });
        }
        const data = yield prisma_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.report_stock.findMany({
                where: filter,
                orderBy: {
                    report_date: "desc",
                },
                select: {
                    report_shift_1: {
                        select: {
                            values: true,
                        },
                    },
                    report_shift_2: {
                        select: {
                            values: true,
                        },
                    },
                },
            });
        }));
        const productSales = {};
        data.forEach((report) => {
            if (report.report_shift_1 && report.report_shift_1.values) {
                Object.entries(report.report_shift_1.values).forEach(([productName, value]) => {
                    productSales[productName] =
                        (productSales[productName] || 0) + (value.total_sold || 0);
                });
            }
            if (report.report_shift_2 && report.report_shift_2.values) {
                Object.entries(report.report_shift_2.values).forEach(([productName, value]) => {
                    productSales[productName] =
                        (productSales[productName] || 0) + (value.total_sold || 0);
                });
            }
        });
        const topProducts = Object.entries(productSales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, count)
            .map(([name, y]) => ({ name, y }));
        return res.status(200).json({
            message: `Berhasil fetch top ${count} produk terlaris`,
            data: topProducts,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.topSellingProduct = topSellingProduct;
const periodedSalesSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.query;
    try {
        const targetDate = date ? (0, date_fns_1.parseISO)(date.toString()) : new Date();
        const startDate = (0, date_fns_1.startOfMonth)(targetDate);
        const endDate = (0, date_fns_1.endOfMonth)(targetDate);
        const startDay = startDate.toISOString();
        const endDay = endDate.toISOString();
        const reports = yield prisma_1.prisma.report_stock.findMany({
            where: {
                report_date: {
                    gte: startDay,
                    lte: endDay,
                },
            },
            orderBy: {
                report_date: "asc",
            },
            select: {
                report_date: true,
                grand_total: true,
                report_shift_1: {
                    select: {
                        values: true,
                    },
                },
                report_shift_2: {
                    select: {
                        values: true,
                    },
                },
            },
        });
        const allDaysInMonth = (0, date_fns_1.eachDayOfInterval)({
            start: startDate,
            end: endDate,
        });
        const salesSummary = allDaysInMonth.map((day) => {
            var _a, _b;
            const formattedDate = (0, date_fns_1.formatISO)(day, { representation: "date" });
            const report = reports.find((report) => (0, date_fns_1.formatISO)((0, date_fns_1.parseISO)(report.report_date.toISOString()), {
                representation: "date",
            }) === formattedDate);
            let shift1Total = 0;
            let shift2Total = 0;
            if ((_a = report === null || report === void 0 ? void 0 : report.report_shift_1) === null || _a === void 0 ? void 0 : _a.values) {
                if (typeof report.report_shift_1.values === "object" &&
                    !Array.isArray(report.report_shift_1.values)) {
                    const shift1Values = report.report_shift_1.values;
                    shift1Total = Object.values(shift1Values).reduce((sum, product) => { var _a; return sum + ((_a = product.total_price) !== null && _a !== void 0 ? _a : 0); }, 0);
                }
                else if (typeof report.report_shift_1.values === "string") {
                    try {
                        const shift1Values = JSON.parse(report.report_shift_1.values);
                        shift1Total = Object.values(shift1Values).reduce((sum, product) => { var _a; return sum + ((_a = product.total_price) !== null && _a !== void 0 ? _a : 0); }, 0);
                    }
                    catch (error) {
                        console.error("Failed to parse report_shift_1.values:", error);
                    }
                }
            }
            // Check and parse report_shift_2 values
            if ((_b = report === null || report === void 0 ? void 0 : report.report_shift_2) === null || _b === void 0 ? void 0 : _b.values) {
                if (typeof report.report_shift_2.values === "object" &&
                    !Array.isArray(report.report_shift_2.values)) {
                    const shift2Values = report.report_shift_2.values;
                    shift2Total = Object.values(shift2Values).reduce((sum, product) => { var _a; return sum + ((_a = product.total_price) !== null && _a !== void 0 ? _a : 0); }, 0);
                }
                else if (typeof report.report_shift_2.values === "string") {
                    try {
                        const shift2Values = JSON.parse(report.report_shift_2.values);
                        shift2Total = Object.values(shift2Values).reduce((sum, product) => { var _a; return sum + ((_a = product.total_price) !== null && _a !== void 0 ? _a : 0); }, 0);
                    }
                    catch (error) {
                        console.error("Failed to parse report_shift_2.values:", error);
                    }
                }
            }
            return {
                report_date: formattedDate,
                shift_1_total: shift1Total,
                shift_2_total: shift2Total,
            };
        });
        return res.status(200).json({
            message: "Berhasil fetch data penjualan",
            data: salesSummary,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.periodedSalesSummary = periodedSalesSummary;
const current5ReportData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportStock = yield prisma_1.prisma.report_stock.findMany({
            select: {
                id: true,
                grand_total: true,
                report_date: true,
            },
            orderBy: {
                report_date: "desc",
            },
            take: 5,
        });
        const reportSales = yield prisma_1.prisma.report_sales.findMany({
            select: {
                id: true,
                reporter: true,
                report_date: true,
            },
            orderBy: {
                report_date: "desc",
            },
            take: 5
        });
        const reportIngredient = yield prisma_1.prisma.report_ingredient.findMany({
            select: {
                id: true,
                reporter: true,
                report_date: true,
            },
            orderBy: {
                report_date: "desc",
            },
            take: 5
        });
        const result = {
            report_stock: reportStock,
            report_sales: reportSales,
            report_ingredients: reportIngredient,
        };
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
exports.current5ReportData = current5ReportData;
