import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface userData {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  phoneNumber: string | null;
  role: string | any;
}

interface VerifyTokenRequest extends Request {
  userData: userData;
}

export const VerifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const VerifyRequest = req as VerifyTokenRequest;
  const { authorization } = VerifyRequest.headers;

  if (!authorization) {
    return res.status(403).json({
      message: "Token autentikasi tidak ada",
      data: {},
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN!);
    VerifyRequest.userData = decodedToken as userData;
  } catch (error) {
    res.status(401).json({
      message: "Unauthorize",
      data: {},
    });
  }

  next();
};
