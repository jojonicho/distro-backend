import {
  Resolver,
  Mutation,
  Arg,
  Subscription,
  Root,
  Query,
  Ctx,
} from "type-graphql";
import { User } from "../entity/User";
import { Channel } from "../entity/Channel";
import { MyContext } from "./types/context";
import { verify } from "jsonwebtoken";

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
}
