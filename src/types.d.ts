import type { Role } from "./middlewares/auth";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
      validated?: any;
      requestId?: string;
    }
  }
}

export {};
