import { Router, Request, Response } from "express";
import { login, register } from "../controllers/AuthController";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  await register(req, res);
});

router.post("/login", async (req: Request, res: Response) => {
  await login(req, res);
});

export default router;
