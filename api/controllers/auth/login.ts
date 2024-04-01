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

    if (!user) {
      return res.status(404).json({
        message: "Akun dengan email ini tidak ditemukan",
        data: {},
      });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      jobdesk: user.jobdesk,
      phone_number: user.phone_number,
      profile_picture: user.profile_picture,
    };

    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "20s", // 60 * 60 * 1 Access token kedaluwarsa dalam 1 jam
    });

    const refresh_token = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: '1d', // Refresh token kedaluwarsa dalam 1 hari
      }
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refresh_token: refresh_token,
      },
    });

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 jam
      secure: false
    });

    return res.status(200).json({
      message: "Berhasil login",
      data: {
        token: access_token
      }
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
