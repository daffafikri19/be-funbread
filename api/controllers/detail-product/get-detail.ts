import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const getAllDetailProduct = async (req: Request, res: Response) => {
  try {
    const result = await prisma.detailProduct.findMany();
    return res.status(200).json({
      message: "Berhasil fetch semua data detail produk",
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

export const getDetailProductByProductId = async (
  req: Request,
  res: Response
) => {
  const { product_id } = req.body;
  try {
    const result = await prisma.detailProduct.findUnique({
      where: {
        product_id,
      },
    });
    return res.status(200).json({
      message: "Berhasil fetch detail product by product id",
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

export const getDetailProductById = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const result = await prisma.detailProduct.findUnique({
      where: {
        id,
      },
    });
    return res.status(200).json({
      message: "Berhasil fetch detail product by id",
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
