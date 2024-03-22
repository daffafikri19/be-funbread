import { prisma } from "../../../lib/prisma";
import { Request, Response } from "express";

export const FindUserById = async (req: Request, res: Response) => {
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
        data: {},
      });
    }

    const result = await prisma.user.findUnique({
      where: {
        id: existingAccount.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        profilePicture: true,
      },
    });

    return res.status(200).json({
      message: "Akun ditemukan",
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

export const FindUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const existingAccount = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingAccount) {
      return res.status(404).json({
        message: "Akun dengan email ini tidak ditemukan",
        data: {},
      });
    }

    const result = await prisma.user.findUnique({
      where: {
        email: existingAccount.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        profilePicture: true,
      },
    });

    return res.status(200).json({
      message: "Akun ditemukan",
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

export const FindUserByName = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const existingAccount = await prisma.user.findUnique({
      where: {
        name,
      },
    });

    if (!existingAccount) {
      return res.status(404).json({
        message: "Akun dengan username ini tidak ditemukan",
        data: {},
      });
    }

    const result = await prisma.user.findUnique({
      where: {
        name: existingAccount.name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        profilePicture: true,
      },
    });

    return res.status(200).json({
      message: "Akun ditemukan",
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
