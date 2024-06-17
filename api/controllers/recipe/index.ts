import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const fetchAllRecipes = async (req: Request, res: Response) => {
  const { skip, take, search } = req.query;

  let filter: any = {};

  try {
    if (search && search !== "") {
      filter = {
        ...filter,
        OR: [{ name: { contains: search } }],
      };
    }

    const data = await prisma.recipe.findMany({
      take: Number(take),
      skip: Number(skip),
      where: filter,
      include: {
        recipes_ingredient: {
          include: {
            ingredients: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const total = await prisma.recipe.count({
      where: filter,
    });

    return res.status(200).json({
      message: "Berhasil fetch data resep",
      data: {
        result: data,
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
      errorMessage: error.message,
    });
  }
};

export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const result = await prisma.recipe.findUnique({
      where: {
        id: req.body.id,
      },
      include: {
        recipes_ingredient: {
          include: {
            ingredients: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      return res.status(404).json({
        message: "Data laporan id tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: "Berhasil fetch",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const CreateRecipe = async (req: Request, res: Response) => {
  const recipes = req.body;
  try {
    await prisma.$transaction(async (prisma) => {
      for (const recipe of recipes) {
        const ingredientNames = recipe.bahan.map(
          (bahan: any) => bahan.ingredients
        );
        const ingredients = await prisma.ingredient.findMany({
          where: {
            name: {
              in: ingredientNames,
            },
          },
        });

        const missingIngredients = ingredientNames.filter(
          (name: string) =>
            !ingredients.some((ingredient) => ingredient.name === name)
        );

        if (missingIngredients.length) {
          throw new Error(
            `Ingredient(s) "${missingIngredients.join(", ")}" tidak ditemukan`
          );
        }

        const ingredientMap = new Map(
          ingredients.map((ingredient) => [ingredient.name, ingredient.id])
        );

        const recipeIngredients = recipe.bahan.map((bahan: any) => ({
          ingredient_id: ingredientMap.get(bahan.ingredients)!,
          dose: bahan.dose,
        }));

        await prisma.recipe.create({
          data: {
            name: recipe.nama,
            notes: recipe.notes,
            recipes_ingredient: {
              create: recipeIngredients,
            },
          },
        });
      }
    });

    res.status(201).json({
      message: "Berhasil membuat resep",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const editRecipe = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama, notes, bahan } = req.body;
  
    try {
      await prisma.$transaction(async (prisma) => {
        const updatedRecipe = await prisma.recipe.update({
          where: { id: parseInt(id) },
          data: {
            name: nama,
            notes: notes,
          },
        });
  
        await prisma.recipes_ingredient.deleteMany({
          where: { recipe_id: updatedRecipe.id },
        });
  
        const ingredientNames = bahan.map((bahan: any) => bahan.ingredients);
        const ingredients = await prisma.ingredient.findMany({
          where: {
            name: {
              in: ingredientNames,
            },
          },
        });
  
        const missingIngredients = ingredientNames.filter(
          (name: string) => !ingredients.some((ingredient) => ingredient.name === name)
        );
  
        if (missingIngredients.length) {
          throw new Error(
            `Ingredient(s) "${missingIngredients.join(', ')}" tidak ditemukan`
          );
        }
  
        const ingredientMap = new Map(ingredients.map((ingredient) => [ingredient.name, ingredient.id]));
  
        await prisma.recipes_ingredient.createMany({
          data: bahan.map((bahan: any) => ({
            ingredient_id: ingredientMap.get(bahan.ingredients)!,
            dose: bahan.dose,
            recipe_id: updatedRecipe.id,
          })),
        });
      });
  
      res.status(200).json({
        message: "Resep berhasil diperbarui",
      });
    } catch (error: any) {
      console.error("Error saat memperbarui resep:", error);
      return res.status(500).json({
        message: "Internal server error",
        errorMessage: error.message,
      });
    }
};

export const deleteRecipe = async (req: Request, res: Response) => {
    try {
        const existingRecipe = await prisma.recipe.findUnique({
            where: {
                id: req.body.id
            }
        });

        if(!existingRecipe) {
            return res.status(404).json({
                message: "ID resep tidak ditemukan"
            })
        }

        await prisma.recipe.delete({
            where: {
                id: existingRecipe.id
            }
        });
        return res.status(200).json({
            message: "Berhasil menghapus resep"
        })
    } catch (error: any) {
        return res.status(500).json({
          message: "Internal server error",
          errorMessage: error.message,
        });
      }
}