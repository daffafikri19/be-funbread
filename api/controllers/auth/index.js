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
exports.Logout = exports.Register = exports.Login = void 0;
const prisma_1 = require("../../../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const existingAccount = yield prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!existingAccount) {
            return res.status(400).json({
                message: "Email salah atau akun tidak ditemukan",
            });
        }
        const matchPassword = yield bcryptjs_1.default.compare(password, existingAccount.password);
        if (!matchPassword) {
            return res.status(400).json({
                message: "Password salah",
            });
        }
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                email: existingAccount.email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profile_picture: true,
                shift: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: "Akun tidak ditemukan",
            });
        }
        const payload = {
            userid: user.id,
            name: user.name,
            email: user.email,
            role: user.role.name,
            profile_picture: user.profile_picture,
            shift: user.shift
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN, {
            expiresIn: 1000 * 60 * 60 * 24
        });
        return res.cookie("funBreadToken", accessToken, {
            httpOnly: false,
            secure: false, // change to true when to production
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24
        }).status(200).json({
            message: "Berhasil login",
            token: accessToken
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.Login = Login;
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, profile_picture, role, password, confPassword, shift } = req.body;
    try {
        const existingRole = yield prisma_1.prisma.user_role.findFirst({
            where: {
                name: role,
            },
        });
        if (!existingRole) {
            return res.status(404).json({
                message: `Role ${role} tidak ditemukan`,
            });
        }
        const existingEmail = yield prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingEmail) {
            return res.status(400).json({
                message: "Email sudah digunakan diakun lain",
            });
        }
        const existingName = yield prisma_1.prisma.user.findUnique({
            where: {
                name,
            },
        });
        if (existingName) {
            return res.status(400).json({
                message: "Nama sudah digunakan diakun lain",
            });
        }
        const matchPassword = password === confPassword;
        if (!matchPassword) {
            return res.status(400).json({
                message: "Password dan konfirmasi password tidak cocok",
            });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        yield prisma_1.prisma.user.create({
            data: {
                name,
                email,
                profile_picture,
                role: {
                    connect: {
                        id: existingRole.id,
                    },
                },
                password: hashedPassword,
                shift,
            },
        });
        return res.status(201).json({
            message: `Berhasil membuat akun ${role}`,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.Register = Register;
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid } = req.body;
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                id: userid,
            },
        });
        if (!user) {
            return res.sendStatus(401);
        }
        return res.clearCookie('funBreadToken').status(200).json({
            message: 'Berhasil logout'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.Logout = Logout;
