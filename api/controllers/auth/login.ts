import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";

export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existingAccount = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingAccount) {
      return res.status(404).json({
        message: "Akun dengan email ini tidak ditemukan",
      });
    }

    const matchPassword = await bcrypt.compare(
      password,
      existingAccount.password
    );

    if (!matchPassword) {
      return res.status(400).json({
        message: "Password salah",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: existingAccount.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile_picture: true,
        shift: true
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Akun dengan email ini tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: "Berhasil login",
      data: user
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
