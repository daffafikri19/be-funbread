import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const CreateNewProduct = async (req: Request, res: Response) => {
  const {
    name,
    product_code,
    picture,
    price,
    category_id
  } = req.body;

  try {
   const result =  await prisma.product.create({
      data: {
        name,
        product_code,
        picture,
        price,
        category: {
          connect: {
            id: category_id,
          },
        }
      },
    });

    return res.status(201).json({
      message: "Berhasil membuat produk",
      data: result
    })
  } catch (error: any) {
    return res.status(500).json({
      message: "Terjadi kesalahan server saat membuat produk",
      data: {
        errorMessage: error.message,
        error: error
      }
    });
  }
};
