import { NextFunction, Request, Response } from "express";

export const allowCorsHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.APPLICATION_URL!);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
};
