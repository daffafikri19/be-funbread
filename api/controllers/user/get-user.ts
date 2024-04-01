import { prisma } from "../../../lib/prisma";
import { Request, Response } from "express";

export const GetAllUser = async (req: Request, res: Response) => {
  try {
    const refresh_token = req.cookies.refreshToken;
    if (!refresh_token) {
      return res.status(401).json({
        message: "Unauthorize",
        data: {
          errorMessage: "Refresh token not found",
        },
      });
    }

    const result = await prisma.user.findMany({
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        jobdesk: true,
        profile_picture: true,
        role: true,
        refresh_token: true
      }
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
