import { Request, Response } from "express";
// import { PubSub } from "apollo-server-express";

export interface MyContext {
  req: Request;
  res: Response;
  pubsub: any;
  payload?: { userId: string };
}
