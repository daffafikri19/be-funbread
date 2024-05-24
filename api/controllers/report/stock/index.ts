import { Request, Response } from "express";
import { prisma } from "../../../../lib/prisma";


export const fetchAllReport = async (req: Request, res: Response) => {
  const { skip, take, search, startDate, endDate } = req.query;

  let filter = {};

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

    const result = await prisma.report_stock.findMany({
      orderBy: {
        report_date: "desc",
      },
      take: Number(take),
      skip: Number(skip),
      where: filter,
      include: {
        report_shift_1: {
          include: {
            reporter: true
          }
        },
        report_shift_2: {
          include: {
            reporter: true
          }
        }
      }
    });

    const total = await prisma.report_stock.count({
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
}

export const fetchReportShiftYesterday = async (
  req: Request,
  res: Response
) => {
    const yesterday = new Date(Date.now());
    yesterday.setDate(yesterday.getDate() - 1);
  
    const startDay = new Date(yesterday);
    startDay.setUTCHours(0, 0, 0, 0);
  
    const endDay = new Date(yesterday);
    endDay.setUTCHours(23, 59, 59, 999);
  try {
    
    const result = await prisma.report_stock.findFirst({
      where: {
        report_date: {
            gte: startDay.toISOString(), lte: endDay.toISOString()
        },
      },
      select: {
        id: true,
        report_date: true,
        report_shift_1: true,
        report_shift_2: true,
        grand_total: true,
      }
    });

    return res.status(200).json({
      message: "berhasil fetch laporan kemarin",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const createReportStockShift1 = async (req: Request, res: Response) => {
  const { reporter, values, grand_total } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: {
      name: reporter,
    },
  });

  if (!existingUser) {
    return res.status(400).json({
      message: "Akun pengguna tidak ditemukan",
    });
  }
  try {
    await prisma.report_stock.create({
      data: {
        grand_total: grand_total,
        report_shift_1: {
            create: {
                reporter: {
                    connect: {
                        name: reporter
                    }
                },
                values: values
            }
        },
      },
    });

    return res.status(201).json({
      message: "Laporan shift 1 berhasil dibuat",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};
