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
exports.deleteRole = exports.editRole = exports.createNewRole = exports.getAllUserRole = void 0;
const prisma_1 = require("../../../lib/prisma");
const getAllUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.prisma.user_role.findMany();
        return res.status(200).json({
            message: "Berhasil fetch data user role",
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
exports.getAllUserRole = getAllUserRole;
const createNewRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        yield prisma_1.prisma.user_role.create({
            data: {
                name,
            },
        });
        return res.status(201).json({
            message: "Berhasil membuat user role",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.createNewRole = createNewRole;
const editRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name } = req.body;
    const existingRole = yield prisma_1.prisma.user_role.findUnique({
        where: {
            id,
        },
    });
    if (!existingRole) {
        return res.status(404).json({
            message: "role tidak ditemukan",
        });
    }
    try {
        yield prisma_1.prisma.user_role.update({
            where: {
                id: id,
            },
            data: {
                name,
            },
        });
        return res.status(200).json({
            message: "Berhasil update user role",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.editRole = editRole;
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const existingRole = yield prisma_1.prisma.user_role.findUnique({
        where: {
            id,
        },
    });
    if (!existingRole) {
        return res.status(404).json({
            message: "role tidak ditemukan",
        });
    }
    try {
        yield prisma_1.prisma.user_role.delete({
            where: {
                id: id,
            }
        });
        return res.status(200).json({
            message: "Berhasil hapus user role",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.deleteRole = deleteRole;
