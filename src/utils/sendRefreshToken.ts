import { Response } from "express";

// export const sendRefreshToken = (res: Response, token: string) => {
//   res.cookie("jid", token, {
//     path: "/refresh_token",
//     httpOnly: true,
//     secure: false,
//   });
// };

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("jid", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/refresh_token",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};
