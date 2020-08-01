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
exports.RegisterInput = exports.ChannelMessageInput = exports.MessageInput = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
let MessageInput = class MessageInput {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("text", { nullable: false }),
    __metadata("design:type", String)
], MessageInput.prototype, "content", void 0);
MessageInput = __decorate([
    type_graphql_1.InputType()
], MessageInput);
exports.MessageInput = MessageInput;
let ChannelMessageInput = class ChannelMessageInput extends MessageInput {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.Column({ nullable: false, unique: true }),
    __metadata("design:type", Number)
], ChannelMessageInput.prototype, "channelId", void 0);
ChannelMessageInput = __decorate([
    type_graphql_1.InputType()
], ChannelMessageInput);
exports.ChannelMessageInput = ChannelMessageInput;
let RegisterInput = class RegisterInput {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("text", { nullable: false, unique: true }),
    class_validator_1.IsEmail({}, { message: "Invalid email" }),
    __metadata("design:type", String)
], RegisterInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("text", { nullable: false, unique: true }),
    class_validator_1.MinLength(6, {
        message: "Username is too short. Minimal length is $constraint1 characters, but actual is $value",
    }),
    class_validator_1.MaxLength(25, {
        message: "Username is too long. Maximal length is $constraint1 characters, but actual is $value",
    }),
    __metadata("design:type", String)
], RegisterInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.MinLength(8),
    typeorm_1.Column("text", { nullable: false }),
    __metadata("design:type", String)
], RegisterInput.prototype, "password", void 0);
RegisterInput = __decorate([
    type_graphql_1.InputType()
], RegisterInput);
exports.RegisterInput = RegisterInput;
//# sourceMappingURL=Input.js.map