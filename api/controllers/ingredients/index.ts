import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const getAllIngredients = async (req: Request, res: Response) => {
  try {
    const result = await prisma.ingredient.findMany({
      include: {
        categories: true,
      },
    });

    return res.status(200).json({
      message: "Berhasil fetch data bahan baku",
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

export const getIngredientById = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
      const result = await prisma.ingredient.findUnique({
        where: {
            id
        }
      });
      if(!result) {
        return res.status(404).json({
            message: "Bahan baku tidak ditemukan"
        })
      }

      return res.status(200).json({
        message: "Berhasil fetch data ingredient",
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

export const createIngredient = async (req: Request, res: Response) => {
  const { name, category } = req.body;

  try {
    const existingCategory = await prisma.category_product.findFirst({
      where: {
        name: category,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    await prisma.ingredient.create({
      data: {
        name,
        categories: {
          connect: {
            id: existingCategory.id,
          },
        },
      },
    });
    return res.status(201).json({
      message: "Berhasil membuat data bahan baku",
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

export const editIngredient = async (req: Request, res: Response) => {
  const { id, name, category } = req.body;

  try {
    const existingIngredient = await prisma.ingredient.findUnique({
      where: {
        id,
      },
    });

    if (!existingIngredient) {
      return res.status(404).json({
        message: "Data bahan baku tidak ditemukan",
      });
    }

    const existingCategory = await prisma.category_product.findFirst({
      where: {
        name: category,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    await prisma.ingredient.update({
      where: {
        id: existingIngredient.id,
      },
      data: {
        name,
        categories: {
          connect: {
            id: existingCategory.id,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Berhasil edit data bahan baku",
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

export const deleteIngredient = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const existingIngredient = await prisma.ingredient.findUnique({
      where: {
        id,
      },
    });

    if (!existingIngredient) {
      return res.status(404).json({
        message: "Data bahan baku tidak ditemukan",
      });
    }

    await prisma.ingredient.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Berhasil menghapus data bahan baku",
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
