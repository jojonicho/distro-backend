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
  Int,
} from "type-graphql";
import { Message } from "../entity/Message";
import { MyContext } from "./types/context";
import { isAuth } from "../middleware/isAuth";
import { User } from "../entity/User";
import { MessageInput, ChannelMessageInput } from "../entity/types/Input";
import { verify } from "jsonwebtoken";
import { Channel } from "../entity/Channel";
// import { Channel } from "../entity/Channel";
// import { subscribe } from "graphql";

Resolver();
export class MessageResolver {
  @Subscription(() => Message, { topics: "MESSAGES" })
  newMessage(@Root() message: Message): Message {
    return message;
  }

  @Query(() => [Message])
  async messages() {
    const messages = await Message.find();
    return messages;
  }

  @Query(() => [Message])
  // @UseMiddleware(isAuth)
  async channelMessages(@Arg("channelId", () => Int) channelId: number) {
    // const messages = await Message.find({ where: { channelId } });
    const channel = await Channel.findOne(channelId);
    const messages = await Message.find({ where: { channel } });
    return messages;
  }

  // @Query(() => [Message])
  // @UseMiddleware(isAuth)
  // async message(@Ctx() { payload }: MyContext) {
  //   const user = await User.findOne(payload!.userId);
  //   const username = user!.username;
  //   const messages = await Message.find({ where: username });
  //   return messages;
  // }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async sendMessage(
    @Arg("input") { content }: MessageInput,
    @PubSub("MESSAGES") publish: Publisher<Message>,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    const date = new Date();
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async sendChannelMessage(
    @Arg("input") { content, channelId }: ChannelMessageInput,
    @PubSub("MESSAGES") publish: Publisher<Message>,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    const date = new Date();
    const auth = req.headers["authorization"];
    if (!auth) return false;
    try {
      const token = auth.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      const user = await User.findOne(payload!.userId);
      const channel = await Channel.findOne(channelId);
      const message = Message.create({
        user,
        content,
        date,
        channel,
      });
      await message.save();
      await publish(message);
    } catch (err) {
      console.log(err);
    }
    return true;
  }

  @Mutation(() => Boolean)
  async deleteMessage(@Arg("id", () => Int) id: number) {
    try {
      await Message.delete(id);
      return true;
    } catch (e) {
      console.log(e);
    }
    return false;
  }
}
