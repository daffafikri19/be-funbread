import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";

export const Register = async (req: Request, res: Response) => {
  const { name, email, profilePicture, phoneNumber, role, password } = req.body;

  try {
    const existingName = await prisma.user.findUnique({
      where: {
        name: name,
      },
    });

    if (existingName) {
      return res.status(400).json({
        message: "Nama ini sudah digunakan di akun lain",
        data: {},
      });
    }

    const existingEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email ini sudah digunakan di akun lain",
        data: {},
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const result = await prisma.user.create({
      data: {
        name,
        email,
        profilePicture,
        phoneNumber,
        role,
        password: hashPassword,
      },
    });

    return res.status(201).json({
      message: `Berhasil membuat akun ${role}`,
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
