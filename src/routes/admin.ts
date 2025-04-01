import { Router, Request, Response, NextFunction } from "express";
import {
  addGroceryItem,
  deleteGroceryItem,
  getAllGroceryItems,
  updateGroceryItem,
  updateInventory,
} from "../controllers/AdminController";
import { authenticate, isAdmin } from "../middleware/auth";

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(authenticate);
router.use(isAdmin);

// Grocery management
router.post("/groceries", authenticate, isAdmin, addGroceryItem);

router.get("/groceries", authenticate, isAdmin, getAllGroceryItems);

router.put("/groceries/:id", async (req: Request, res: Response) => {
  await updateGroceryItem(req, res);
});

router.delete("/groceries/:id", async (req: Request, res: Response) => {
  await deleteGroceryItem(req, res);
});

// Inventory management
router.put("/inventory/:id", async (req: Request, res: Response) => {
  await updateInventory(req, res);
});

export default router;
