import { prisma } from "../../../lib/prisma";
import { Request, Response } from "express";

export const GetAllUser = async (req: Request, res: Response) => {
  try {
    const result = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Berhasil fetch user data",
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
