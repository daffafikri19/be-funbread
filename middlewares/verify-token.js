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
exports.ownerOnly = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const customReq = req;
    const accessToken = (_a = customReq.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    console.log("ACCESS TOKEN", accessToken);
    if (!accessToken) {
        return res.status(403).json({
            message: "akses token tidak ditemukan",
        });
    }
    jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                message: "Token tidak valid",
            });
        }
        customReq.userdata = decoded;
        console.log("decoded payload", customReq.userdata);
        next();
    }));
});
exports.verifyToken = verifyToken;
const ownerOnly = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const customReq = req;
    const refreshtoken = (_a = customReq.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const accesstoken = customReq.cookies.funBreadToken;
    if (!refreshtoken) {
        return res.status(403).json({
            message: "Token tidak ditemukan",
        });
    }
    if (!accesstoken) {
        return res.status(403).json({
            message: "Unauthorize",
        });
    }
    jsonwebtoken_1.default.verify(refreshtoken, process.env.REFRESH_TOKEN, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                message: "Token tidak valid",
            });
        }
        customReq.userdata = decoded;
        if (customReq.userdata.role.includes("owner")) {
            next();
        }
        else {
            return res.status(403).json({
                message: "API dan Akses ditolak"
            });
        }
    }));
});
exports.ownerOnly = ownerOnly;
