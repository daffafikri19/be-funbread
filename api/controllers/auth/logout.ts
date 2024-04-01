import { prisma } from "../../../lib/prisma";
import { Request, Response } from "express";

export const Logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) {
    return res.sendStatus(204)
  }

  const user = await prisma.user.findFirst({
    where: {
      refresh_token: refreshToken
    }
  });

  if(!user) {
    return res.sendStatus(401)
  }

  const userId = user.id;
  
  try {
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        refresh_token: null
      },
    })

    res.clearCookie('refreshToken');
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
