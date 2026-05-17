import { Response, NextFunction }
from "express";

import type { AuthRequest }
from "../types";

const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  if (
    req.user &&
    req.user.role === "admin"
  ) {

    next();

  } else {

    res.status(403).json({
      message:
      "Access denied. Admin only."
    });
  }
};

export default adminMiddleware;