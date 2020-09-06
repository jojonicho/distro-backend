import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  Int,
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { createAccessToken, createRefreshToken } from "../utils/auth";
import { getConnection } from "typeorm";
import { MyContext } from "./types/context";
import { User } from "../entity/User";
import { RegisterInput } from "../entity/types/Input";
import { sendRefreshToken } from "../utils/sendRefreshToken";
import { verify } from "jsonwebtoken";
// import { sendEmail } from "../utils/sendEmail";
// import { createConfirmationUrl } from "../utils/createConfirmationUrl";
// import { redis } from "../redis";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field()
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hello warudo!";
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    const auth = req.headers["authorization"];
    if (!auth) return null;

    try {
      const token = auth.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return User.findOne(payload!.userId);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async register(
    // @Arg('username', () => String) username: string
    // @Arg("email") email: string,
    // @Arg("username") username: string,
    // @Arg("password") password: string
    @Arg("input") { email, username, password }: RegisterInput
  ): Promise<boolean> {
    const hashedPassword = await hash(password, 12);
    try {
      const user = User.create({
        email,
        username,
        password: hashedPassword,
      });
      await user.save(); // important
      // await sendEmail(email, await createConfirmationUrl(user.id));
    } catch (err) {
      throw new Error(err);
    }
    return true;
  }

  // @Mutation(() => Boolean)
  // async confirmEmail(@Arg("token") token: string): Promise<boolean> {
  //   const userId = await redis.get(token);
  //   if (!userId) {
  //     return false;
  //   }
  //   await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
  //   await redis.del(token);
  //   return true;
  // }

  @Mutation(() => Boolean)
  async revokeRefreshTokenUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Invalid email");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("Invalid password");
    }

    //optional, cant really use redis with free heroku
    // if (!user.confirmed) {
    //   throw new Error("Please confirm your account");
    // }

    // login successful
    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }
  @Mutation(() => String)
  changeImage(@Ctx() { req }: MyContext, @Arg("image") image: string) {
    const auth = req.headers["authorization"];
    if (!auth) return null;

    try {
      const token = auth.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      User.update({ id: payload!.userId }, { image });
      return image;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext): Boolean {
    sendRefreshToken(res, "");
    return true;
  }
}
