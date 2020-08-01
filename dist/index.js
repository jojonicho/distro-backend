"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const UserResolver_1 = require("./resolver/UserResolver");
const jsonwebtoken_1 = require("jsonwebtoken");
const User_1 = require("./entity/User");
const auth_1 = require("./utils/auth");
const sendRefreshToken_1 = require("./utils/sendRefreshToken");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const MessageResolver_1 = require("./resolver/MessageResolver");
const http_1 = require("http");
const ChannelResolver_1 = require("./resolver/ChannelResolver");
const PORT = process.env.PORT || 4000;
const app = express_1.default();
const databaseUrl = process.env.DATABASE_URL;
const URL = databaseUrl
    ? "https://distrobackend.herokuapp.com"
    : "http://localhost";
const FRONTEND_URL = databaseUrl
    ? "https://distro.vercel.app"
    : "http://localhost:3000";
app.use(cors_1.default({
    origin: FRONTEND_URL,
    credentials: true,
}));
app.use(cookie_parser_1.default());
app.get("/", (_req, res) => res.send("helllo"));
app.post("/refresh_token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jid;
    if (!token) {
        return res.send({ ok: false, accessToken: "" });
    }
    let payload = null;
    try {
        payload = jsonwebtoken_1.verify(token, process.env.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        console.log(err);
        return res.send({ ok: false, accessToken: "" });
    }
    try {
        const user = yield User_1.User.findOne({ id: payload.userId });
        if (!user) {
            return res.send({ ok: false, accessToken: "" });
        }
        if (user.tokenVersion !== payload.tokenVersion) {
            return res.send({ ok: false, accessToken: "" });
        }
        sendRefreshToken_1.sendRefreshToken(res, auth_1.createRefreshToken(user));
        return res.send({ ok: true, accessToken: auth_1.createAccessToken(user) });
    }
    catch (e) {
        console.log(e);
        return res.send({ ok: false, accessToken: "" });
    }
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    if (databaseUrl) {
        const typeOrmOptions = {
            type: "postgres",
            url: databaseUrl,
            synchronize: true,
            ssl: true,
            extra: {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
        };
        yield typeorm_1.createConnection(typeOrmOptions);
    }
    else {
        yield typeorm_1.createConnection();
    }
    const server = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [UserResolver_1.UserResolver, MessageResolver_1.MessageResolver, ChannelResolver_1.ChannelResolver],
            dateScalarMode: "isoDate",
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
    const httpServer = http_1.createServer(app);
    server.installSubscriptionHandlers(httpServer);
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at ${URL}:${PORT}${server.graphqlPath}`);
        console.log(`🚀 Subscriptions ready at ws://${URL}:${PORT}${server.subscriptionsPath}`);
    });
}))();
//# sourceMappingURL=index.js.map