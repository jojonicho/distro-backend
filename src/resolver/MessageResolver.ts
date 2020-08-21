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
  ObjectType,
  Field,
} from "type-graphql";
import { Message } from "../entity/Message";
import { MyContext } from "./types/context";
import { isAuth } from "../middleware/isAuth";
import { User } from "../entity/User";
import { MessageInput, ChannelMessageInput } from "../entity/types/Input";
import { verify } from "jsonwebtoken";
import { Channel } from "../entity/Channel";
import { getConnection } from "typeorm";

@ObjectType()
class PaginatedMessages {
  @Field(() => [Message])
  messages: Message[];
  @Field()
  hasMore: Boolean;
}

Resolver(Message);
export class MessageResolver {
  @Subscription(() => Message, { topics: "MESSAGES" })
  newMessage(@Root() message: Message): Message {
    return message;
  }

  @Query(() => PaginatedMessages)
  async messages(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Arg("channelId", () => Int, { nullable: true }) channelId: string | null
  ): Promise<PaginatedMessages> {
    const realLimit = Math.min(25, limit);
    const realLimitPlusOne = realLimit + 1;

    const msg = getConnection().getRepository(Message).createQueryBuilder("m");

    if (channelId) {
      msg.innerJoinAndSelect("m.channel", "c", "c.id = :channelId", {
        channelId,
      });
    }

    const qb = msg
      .innerJoinAndSelect("m.user", "u", "u.id = m.user.id")
      .orderBy("m.date", "DESC")
      .take(realLimitPlusOne);

    if (cursor) {
      qb.where("m.date < :cursor", {
        cursor: new Date(parseInt(cursor)),
      });
    }

    const messages = await qb.getMany();

    return {
      messages: messages.slice(0, realLimit),
      hasMore: messages.length === realLimitPlusOne,
    };
  }

  @Query(() => PaginatedMessages)
  async channelMessages(
    @Arg("channelId", () => Int) channelId: number,
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedMessages> {
    const realLimit = Math.min(25, limit);
    const realLimitPlusOne = realLimit + 1;

    const qb = getConnection()
      .getRepository(Message)
      .createQueryBuilder("m")
      .where("m.channel = :id", { id: channelId })
      .innerJoinAndSelect("m.user", "u", "u.id = m.user.id")
      .orderBy("m.date", "DESC")
      .take(realLimitPlusOne);

    if (cursor) {
      qb.where("m.date < :cursor", {
        cursor: new Date(parseInt(cursor)),
      });
    }

    const messages = await qb.getMany();

    return {
      messages: messages.slice(0, realLimit),
      hasMore: messages.length === realLimitPlusOne,
    };
  }

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
