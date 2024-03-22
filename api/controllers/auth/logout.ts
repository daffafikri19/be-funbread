import { prisma } from "../../../lib/prisma";
import { Request, Response } from "express";

export const Logout = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const existingAccount = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingAccount) {
      return res.status(404).json({
        message: "Akun tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: "Berhasil Logout",
      data: {},
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
