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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAccount = exports.editUserAccount = exports.findUserByID = exports.getAllUser = void 0;
const prisma_1 = require("../../../lib/prisma");
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, take, search } = req.query;
    let filter = {};
    try {
        if (search && search !== "") {
            filter = Object.assign(Object.assign({}, filter), { OR: [{ name: { contains: search } }] });
        }
        const result = yield prisma_1.prisma.user.findMany({
            orderBy: {
                created_at: "desc",
            },
            take: Number(take),
            skip: Number(skip),
            where: filter,
            include: {
                role: true,
            },
        });
        const totalUser = yield prisma_1.prisma.user.count();
        return res.status(200).json({
            message: "Berhasil fetch user data",
            data: {
                result: result,
                metadata: {
                    hasNextPage: Number(skip) + Number(take) < totalUser,
                    totalPages: Math.ceil(totalUser / Number(take)),
                    totalData: totalUser,
                },
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.getAllUser = getAllUser;
const findUserByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const existingUser = yield prisma_1.prisma.user.findUnique({
            where: {
                id,
            }
        });
        if (!existingUser) {
            return res.status(404).json({
                message: "Id akun tidak ditemukan",
            });
        }
        const result = yield prisma_1.prisma.user.findUnique({
            where: {
                id: existingUser.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                profile_picture: true,
                shift: true,
                role: true
            }
        });
        return res.status(200).json({
            message: "Berhasil fetch data user",
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.findUserByID = findUserByID;
const editUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, email, profile_picture, role, shift } = req.body;
    const existingUser = yield prisma_1.prisma.user.findUnique({
        where: {
            id,
        }
    });
    if (!existingUser) {
        return res.status(404).json({
            message: "Akun tidak ditemukan",
        });
    }
    const exisitingRole = yield prisma_1.prisma.user_role.findFirst({
        where: {
            name: role,
        },
    });
    if (!exisitingRole) {
        return res.status(400).json({
            message: "Role akun tidak valid",
        });
    }
    try {
        yield prisma_1.prisma.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                name,
                email,
                profile_picture,
                shift,
                role: {
                    connect: {
                        id: exisitingRole.id,
                    },
                },
            },
        });
        return res.status(200).json({
            message: "Berhasil update akun",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.editUserAccount = editUserAccount;
const deleteUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const existingUser = yield prisma_1.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!existingUser) {
        return res.status(404).json({
            message: "Id akun tidak ditemukan / invalid",
        });
    }
    try {
        yield prisma_1.prisma.user.delete({
            where: {
                id: existingUser.id,
            },
        });
        return res.status(200).json({
            message: `Berhasil hapus akun ${existingUser.name}`,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.deleteUserAccount = deleteUserAccount;
