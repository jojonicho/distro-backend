import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { MyContext } from "../resolver/types/context";

// bearer 2312312420oadks
export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorize = context.req.headers["authorization"];
  if (!authorize) {
    throw new Error("unauthorized access");
  }
  try {
    const token = authorize.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new Error("unauthorized access");
  }
  return next();
};
