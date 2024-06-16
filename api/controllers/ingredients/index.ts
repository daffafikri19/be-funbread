import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const getAllIngredients = async (req: Request, res: Response) => {
  const { skip, take, search } = req.query;

  let filter: any = {};

  try {
    if (search && search !== "") {
      filter = {
        ...filter,
        OR: [{ name: { contains: search } }],
      };
    }

    const result = await prisma.ingredient.findMany({
      take: Number(take),
      skip: Number(skip),
      where: filter,
      include: {
        category: true,
      },
    });

    const total = await prisma.ingredient.count({
      where: filter,
    });

    return res.status(200).json({
      message: "Berhasil fetch data bahan baku",
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
      errorMessage: error.message
    });
  }
};

export const getIngredientById = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
      const result = await prisma.ingredient.findUnique({
        where: {
            id
        },
        include: {
          category: true,
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
        message: "Internal server error",
        errorMessage: error.message
      });
    }
  };

export const createIngredient = async (req: Request, res: Response) => {
  const { name, category, price, unit } = req.body;

  try {

    if(!category) {
      return res.status(400).json({
        message: "Kategori tidak boleh kosong"
      })
    }

    const existingCategory = await prisma.ingredient_category.findFirst({
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
        category: {
          connect: {
            id: existingCategory.id,
          },
        },
        price,
        unit: unit
      },
    });
    return res.status(201).json({
      message: "Berhasil membuat data bahan baku",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message
    });
  }
};

export const editIngredient = async (req: Request, res: Response) => {
  const { id, name, category, price, unit } = req.body;

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

    const existingCategory = await prisma.ingredient_category.findFirst({
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
        category: {
          connect: {
            id: existingCategory.id,
          },
        },
        price,
        unit
      },
    });

    return res.status(200).json({
      message: "Berhasil edit data bahan baku",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message
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
      message: "Internal server error",
      errorMessage: error.message
    });
  }
};
