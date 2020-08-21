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
exports.Message = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./User");
const Channel_1 = require("./Channel");
let Message = class Message extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Message.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Message.prototype, "date", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("text", { nullable: false }),
    __metadata("design:type", String)
], Message.prototype, "content", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User),
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.messages),
    __metadata("design:type", User_1.User)
], Message.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => Channel_1.Channel, { defaultValue: -1 }),
    typeorm_1.ManyToOne(() => Channel_1.Channel, (channel) => channel.messages),
    __metadata("design:type", Channel_1.Channel)
], Message.prototype, "channel", void 0);
Message = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity("messages")
], Message);
exports.Message = Message;
//# sourceMappingURL=Message.js.map