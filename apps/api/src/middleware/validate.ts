import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type RequestField = "body" | "query" | "params";

export function validate(schema: ZodSchema, field: RequestField = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req[field] = schema.parse(req[field]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details: Record<string, string[]> = {};
        for (const issue of err.issues) {
          const path = issue.path.join(".");
          if (!details[path]) details[path] = [];
          details[path].push(issue.message);
        }
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            details,
          },
        });
      }
      next(err);
    }
  };
}
