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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendEmail(email, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const account = yield nodemailer_1.default.createTestAccount();
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: account.user,
                pass: account.pass,
            },
        });
        const mailOptions = {
            from: "Jonathan Nicholas <jojonicho181@gmail.com>",
            to: email,
            subject: "Nodemailer!",
            text: "This is nodemailer",
            html: `Click to confirm <a href="${url}">${url}</a>`,
        };
        const info = yield transporter.sendMail(mailOptions);
        console.log("Message sent %s", info.messageId);
        console.log("preview url: %s", nodemailer_1.default.getTestMessageUrl(info));
    });
}
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map