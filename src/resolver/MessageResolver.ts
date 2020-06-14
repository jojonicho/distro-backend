// import { Resolver, Subscription, Query, Ctx } from "type-graphql";
import {
  Resolver,
  Query,
  Ctx,
  UseMiddleware,
  Mutation,
  Arg,
  Subscription,
  Root,
  PubSub,
  Publisher,
} from "type-graphql";
import { Message } from "../entity/Message";
import { MyContext } from "./types/context";
import { isAuth } from "../middleware/isAuth";
import { User } from "../entity/User";
import { MessageInput } from "../entity/types/Input";
import { verify } from "jsonwebtoken";
// import { subscribe } from "graphql";

Resolver();
export class MessageResolver {
  @Subscription(() => Message, { topics: "MESSAGES" })
  newMessage(@Root() message: Message): Message {
    return message;
  }

  @Query(() => [Message])
  messages(@Ctx() { payload }: MyContext) {
    console.log(payload);
    return Message.find();
  }

  @Query(() => [Message])
  @UseMiddleware(isAuth)
  async message(@Ctx() { payload }: MyContext) {
    const user = await User.findOne(payload!.userId);
    const username = user?.username;
    const messages = await Message.find({ where: username });
    return messages;
  }

  @Mutation(() => Boolean)
  async sendMessage(
    @Arg("input") { content }: MessageInput,
    @PubSub("MESSAGES") publish: Publisher<Message>,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    const date = new Date().toISOString();
    const auth = req.headers["authorization"];
    if (!auth) return false;
    try {
      const token = auth.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      const user = await User.findOne(payload!.userId);
      const message = Message.create({
        user,
        content,
        date,
      });
      await message.save();
      await publish(message);
    } catch (err) {
      console.log(err);
    }
    return true;
  }
}
