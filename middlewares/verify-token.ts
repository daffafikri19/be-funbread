import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface userData {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  phoneNumber: string | null;
  role: string | any;
  jobdesk: string;
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
      message: "Akses dilarang",
      data: {},
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    VerifyRequest.userData = decodedToken as userData;
  } catch (error : any) {
    return res.status(401).json({
      message: "Unauthorize",
      data: {
        errorMessage: "Token already expired",
        expiredAt: error.expiredAt
       },
    });
  }
  
  next();
};
