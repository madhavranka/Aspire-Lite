import { Session } from "express-session";

declare module "express-session" {
  interface SessionData {
    // Add your custom properties here
    userId?: number;
    role?: string;
  }
}
