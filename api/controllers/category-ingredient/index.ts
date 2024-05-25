import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const getCategoryIngredients = async (req: Request, res: Response) => {
  try {
    const result = await prisma.ingredient_category.findMany();
    return res.status(200).json({
      message: "Berhasil fetch data kategori bahan baku",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message
    });
  }
};

export const getCategoryIngredientById = async (req: Request, res: Response) => {

  try {
    const result = await prisma.ingredient_category.findUnique({
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

export const createCategoryIngredient = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    await prisma.ingredient_category.create({
      data: {
        name,
      },
    });
    return res.status(201).json({
      message: "Berhasil membuat kategori bahan baku",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message
    });
  }
};

export const updateCategoryIngredient = async (req: Request, res: Response) => {
  const { id, name } = req.body;

  const existingCategory = await prisma.ingredient_category.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    return res.status(404).json({
      message: "Kategori bahan baku tidak ditemukan",
    });
  }
  try {
    await prisma.ingredient_category.update({
      where: {
        id: existingCategory.id,
      },
      data: {
        name,
      },
    });
    return res.status(200).json({
      message: "Kategori bahan baku berhasil diubah",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message
    });
  }
};


export const deleteCategoryIngredient = async (req: Request, res: Response) => {
    const { id } = req.body;

  const existingCategory = await prisma.ingredient_category.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    return res.status(404).json({
      message: "Kategori bahan baku tidak ditemukan",
    });
  }
  try {
    await prisma.ingredient_category.delete({
      where: {
        id: existingCategory.id,
      }
    });
    return res.status(200).json({
      message: "Kategori bahan baku berhasil dihapus",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message
    });
  }
}