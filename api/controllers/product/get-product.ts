import e, { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const getProduct = async (req: Request, res: Response) => {
  try {
    const result = await prisma.product.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        category: true
      }
    });

    return res.status(200).json({
      message: "Berhasil fetch product data",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: {
        errorMessage: error.message,
        error: error,
      },
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const result = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true
      }
    });
    return res.status(200).json({
      message: "Berhasil fetch produk",
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

export const getProductByProductCode = async (req: Request, res: Response) => {
  const { product_code } = req.body;
  try {
    const result = await prisma.product.findFirst({
      where: {
        product_code,
      },
      include: {
        category: true
      }
    });
    return res.status(200).json({
      message: "Berhasil fetch produk",
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
