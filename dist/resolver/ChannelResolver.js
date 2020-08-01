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
exports.ChannelResolver = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entity/User");
const Channel_1 = require("../entity/Channel");
const jsonwebtoken_1 = require("jsonwebtoken");
type_graphql_1.Resolver();
class ChannelResolver {
    newUser(user) {
        return user;
    }
    createChannel({ req }, channelName) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = req.headers["authorization"];
            if (!auth)
                return false;
            try {
                const token = auth.split(" ")[1];
                const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
                const user = yield User_1.User.findOne(payload.userId);
                const channel = Channel_1.Channel.create({
                    name: channelName,
                });
                yield channel.save();
                channel.users = [user];
                yield channel.save();
            }
            catch (e) {
                console.log(e);
                return false;
            }
            return true;
        });
    }
    channels() {
        return __awaiter(this, void 0, void 0, function* () {
            const channels = yield Channel_1.Channel.find();
            return channels;
        });
    }
    channelUsers(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channel = yield Channel_1.Channel.findOne({
                    where: { id: channelId },
                    relations: ["users"],
                });
                return channel.users;
            }
            catch (e) {
                console.log(e);
            }
            return [];
        });
    }
}
__decorate([
    type_graphql_1.Subscription(() => User_1.User, { topics: "NEW_USER" }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", User_1.User)
], ChannelResolver.prototype, "newUser", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "createChannel", null);
__decorate([
    type_graphql_1.Query(() => [Channel_1.Channel]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "channels", null);
__decorate([
    type_graphql_1.Query(() => [User_1.User]),
    __param(0, type_graphql_1.Arg("channelId", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "channelUsers", null);
exports.ChannelResolver = ChannelResolver;
//# sourceMappingURL=ChannelResolver.js.map