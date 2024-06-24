import { Response, Request } from "express";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export const getAllUser = async (req: Request, res: Response) => {
  const { skip, take, search } = req.query;

  let filter: any = {};

  try {
    if (search && search !== "") {
      filter = {
        ...filter,
        OR: [{ name: { contains: search } }],
      };
    }

    const result = await prisma.user.findMany({
      orderBy: {
        created_at: "desc",
      },
      take: Number(take),
      skip: Number(skip),
      where: filter,
      include: {
        role: true,
      },
    });

    const totalUser = await prisma.user.count();

    return res.status(200).json({
      message: "Berhasil fetch user data",
      data: {
        result: result,
        metadata: {
          hasNextPage: Number(skip) + Number(take) < totalUser,
          totalPages: Math.ceil(totalUser / Number(take)),
          totalData: totalUser,
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

export const findUserByID = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      }
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "Id akun tidak ditemukan",
      });
    }

    const result = await prisma.user.findUnique({
      where: {
        id: existingUser.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile_picture: true,
        shift: true,
        role: true
      }
    });

    return res.status(200).json({
      message: "Berhasil fetch data user",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const editUserAccountByOwner = async (req: Request, res: Response) => {
  const { id, name, email, role, shift } = req.body;

  try {

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      }
    });
  
    if (!existingUser) {
      return res.status(404).json({
        message: "Akun tidak ditemukan",
      });
    }
  
    const exisitingRole = await prisma.user_role.findFirst({
      where: {
        name: role,
      },
    });
  
    if (!exisitingRole) {
      return res.status(400).json({
        message: "Role akun tidak valid",
      });
    }

    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      include: {
        role: {
          select: {
            id: true,
            name: true
          }
        }
      },
      data: {
        name,
        email,
        shift,
        role: {
          connect: {
            id: exisitingRole.id,
          },
        },
      },
    });

    return res.status(200).json({
      message: `Berhasil edit akun`,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const updateUserData = async (req:   Request, res: Response) => {
  const { name, email, profile_picture, password, confPassword } = req.body;
  try {

    const existingUserData = await prisma.user.findUnique({
      where: {
        email: email
      }
    });
    if(!existingUserData) {
      return res.status(404).json({
        message: "Email tidak ditemukan"
      })
    }

    const matchPassword = password === confPassword;

    if(!matchPassword) {
      return res.status(400).json({
        message: "Password dengan konfirmasi password tidak cocok"
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const user = await prisma.user.update({
      where: {
        id: existingUserData.id
      },
      data: {
        name,
        profile_picture,
        password: hashPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile_picture: true,
        shift: true,
        role: true
      }
    });

    return res.status(200).json({
      message: "Berhasil update data akun pribadi",
      data: user
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
}

export const deleteUserAccount = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });
  
    if (!existingUser) {
      return res.status(404).json({
        message: "Id akun tidak ditemukan / invalid",
      });
    }
    
    await prisma.user.delete({
      where: {
        id: existingUser.id,
      },
    });
    return res.status(200).json({
      message: `Berhasil hapus akun ${existingUser.name}`,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};
