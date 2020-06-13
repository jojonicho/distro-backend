import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import cors from "cors";
// import { ApolloServer, PubSub } from "apollo-server-express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
// import { buildSchema, PubSub } from "type-graphql";
// import { PubSub } from "apollo-server-express";
import { UserResolver } from "./resolver/UserResolver";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createRefreshToken, createAccessToken } from "./utils/auth";
import { sendRefreshToken } from "./utils/sendRefreshToken";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import { MessageResolver } from "./resolver/MessageResolver";
import { createServer } from "http";
// import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

(async () => {
  const PORT = 4000;
  // const REDIS_HOST = ""; // replace with own IP
  // const REDIS_PORT = 6379;
  // const options: Redis.RedisOptions = {
  //   host: REDIS_HOST,
  //   port: REDIS_PORT,
  //   retryStrategy: (times) => Math.max(times * 100, 3000),
  // };

  // const pubSub = new RedisPubSub({
  //   publisher: new Redis(options),
  //   subscriber: new Redis(options),
  // });

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

  // const pubSub = new PubSub();
  const pubsub = new RedisPubSub();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, MessageResolver],
      dateScalarMode: "isoDate", // "timestamp" or "isoDate"
      // validate: false,
      // pubSub,
    }),
    // validationRules : {

    // }
    subscriptions: {
      path: "/chat",
      onConnect: () => {
        console.log("yay");
      },
    },
    context: ({ req, res }) => ({ req, res, pubsub }),
  });

  server.applyMiddleware({ app, cors: false });
  const httpServer = createServer(app);
  // without this no subscriptions lol
  server.installSubscriptionHandlers(httpServer);
  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
    );
  });
  // app.listen(4000, () => {
  //   console.log(
  //     "express journey started on http://localhost:4000/graphql/ Keep going jon!"
  //   );
  // });
})();
