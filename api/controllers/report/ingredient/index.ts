import { Request, Response } from "express";
import { prisma } from "../../../../lib/prisma";

export const fetchAllReportIngredients = async (
  req: Request,
  res: Response
) => {
  const { skip, take, search, startDate, endDate } = req.query;

  let filter: any = {};

  try {
    if (search && search !== "") {
      filter = {
        ...filter,
        OR: [{ id: { contains: search } }],
      };
    }

    if (startDate && endDate) {
      const startDay = `${startDate.toString()}T00:00:00.000Z`;
      const endDay = `${endDate.toString()}T23:59:59.999Z`;

      filter = {
        ...filter,
        AND: [{ report_date: { gte: startDay, lte: endDay } }],
      };
    }

    const data = await prisma.report_ingredient.findMany({
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

    const total = await prisma.report_ingredient.count();
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const getReportIngredientById = async (req: Request, res: Response) => {
  try {
    const result = await prisma.report_ingredient.findUnique({
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const createReportIngredient = async (req: Request, res: Response) => {
  const { date, reporter, details } = req.body;

  const today = new Date(date);
  const startDay = new Date(today);
  startDay.setUTCHours(0, 0, 0, 0);

  const endDay = new Date(today);
  endDay.setUTCHours(23, 59, 59, 999);

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        name: reporter,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const existingReport = await prisma.report_ingredient.findFirst({
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

    const result = await prisma.report_ingredient.create({
      data: {
        reporter: existingUser.name,
        report_date: today,
        detail: {
          create: details.map((detail: any) => ({
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};
