import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const CreateNewProduct = async (req: Request, res: Response) => {
  const {
    name,
    product_code,
    picture,
    price,
    category_id,
    production_date,
    expiry_date,
    age,
  } = req.body;

  try {
    await prisma.product.create({
      data: {
        name,
        product_code,
        picture,
        price,
        category: {
          connect: {
            id: category_id,
          },
        },
        detail: {
          create: {
            production_date,
            expiry_date,
            age,
          },
        },
      },
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
