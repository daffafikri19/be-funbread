import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const CreateCategoryProduct = async (req: Request, res: Response) => {
  const { label } = req.body;

  try {
    await prisma.categoryProduct.create({
      data: {
        label,
      },
    });
    return res.status(201).json({
      message: "Berhasil membuat kategori produk",
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
