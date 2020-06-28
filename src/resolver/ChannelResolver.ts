// import { Resolver, Subscription, Query, Ctx } from "type-graphql";
import {
  Resolver,
  // Ctx,
  Mutation,
  Arg,
  Subscription,
  Root,
  // PubSub,
  // Publisher,
  Query,
  Ctx,
} from "type-graphql";
// import { Message } from "../entity/Message";
// import { MyContext } from "./types/context";
import { User } from "../entity/User";
// import { MessageInput } from "../entity/types/Input";
// import { verify } from "jsonwebtoken";
import { Channel } from "../entity/Channel";
import { MyContext } from "./types/context";
import { verify } from "jsonwebtoken";
// import { subscribe } from "graphql";

Resolver();
export class ChannelResolver {
  @Subscription(() => User, { topics: "NEW_USER" })
  newUser(@Root() user: User): User {
    return user;
  }

  @Mutation(() => Boolean)
  async createChannel(
    @Ctx() { req }: MyContext,
    @Arg("name") channelName: string
  ) {
    const auth = req.headers["authorization"];
    if (!auth) return false;
    try {
      const token = auth.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      const user = await User.findOne(payload!.userId);
      const channel = Channel.create({
        name: channelName,
      });
      await channel.save();
      channel.users.push(user!);
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }

  @Query(() => [Channel])
  async channels() {
    const channels = await Channel.find();
    return channels;
  }

  // @Mutation(() => Boolean)
  // async sendMessage(
  //   @Arg("input") { content }: MessageInput,
  //   @PubSub("MESSAGES") publish: Publisher<Message>,
  //   @Ctx() { req }: MyContext
  // ): Promise<Boolean> {
  //   const date = new Date();
  //   const auth = req.headers["authorization"];
  //   if (!auth) return false;
  //   try {
  //     const token = auth.split(" ")[1];
  //     const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
  //     const user = await User.findOne(payload!.userId);
  //     const message = Message.create({
  //       user,
  //       content,
  //       date,
  //     });
  //     await message.save();
  //     await publish(message);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   return true;
  // }

  // @Mutation(() => Boolean)
  // async deleteMessage(@Arg("id", () => Int) id: number) {
  //   try {
  //     await Message.delete(id);
  //     return true;
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   return false;
  // }
}
