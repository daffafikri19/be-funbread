import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const getProductForDisplay = async (req: Request, res: Response) => {
  const { skip, take, search, startDate, endDate } = req.query;

  let filter: any = {};

  try {
    if (search && search !== "") {
      filter = {
        ...filter,
        OR: [{ name: { contains: search } }],
      };
    }

    if (startDate && endDate) {
      const startDay = `${startDate.toString()}T00:00:00.000Z`;
      const endDay = `${endDate.toString()}T23:59:59.999Z`;

      filter = {
        ...filter,
        AND: [{ created_at: { gte: startDay, lte: endDay } }],
      };
    }

    const result = await prisma.product.findMany({
      orderBy: {
        created_at: "desc",
      },
      take: Number(take),
      skip: Number(skip),
      where: filter,
      include: {
        category: true,
      },
    });

    const total = await prisma.product.count({
      where: filter,
    });

    return res.status(200).json({
      message: "Berhasil fetch product data",
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
      errorMessage: error.message,
    });
  }
};

export const getProductForReport = async (req: Request, res: Response) => {
  try {
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
      }
    });

    const noCategoryProducts = allProducts
      .filter(
        (product) =>
          !product.category.name.includes("Roti Kecil") &&
          !product.category.name.includes("Roti Sedang") &&
          !product.category.name.includes("Roti Besar")
      )
      .sort((a, b) => a.category.name.localeCompare(b.category.name));
    const smallBreadProducts = allProducts
      .filter((product) => product.category.name.includes("Roti Kecil"))
      .sort((a, b) => a.category.name.localeCompare(b.category.name));
    const mediumBreadProducts = allProducts
      .filter((product) => product.category.name.includes("Roti Sedang"))
      .sort((a, b) => a.category.name.localeCompare(b.category.name));
    const largeBreadProducts = allProducts
      .filter((product) => product.category.name.includes("Roti Besar"))
      .sort((a, b) => a.category.name.localeCompare(b.category.name));

    const sortedProducts = [
      ...noCategoryProducts,
      ...smallBreadProducts,
      ...mediumBreadProducts,
      ...largeBreadProducts,
    ];

    return res.status(200).json({
      message: "Berhasil fetch data produk",
      data: sortedProducts,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
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
        category: true,
      },
    });
    return res.status(200).json({
      message: "Berhasil fetch produk",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const createNewProduct = async (req: Request, res: Response) => {
  const { name, picture, price, category, max_age } = req.body;

  try {

    const existingCategory = await prisma.category_product.findFirst({
      where: {
        name: category,
      },
    });
  
    if (!existingCategory) {
      return res.status(404).json({
        message: `Kategori ${category} tidak ditemukan`,
      });
    }
    
    const result = await prisma.product.create({
      data: {
        name,
        picture,
        price,
        category: {
          connect: {
            id: existingCategory.id,
          },
        },
        max_age,
      },
    });

    return res.status(201).json({
      message: "Berhasil membuat produk",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id, name, picture, price, category, max_age } = req.body;

  const existingProduct = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!existingProduct) {
    return res.status(404).json({
      message: "Produk tidak ditemukan",
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

  try {
    await prisma.product.update({
      where: {
        id: existingProduct.id,
      },
      data: {
        name,
        picture,
        price,
        category: {
          connect: {
            id: existingCategory.id,
          },
        },
        max_age,
      },
    });

    return res.status(200).json({
      message: "Berhasil edit produk",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.body;

  const existingProduct = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!existingProduct) {
    return res.status(404).json({
      message: "Produk tidak ditemukan",
    });
  }
  try {
    await prisma.product.delete({
      where: {
        id: existingProduct.id,
      },
    });

    return res.status(200).json({
      message: "Berhasil menghapus produk",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};
