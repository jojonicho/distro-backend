import "reflect-metadata";
import { createConnection, ConnectionOptions } from "typeorm";
import express from "express";
import cors from "cors";
// import { ApolloServer, PubSub } from "apollo-server-express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolver/UserResolver";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createRefreshToken, createAccessToken } from "./utils/auth";
import { sendRefreshToken } from "./utils/sendRefreshToken";
import cookieParser from "cookie-parser";
// import session from "express-session";
// import connectRedis from "connect-redis";
// import { redis } from "./redis";

import { MessageResolver } from "./resolver/MessageResolver";
import { createServer } from "http";
import { ChannelResolver } from "./resolver/ChannelResolver";
// import { RedisPubSub } from "graphql-redis-subscriptions";

const PORT = process.env.PORT || 4000;
const databaseUrl = process.env.DATABASE_URL;

const URL = databaseUrl
  ? "https://distrobackend.herokuapp.com"
  : "http://localhost";

const FRONTEND_URL = databaseUrl
  ? "https://distro.vercel.app"
  : "http://localhost:3000";

(async () => {
  const app = express();
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(cookieParser());
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
    try {
      const user = await User.findOne({ id: payload.userId });
      if (!user) {
        return res.send({ ok: false, accessToken: "" });
      }
      if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ ok: false, accessToken: "" });
      }
      sendRefreshToken(res, createRefreshToken(user));
      return res.send({ ok: true, accessToken: createAccessToken(user) });
    } catch (e) {
      console.log(e);
      return res.send({ ok: false, accessToken: "" });
    }
  });
  // app.use(
  //   session({
  //     store: new RedisStore({
  //       client: redis,
  //     }),
  //     name: "qid",
  //     secret: "asdasdaakoasdk",
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       maxAge: 100 * 60 * 60 * 24 * 7 * 365, // 7 years
  //     },
  //   })
  // );

  if (databaseUrl) {
    const typeOrmOptions: ConnectionOptions = {
      type: "postgres",
      url: databaseUrl,
      synchronize: true,
      entities: ["src/entity/*.ts"],
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };
    await createConnection(typeOrmOptions);
  } else {
    await createConnection();
  }
  // const pubSub = new PubSub();
  // const pubsub = new RedisPubSub();
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, MessageResolver, ChannelResolver],
      dateScalarMode: "isoDate", // "timestamp" or "isoDate"
    }),
    subscriptions: {
      path: "/subscriptions",
      onConnect: () => {
        console.log("yay");
      },
    },
    context: ({ req, res }) => ({ req, res }),
  });
  server.applyMiddleware({ app, cors: false });
  const httpServer = createServer(app);
  // without this no subscriptions lol
  server.installSubscriptionHandlers(httpServer);
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at ${URL}:${PORT}${server.graphqlPath}`);
    console.log(
      `🚀 Subscriptions ready at ws://${URL}:${PORT}${server.subscriptionsPath}`
    );
  });
})();
