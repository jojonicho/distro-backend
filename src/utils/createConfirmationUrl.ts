import { v4 } from "uuid";
import { redis } from "../redis";

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  await redis.set(token, userId, "ex", 60 * 60 * 24);
  console.log(token);
  console.log(userId);
  return `http://localhost:3000/user/confirm/${token}`;
};
