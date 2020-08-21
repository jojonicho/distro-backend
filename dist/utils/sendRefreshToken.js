"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = void 0;
exports.sendRefreshToken = (res, token) => {
    res.cookie("jid", token, {
        httpOnly: true,
        secure: false,
        path: "/refresh_token",
    });
};
//# sourceMappingURL=sendRefreshToken.js.map