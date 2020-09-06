"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Message_1 = require("../entity/Message");
const isAuth_1 = require("../middleware/isAuth");
const User_1 = require("../entity/User");
const Input_1 = require("../entity/types/Input");
const jsonwebtoken_1 = require("jsonwebtoken");
const Channel_1 = require("../entity/Channel");
const typeorm_1 = require("typeorm");
let PaginatedMessages = class PaginatedMessages {
};
__decorate([
    type_graphql_1.Field(() => [Message_1.Message]),
    __metadata("design:type", Array)
], PaginatedMessages.prototype, "messages", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], PaginatedMessages.prototype, "hasMore", void 0);
PaginatedMessages = __decorate([
    type_graphql_1.ObjectType()
], PaginatedMessages);
type_graphql_1.Resolver(Message_1.Message);
class MessageResolver {
    newMessage(message) {
        return message;
    }
    messages(limit, cursor, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const realLimit = Math.min(25, limit);
            const realLimitPlusOne = realLimit + 1;
            const msg = typeorm_1.getConnection().getRepository(Message_1.Message).createQueryBuilder("m");
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
            const messages = yield qb.getMany();
            return {
                messages: messages.slice(0, realLimit),
                hasMore: messages.length === realLimitPlusOne,
            };
        });
    }
    channelMessages(channelId, limit, cursor) {
        return __awaiter(this, void 0, void 0, function* () {
            const realLimit = Math.min(25, limit);
            const realLimitPlusOne = realLimit + 1;
            const qb = typeorm_1.getConnection()
                .getRepository(Message_1.Message)
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
            const messages = yield qb.getMany();
            return {
                messages: messages.slice(0, realLimit),
                hasMore: messages.length === realLimitPlusOne,
            };
        });
    }
    sendMessage({ content, channelId }, publish, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            const auth = req.headers["authorization"];
            if (!auth)
                return false;
            try {
                const token = auth.split(" ")[1];
                const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
                const user = yield User_1.User.findOne(payload.userId);
                const channel = yield Channel_1.Channel.findOne(channelId);
                const message = Message_1.Message.create({
                    user,
                    content,
                    date,
                    channel,
                });
                yield message.save();
                yield publish(message);
            }
            catch (err) {
                console.log(err);
            }
            return true;
        });
    }
    deleteMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Message_1.Message.delete(id);
                return true;
            }
            catch (e) {
                console.log(e);
            }
            return false;
        });
    }
}
__decorate([
    type_graphql_1.Subscription(() => Message_1.Message, { topics: "MESSAGES" }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Message_1.Message]),
    __metadata("design:returntype", Message_1.Message)
], MessageResolver.prototype, "newMessage", null);
__decorate([
    type_graphql_1.Query(() => PaginatedMessages),
    __param(0, type_graphql_1.Arg("limit", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("cursor", () => String, { nullable: true })),
    __param(2, type_graphql_1.Arg("channelId", () => type_graphql_1.Int, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "messages", null);
__decorate([
    type_graphql_1.Query(() => PaginatedMessages),
    __param(0, type_graphql_1.Arg("channelId", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("limit", () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Arg("cursor", () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "channelMessages", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.PubSub("MESSAGES")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Input_1.MessageInput, Function, Object]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "sendMessage", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "deleteMessage", null);
exports.MessageResolver = MessageResolver;
//# sourceMappingURL=MessageResolver.js.map