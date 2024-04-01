import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refresh_token = req.cookies.refreshToken;

    const user = await prisma.user.findFirst({
      where: {
        refresh_token: refresh_token,
      },
    });

    if (!user) {
      return res.status(403).json({
        message: "Forbidden",
        data: {
          errorMessage: "Refresh token not valid",
        },
      });
    }

    jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET!,
      (err: any, decoded: any) => {
        if (err) {
          return res.status(401).json({
            message: "Unauthorize",
            data: {
              errorMessage: "Refresh token not valid",
              error: err,
            },
          });
        }

        const id = user.id;
        const name = user.name;
        const email = user.email;
        const profile_picture = user.profile_picture;
        const phone_number = user.phone_number;
        const role = user.role;
        const jobdesk = user.jobdesk;

        const accessToken = jwt.sign(
          { id, name, email, profile_picture, phone_number, role, jobdesk },
          process.env.ACCESS_TOKEN_SECRET!,
          {
            expiresIn: "20s",
          }
        );

        return res.status(200).json({
          message: "Token refreshed",
          data: {
            token: accessToken,
          },
        });
      }
    );
  } catch (error: any) {
    return res.status(500).json({
      message: "Terjadi kesalahan server",
      data: {
        errorMessage: error.message,
        error: error,
      },
    });
  }
};
