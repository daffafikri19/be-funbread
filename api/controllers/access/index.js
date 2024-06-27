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
exports.createOrUpdateAccessData = exports.getAccessDataByRoleId = exports.fetchAllAccessData = void 0;
const prisma_1 = require("../../../lib/prisma");
const fetchAllAccessData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.prisma.user_role.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return res.status(200).json({
            message: "Berhasil fetch",
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
exports.fetchAllAccessData = fetchAllAccessData;
const getAccessDataByRoleId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roleid } = req.body;
    try {
        const exisitingRole = yield prisma_1.prisma.user_role.findUnique({
            where: {
                id: roleid,
            },
        });
        if (!exisitingRole) {
            return res.status(404).json({
                message: "Role tidak ditemukan",
            });
        }
        const result = yield prisma_1.prisma.access.findMany({
            where: {
                role_id: exisitingRole.id,
            },
        });
        res.status(200).json({
            message: "berhasil fetch",
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
exports.getAccessDataByRoleId = getAccessDataByRoleId;
const createOrUpdateAccessData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { roleid, permissions } = req.body;
    try {
        const existingRole = yield prisma_1.prisma.user_role.findUnique({
            where: { id: roleid },
        });
        if (!existingRole) {
            return res.status(404).json({
                message: "Role tidak ditemukan",
            });
        }
        const existingAccess = yield prisma_1.prisma.access.findMany({
            where: {
                role_id: existingRole.id,
            },
        });
        if (existingAccess.length > 0) {
            for (const data of permissions) {
                const existingAccessId = (_a = existingAccess.find(access => access.key === data.key)) === null || _a === void 0 ? void 0 : _a.id;
                if (existingAccessId) {
                    yield prisma_1.prisma.access.update({
                        where: {
                            id: existingAccessId,
                        },
                        data: {
                            value: Boolean(data.value),
                        },
                    });
                }
                else {
                    // Create new access entry if it doesn't exist
                    yield prisma_1.prisma.access.create({
                        data: {
                            key: data.key,
                            value: Boolean(data.value),
                            role_id: Number(existingRole.id),
                        },
                    });
                }
            }
        }
        else {
            const accessData = permissions.map((perm) => ({
                key: perm.key,
                value: Boolean(perm.value),
                role_id: Number(existingRole.id),
            }));
            yield prisma_1.prisma.access.createMany({
                data: accessData,
            });
        }
        return res.status(200).json({
            message: "Berhasil membuat ataupun mengubah akses role",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
});
exports.createOrUpdateAccessData = createOrUpdateAccessData;
