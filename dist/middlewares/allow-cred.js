"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowCorsHeaders = void 0;
const allowCorsHeaders = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.APPLICATION_URL);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
};
exports.allowCorsHeaders = allowCorsHeaders;
