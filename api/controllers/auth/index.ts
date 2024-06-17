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
      return res.status(400).json({
        message: "Email salah atau akun tidak ditemukan",
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
        shift: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Akun tidak ditemukan",
      });
    }

    const payload = {
      userid: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      profile_picture: user.profile_picture,
      shift: user.shift
    }
  
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN!, {
      expiresIn: 1000 * 60 * 60 * 24
    });

    return res.cookie("funBreadToken", accessToken, {
      httpOnly: false,
      secure: false, // change to true when to production
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24
    }).status(200).json({
      message: "Berhasil login",
      token: accessToken
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const Register = async (req: Request, res: Response) => {
  const { name, email, profile_picture, role, password, confPassword, shift } =
    req.body;

  try {

    const existingRole = await prisma.user_role.findFirst({
      where: {
        name: role,
      },
    });
  
    if (!existingRole) {
      return res.status(404).json({
        message: `Role ${role} tidak ditemukan`,
      });
    }
  
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
  
    const matchPassword = password === confPassword;
    if (!matchPassword) {
      return res.status(400).json({
        message: "Password dan konfirmasi password tidak cocok",
      });
    }
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    await prisma.user.create({
      data: {
        name,
        email,
        profile_picture,
        role: {
          connect: {
            id: existingRole.id,
          },
        },
        password: hashedPassword,
        shift,
      },
    });

    return res.status(201).json({
      message: `Berhasil membuat akun ${role}`,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const Logout = async (req: Request, res: Response) => {
  const { userid } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userid,
      },
    });

    if (!user) {
      return res.sendStatus(401);
    }
    
    return res.clearCookie('funBreadToken').status(200).json({
      message: 'Berhasil logout'
    })
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};
