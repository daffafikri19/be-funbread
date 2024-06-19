import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { report_stock } from "@prisma/client";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  formatISO,
  parseISO,
} from "date-fns";
import { JsonValue } from "@prisma/client/runtime/library";

// total penjualan per shift
export const totalSalesShiftSummary = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  let filter: any = {};
  try {
    if (startDate && endDate) {
      const startDay = `${startDate.toString()}T00:00:00.000Z`;
      const endDay = `${endDate.toString()}T23:59:59.999Z`;

      filter = {
        ...filter,
        AND: [{ report_date: { gte: startDay, lte: endDay } }],
      };
    }

    const data = await prisma.$transaction(async (prisma) => {
      const dataReport = await prisma.report_stock.findMany({
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
    });

    let result = {
      all: 0,
      shift_1: 0,
      shift_2: 0,
    };

    data.forEach((report) => {
      if (report.report_shift_1 && report.report_shift_1.values) {
        const shift1Total = Object.values(report.report_shift_1.values).reduce(
          (sum, item: any) => {
            return sum + (item.total_price || 0);
          },
          0
        );
        result.shift_1 += shift1Total;
      }

      if (report.report_shift_2 && report.report_shift_2.values) {
        const shift2Total = Object.values(report.report_shift_2.values).reduce(
          (sum, item: any) => {
            return sum + (item.total_price || 0);
          },
          0
        );
        result.shift_2 += shift2Total;
      }
    });

    result.all = result.shift_1 + result.shift_2;

    return res.status(200).json({
      message: "berhasil fetch",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const topSellingProduct = async (req: Request, res: Response) => {
  const { topCount, startDate, endDate } = req.query;
  const count = topCount ? parseInt(topCount.toString()) : 5;

  let filter: any = {};

  try {
    if (startDate && endDate) {
      const startDay = `${startDate.toString()}T00:00:00.000Z`;
      const endDay = `${endDate.toString()}T23:59:59.999Z`;

      filter = {
        ...filter,
        AND: [{ report_date: { gte: startDay, lte: endDay } }],
      };
    }

    const data = await prisma.$transaction(async (prisma) => {
      return await prisma.report_stock.findMany({
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
    });

    const productSales: { [key: string]: number } = {};

    data.forEach((report) => {
      if (report.report_shift_1 && report.report_shift_1.values) {
        Object.entries(report.report_shift_1.values).forEach(
          ([productName, value]: [string, any]) => {
            productSales[productName] =
              (productSales[productName] || 0) + (value.total_sold || 0);
          }
        );
      }

      if (report.report_shift_2 && report.report_shift_2.values) {
        Object.entries(report.report_shift_2.values).forEach(
          ([productName, value]: [string, any]) => {
            productSales[productName] =
              (productSales[productName] || 0) + (value.total_sold || 0);
          }
        );
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

interface ProductData {
  total_price: number;
}

interface ReportShift {
  values: JsonValue | Record<string, ProductData>;
}

interface Report {
  report_date: Date;
  grand_total: number | null;
  report_shift_1?: ReportShift | null;
  report_shift_2?: ReportShift | null;
}

export const periodedSalesSummary = async (req: Request, res: Response) => {
  const { date } = req.query;

  try {
    const targetDate = date ? parseISO(date.toString()) : new Date();
    const startDate = startOfMonth(targetDate);
    const endDate = endOfMonth(targetDate);

    const startDay = startDate.toISOString();
    const endDay = endDate.toISOString();

    const reports: Report[] = await prisma.report_stock.findMany({
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

    const allDaysInMonth = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    const salesSummary = allDaysInMonth.map((day: Date) => {
      const formattedDate = formatISO(day, { representation: "date" });

      const report = reports.find(
        (report) =>
          formatISO(parseISO(report.report_date.toISOString()), {
            representation: "date",
          }) === formattedDate
      );

      let shift1Total = 0;
      let shift2Total = 0;

      if (report?.report_shift_1?.values) {
        if (
          typeof report.report_shift_1.values === "object" &&
          !Array.isArray(report.report_shift_1.values)
        ) {
          const shift1Values = report.report_shift_1.values as Record<
            string,
            ProductData
          >;
          shift1Total = Object.values(shift1Values).reduce(
            (sum, product) => sum + (product.total_price ?? 0),
            0
          );
        } else if (typeof report.report_shift_1.values === "string") {
          try {
            const shift1Values = JSON.parse(
              report.report_shift_1.values
            ) as Record<string, ProductData>;
            shift1Total = Object.values(shift1Values).reduce(
              (sum, product) => sum + (product.total_price ?? 0),
              0
            );
          } catch (error) {
            console.error("Failed to parse report_shift_1.values:", error);
          }
        }
      }

      // Check and parse report_shift_2 values
      if (report?.report_shift_2?.values) {
        if (
          typeof report.report_shift_2.values === "object" &&
          !Array.isArray(report.report_shift_2.values)
        ) {
          const shift2Values = report.report_shift_2.values as Record<
            string,
            ProductData
          >;
          shift2Total = Object.values(shift2Values).reduce(
            (sum, product) => sum + (product.total_price ?? 0),
            0
          );
        } else if (typeof report.report_shift_2.values === "string") {
          try {
            const shift2Values = JSON.parse(
              report.report_shift_2.values
            ) as Record<string, ProductData>;
            shift2Total = Object.values(shift2Values).reduce(
              (sum, product) => sum + (product.total_price ?? 0),
              0
            );
          } catch (error) {
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const current5ReportData = async (req: Request, res: Response) => {
  try {
    const reportStock = await prisma.report_stock.findMany({
      select: {
        id: true,
        grand_total: true,
        report_date: true,
      },
      orderBy: {
        report_date: "desc",
      },
    });

    const reportSales = await prisma.report_sales.findMany({
      select: {
        id: true,
        reporter: true,
        report_date: true,
      },
      orderBy: {
        report_date: "desc",
      },
    });

    const reportIngredient = await prisma.report_ingredient.findMany({
      select: {
        id: true,
        reporter: true,
        report_date: true,
      },
      orderBy: {
        report_date: "desc",
      },
    });

    const result = {
      report_stock: reportStock.slice(0, 5),
      report_sales: reportSales.slice(0, 5),
      report_ingredients: reportIngredient.slice(0, 5),
    };

    return res.status(200).json({
      message: "Berhasil fetch",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};
