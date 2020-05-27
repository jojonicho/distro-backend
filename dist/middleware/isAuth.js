"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
exports.isAuth = ({ context }, next) => {
    const authorize = context.req.headers["authorization"];
    if (!authorize) {
        throw new Error("unauthorized access");
    }
    try {
        const token = authorize === null || authorize === void 0 ? void 0 : authorize.split(" ")[1];
        const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
        context.payload = payload;
    }
    catch (err) {
        console.log(err);
        throw new Error("unauthorized access");
    }
    return next();
};
//# sourceMappingURL=isAuth.js.map