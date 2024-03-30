import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const getCategoryProduct = async (req: Request, res: Response) => {
  try {
    const result = await prisma.categoryProduct.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    return res.status(200).json({
      message: "Berhasil fetch data kategori",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Terjadi kesalahan server",
      data: {
        errorMessage: error.message,
        error: error,
      },
    });
  }
};
