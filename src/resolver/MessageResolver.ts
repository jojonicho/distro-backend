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
    @Arg("input") { username, content }: MessageInput,
    @PubSub("MESSAGES") publish: Publisher<Message>
  ): Promise<Boolean> {
    const date = new Date().toISOString();
    console.log(date);
    try {
      const message = Message.create({
        username,
        content,
        date,
      });
      await message.save();
      await publish(message);
    } catch (e) {
      console.log(e);
    }
    return true;
  }
}
