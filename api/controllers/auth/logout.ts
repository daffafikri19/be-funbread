import { prisma } from "../../../lib/prisma";
import { Request, Response } from "express";

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

    return res.sendStatus(200);
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
