import { Request, Response } from "express";
import { prisma } from "../../../../lib/prisma";

export const fetchAllReportSales = async (req: Request, res: Response) => {
  const { skip, take, search, startDate, endDate } = req.query;

  let filter: any = {};

  try {
    if(search && search !== "") {
      filter = {
        ...filter,
        OR: [{ id: { contains: search } }]
      }
    }

    if (startDate && endDate) {
      const startDay = `${startDate.toString()}T00:00:00.000Z`;
      const endDay = `${endDate.toString()}T23:59:59.999Z`;

      filter = {
        ...filter,
        AND: [{ created_at: { gte: startDay, lte: endDay } }],
      };
    }

    const data = await prisma.report_sales.findMany({
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
    
    const total = await prisma.product.count({
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const getSalesReportById = async (req: Request, res: Response) => {
  try {
    const result = await prisma.report_sales.findUnique({
      where: {
        id: req.body.id
      },
      include: {
        expences: true,
        non_cash: true
      }
    })

    if(!result) {
      return res.status(404).json({
        message: "Data laporan id tidak ditemukan"
      })
    }

    return res.status(200).json({
      message: "Berhasil fetch",
      data: result
    })
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
}

export const CreateReportSales = async (req: Request, res: Response) => {
  const { 
    reporter, 
    non_cash, 
    expences,
    total_income,
    total_cash,
    total_non_cash,
    total_expences
  } = req.body;

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

  try {
    await prisma.$transaction(async (prisma) => {
      const report = await prisma.report_sales.create({
        data: {
          reporter: existingUser.id,
          total_income,
          total_cash,
          total_non_cash,
          total_expences,
        },
      });

      await prisma.non_cash.createMany({
        data: non_cash.map((data: any) => ({
          ...data,
          report_id: report.id,
        })),
      });

      await prisma.expences.createMany({
        data: expences.map((data: any) => ({
          ...data,
          report_id: report.id,
        })),
      });
    });

    return res.status(200).json({
      message: "Berhasil membuat laporan",
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};
