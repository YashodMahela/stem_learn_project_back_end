import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../../domain/errors/unauthorized-error";
import { getAuth } from "@clerk/express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  if (!auth || !auth.userId) {
    //! auth will only be defined if the request sends a valid session token
    throw new UnauthorizedError("Unauthorized");
  }
  next();
};

export default isAuthenticated;
