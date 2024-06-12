import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const getCategoryProduct = async (req: Request, res: Response) => {
  const { search } = req.query;

  let filter: any = {};

  try {
    if(search && search !== "") {
      filter = {
        ...filter,
        OR: [{ name: { contains: search } }]
      }
    }

    const result = await prisma.category_product.findMany({
      where: filter
    });
    return res.status(200).json({
      message: "Berhasil fetch data kategori",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message
    });
  }
};

export const getCategoryProductById = async (req: Request, res: Response) => {

  try {
    const result = await prisma.category_product.findUnique({
      where: {
        id: req.body.id
      }
    });

    if(!result) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan"
      })
    }
    return res.status(200).json({
      message: "Berhasil fetch data kategori",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message
    });
  }
};

export const createCategoryProduct = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    await prisma.category_product.create({
      data: {
        name,
      },
    });
    return res.status(201).json({
      message: "Berhasil membuat kategori produk",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message
    });
  }
};

export const updateCategoryProduct = async (req: Request, res: Response) => {
  const { id, name } = req.body;

  const existingCategory = await prisma.category_product.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    return res.status(404).json({
      message: "Kategori tidak ditemukan",
    });
  }
  try {
    await prisma.category_product.update({
      where: {
        id: existingCategory.id,
      },
      data: {
        name,
      },
    });
    return res.status(200).json({
      message: "Kategori berhasil diubah",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message
    });
  }
};


export const deleteCategoryProduct = async (req: Request, res: Response) => {
    const { id } = req.body;

  const existingCategory = await prisma.category_product.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    return res.status(404).json({
      message: "Kategori tidak ditemukan",
    });
  }
  try {
    await prisma.category_product.delete({
      where: {
        id: existingCategory.id,
      }
    });
    return res.status(200).json({
      message: "Kategori berhasil dihapus",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message
    });
  }
}