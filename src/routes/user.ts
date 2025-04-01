import { Router, Request, Response, NextFunction } from "express";
import {
  createOrder,
  getAvailableGroceries,
  getOrderHistory,
} from "../controllers/UserController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Apply authentication middleware to all routes
router.use(async (req: Request, res: Response, next: NextFunction) => {
  await authenticate(req, res, next);
});

// Grocery browsing
router.get("/groceries", async (req: Request, res: Response) => {
  await getAvailableGroceries(req, res);
});

// Order management
router.post("/orders", async (req: Request, res: Response) => {
  await createOrder(req, res);
});

router.get("/orders", async (req: Request, res: Response) => {
  await getOrderHistory(req, res);
});

export default router;
