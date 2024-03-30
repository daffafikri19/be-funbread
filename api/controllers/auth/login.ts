import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        data: {},
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
        jobdesk: true,
        phone_number: true,
        profile_picture: true,
      },
    });

    const payload = {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
      jobdesk: user?.jobdesk,
      phone_number: user?.phone_number,
      profile_picture: user?.profile_picture,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN!, {
      expiresIn: 60 * 60 * 1,
    });

    return res.status(200).json({
      message: "Login berhasil",
      data: token,
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
