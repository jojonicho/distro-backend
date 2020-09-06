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
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const bcryptjs_1 = require("bcryptjs");
const auth_1 = require("../utils/auth");
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
const Input_1 = require("../entity/types/Input");
const sendRefreshToken_1 = require("../utils/sendRefreshToken");
const jsonwebtoken_1 = require("jsonwebtoken");
let LoginResponse = class LoginResponse {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], LoginResponse.prototype, "accessToken", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", User_1.User)
], LoginResponse.prototype, "user", void 0);
LoginResponse = __decorate([
    type_graphql_1.ObjectType()
], LoginResponse);
let UserResolver = class UserResolver {
    hello() {
        return "hello warudo!";
    }
    me({ req }) {
        const auth = req.headers["authorization"];
        if (!auth)
            return null;
        try {
            const token = auth.split(" ")[1];
            const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
            return User_1.User.findOne(payload.userId);
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
    users() {
        return User_1.User.find();
    }
    register({ email, username, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcryptjs_1.hash(password, 12);
            try {
                const user = User_1.User.create({
                    email,
                    username,
                    password: hashedPassword,
                });
                yield user.save();
            }
            catch (err) {
                throw new Error(err);
            }
            return true;
        });
    }
    revokeRefreshTokenUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection()
                .getRepository(User_1.User)
                .increment({ id: userId }, "tokenVersion", 1);
            return true;
        });
    }
    login(email, password, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { email } });
            if (!user) {
                throw new Error("Invalid email");
            }
            const valid = yield bcryptjs_1.compare(password, user.password);
            if (!valid) {
                throw new Error("Invalid password");
            }
            sendRefreshToken_1.sendRefreshToken(res, auth_1.createRefreshToken(user));
            return {
                accessToken: auth_1.createAccessToken(user),
                user,
            };
        });
    }
    changeImage({ req }, image) {
        const auth = req.headers["authorization"];
        if (!auth)
            return false;
        const token = auth.split(" ")[1];
        const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const { userId } = payload.userId;
        User_1.User.update({ id: userId }, { image });
        return image;
    }
    logout({ res }) {
        sendRefreshToken_1.sendRefreshToken(res, "");
        return true;
    }
};
__decorate([
    type_graphql_1.Query(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "hello", null);
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Query(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "users", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Input_1.RegisterInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("userId", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "revokeRefreshTokenUser", null);
__decorate([
    type_graphql_1.Mutation(() => LoginResponse),
    __param(0, type_graphql_1.Arg("email")),
    __param(1, type_graphql_1.Arg("password")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg("image")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "changeImage", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Boolean)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map