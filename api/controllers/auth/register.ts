import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";

export const Register = async (req: Request, res: Response) => {
  const { name, email, profile_picture, role, password, confPassword, shift } =
    req.body;

  const existingEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingEmail) {
    return res.status(400).json({
      message: "Email sudah digunakan diakun lain",
    });
  }

  const existingName = await prisma.user.findUnique({
    where: {
      name,
    },
  });

  if (existingName) {
    return res.status(400).json({
      message: "Nama sudah digunakan diakun lain",
    });
  }

  const existingRole = await prisma.user_role.findFirst({
    where: {
      name: role
    }
  });

  if(!existingRole) {
    return res.status(404).json({
      message: `Role ${role} tidak ditemukan`,
    })
  }

  const matchPassword = password === confPassword;
  if(!matchPassword) {
    return res.status(400).json({
      message: "Password dan konfirmasi password tidak cocok"
    })
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  try {
    const result = await prisma.user.create({
      data: {
        name,
        email,
        profile_picture,
        role: {
          connect: {
            id: existingRole.id
          }
        },
        password: hashedPassword,
        shift
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
