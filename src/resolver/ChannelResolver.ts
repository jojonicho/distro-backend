import {
  Resolver,
  Mutation,
  Arg,
  Subscription,
  Root,
  Query,
  Ctx,
  Int,
} from "type-graphql";
import { User } from "../entity/User";
import { Channel } from "../entity/Channel";
import { MyContext } from "./types/context";
import { verify } from "jsonwebtoken";
import { getConnection } from "typeorm";

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
      const { userId } = payload;
      const channel = await Channel.create({
        name: channelName,
      }).save();
      await getConnection()
        .createQueryBuilder()
        .relation(User, "channels")
        .of(userId)
        .add(channel.id);
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }

  @Query(() => [Channel])
  async channels(@Ctx() { req }: MyContext) {
    const auth = req.headers["authorization"];
    if (!auth) return false;
    const token = auth.split(" ")[1];
    const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    const { userId } = payload;
    // const channels = await Channel.find({ where: { users: userId } });
    const channels = await getConnection()
      .createQueryBuilder()
      .relation(User, "channels")
      .of(userId)
      .loadMany();
    return channels;
  }

  @Query(() => [User])
  async channelUsers(@Arg("channelId", () => Int) channelId: number) {
    try {
      // const channel = await Channel.findOne(channelId);
      const channel = await Channel.findOne({
        where: { id: channelId },
        relations: ["users"],
      });
      console.log(channel!);
      // const users = await User.find({ where: { id: In(usersIds!) } });
      return channel!.users;
    } catch (e) {
      console.log(e);
    }
    return [];
  }
}
