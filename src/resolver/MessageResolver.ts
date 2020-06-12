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
} from "type-graphql";
import { Message } from "../entity/Message";
import { MyContext } from "./types/context";
import { isAuth } from "../middleware/isAuth";
import { User } from "../entity/User";
import { MessageInput } from "../entity/types/Input";
// import { subscribe } from "graphql";

Resolver();
export class MessageResolver {
  @Subscription(() => Message, {
    topics: "MESSAGES",
    // subscribe: () => pubsub.asyncIterator('MESSAGES'),
    // subscribe: pubsub.asyncIterator("E")
  })
  newMessage(@Root() message: Message): Message {
    // subscribe
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
    @Ctx() { pubsub }: MyContext
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
      await pubsub.publish("MESSAGES", message);
    } catch (e) {
      console.log(e);
    }
    return true;
  }
}
