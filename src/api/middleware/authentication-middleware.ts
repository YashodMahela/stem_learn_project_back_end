import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../../domain/errors/unauthorized-error";
import { getAuth } from "@clerk/express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  if (!auth || !auth.userId) {
    //! auth will only be defined if the request sends a valid session token
    throw new UnauthorizedError("Unauthorized");
  }

  //! By calling getAuth(req) we can get the auth data from the request
  //! userId can be obtained from the auth object

  next();
};

export default isAuthenticated;
