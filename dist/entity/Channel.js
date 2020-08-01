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
exports.Channel = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./User");
const Message_1 = require("./Message");
let Channel = class Channel extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Channel.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("text", { nullable: false }),
    __metadata("design:type", String)
], Channel.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToMany(() => User_1.User, (user) => user.channels),
    type_graphql_1.Field(() => [User_1.User]),
    __metadata("design:type", Array)
], Channel.prototype, "users", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("text", { default: "https://i.imgur.com/7lIcAP5.gif" }),
    __metadata("design:type", String)
], Channel.prototype, "image", void 0);
__decorate([
    typeorm_1.OneToMany(() => Message_1.Message, (message) => message.channel, { lazy: true }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Channel.prototype, "messages", void 0);
Channel = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity("channels")
], Channel);
exports.Channel = Channel;
//# sourceMappingURL=Channel.js.map