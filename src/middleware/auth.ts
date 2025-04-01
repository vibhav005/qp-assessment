import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "Authentication required" });
      return; // Just return, don't return the response object
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as TokenPayload;

      req.user = {
        id: decodedToken.id,
        role: decodedToken.role,
      };

      next();
    } catch (jwtError) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (req.user.role !== "admin") {
      res.status(403).json({ message: "Admin privileges required" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    return;
  }
};
