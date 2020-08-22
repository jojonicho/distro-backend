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
    path: "/refresh_token",
    httpOnly: true,
  });
};
