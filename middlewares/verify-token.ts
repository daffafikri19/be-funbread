import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_picture: string | null;
  shift: string;
}

interface customRequest extends Request {
  userdata: UserPayload;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customReq = req as customRequest;
  const accessToken = customReq.headers.authorization?.split(" ")[1];

  console.log("ACCESS TOKEN", accessToken);

  if (!accessToken) {
    return res.status(403).json({
      message: "akses token tidak ditemukan",
    });
  }

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN!,
    async (err : any, decoded : any) => {
      if (err) {
        return res.status(401).json({
          message: "Token tidak valid",
        });
      }
      customReq.userdata = decoded as any;
      console.log("decoded payload", customReq.userdata)
      next();
    }
  );
};

export const ownerOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customReq = req as customRequest;
  const refreshtoken = customReq.headers.authorization?.split(" ")[1];
  const accesstoken = customReq.cookies.funBreadToken;

  if (!refreshtoken) {
    return res.status(403).json({
      message: "Token tidak ditemukan",
    });
  }

  if (!accesstoken) {
    return res.status(403).json({
      message: "Unauthorize",
    });
  }

  jwt.verify(
    refreshtoken,
    process.env.REFRESH_TOKEN!,
    async (err: any, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Token tidak valid",
        });
      }

      customReq.userdata = decoded as any;
      if(customReq.userdata.role.includes("owner")) {
          next();
      } else {
          return res.status(403).json({
              message: "API dan Akses ditolak"
          })
      }
    }
  );
};
