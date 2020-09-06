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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const Message_1 = require("./Message");
const Channel_1 = require("./Channel");
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("text", { nullable: false, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("text", { nullable: false, unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column("bool", { default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "confirmed", void 0);
__decorate([
    typeorm_1.Column("int", { default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "tokenVersion", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("text", { default: "https://i.imgur.com/7lIcAP5.gif" }),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
__decorate([
    type_graphql_1.Field(() => [Message_1.Message], { nullable: true }),
    typeorm_1.OneToMany(() => Message_1.Message, (message) => message.user),
    __metadata("design:type", Array)
], User.prototype, "messages", void 0);
__decorate([
    typeorm_1.JoinTable(),
    type_graphql_1.Field(() => [Channel_1.Channel], { nullable: true }),
    typeorm_1.ManyToMany(() => Channel_1.Channel, (channel) => channel.users),
    __metadata("design:type", Array)
], User.prototype, "channels", void 0);
User = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity("users")
], User);
exports.User = User;
//# sourceMappingURL=User.js.map