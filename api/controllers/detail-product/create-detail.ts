import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const createDetailProduct = async (req: Request, res: Response) => {
  const { product_id, production_date, expiry_date, age } = req.body;

  if (!product_id) {
    return res.status(404).json({
      message: "harap buat produk sebelum membuat detailnya",
    });
  }

  try {
    await prisma.detailProduct.create({
      data: {
        product: {
          connect: {
            id: product_id,
          },
        },
        production_date,
        expiry_date,
        age,
      },
    });

    return res.status(201).json({
      message: "Berhasil membuat detail produk",
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
