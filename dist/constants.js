"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BACKEND_URL = exports.FRONTEND_URL = exports.COOKIE_NAME = exports.__prod__ = void 0;
exports.__prod__ = process.env.NODE_ENV === "production";
exports.COOKIE_NAME = "jid";
exports.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
exports.BACKEND_URL = process.env.BACKEND_URL || "http://localhost";
//# sourceMappingURL=constants.js.map