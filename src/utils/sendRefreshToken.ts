import { Response } from "express";
import { __prod__, COOKIE_NAME } from "../constants";

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: __prod__ ? "none" : "lax",
    secure: __prod__,
    path: "/refresh_token",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};
