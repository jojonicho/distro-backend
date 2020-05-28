import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolver/UserResolver";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createRefreshToken, createAccessToken } from "./utils/auth";
import { sendRefreshToken } from "./utils/sendRefreshToken";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";

(async () => {
  const app = express();
  const RedisStore = connectRedis(session);
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: "qid",
      secret: "asdasdaakoasdk",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 100 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );
  app.get("/", (_req, res) => res.send("helllo"));
  app.post("/refresh_token", async (req, res) => {
    // refresh token
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    // valid response
    const user = await User.findOne({ id: payload.userId });
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }
    sendRefreshToken(res, createRefreshToken(user));
    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log(
      "express journey started on http://localhost:4000/graphql/ Keep going jon!"
    );
  });
})();
