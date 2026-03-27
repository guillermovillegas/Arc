import { Router, Request, Response, NextFunction } from "express";
import { validate } from "../middleware/validate";
import { authLimiter } from "../middleware/rate-limit";
import { registerSchema, loginSchema, refreshTokenSchema } from "@arc/shared";
import * as authService from "../services/auth.service";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/refresh",
  validate(refreshTokenSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.refreshAccessToken(req.body.refreshToken);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
);

router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) await authService.logout(refreshToken);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
