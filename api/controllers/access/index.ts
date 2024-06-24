import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const fetchAllAccessData = async (req: Request, res: Response) => {
  try {
    const result = await prisma.user_role.findMany({
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const getAccessDataByRoleId = async (req: Request, res: Response) => {
  const { roleid } = req.body;
  try {
    const exisitingRole = await prisma.user_role.findUnique({
      where: {
        id: roleid,
      },
    });

    if (!exisitingRole) {
      return res.status(404).json({
        message: "Role tidak ditemukan",
      });
    }

    const result = await prisma.access.findMany({
      where: {
        role_id: exisitingRole.id,
      },
    });

    res.status(200).json({
      message: "berhasil fetch",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const createOrUpdateAccessData = async (req: Request, res: Response) => {
  const { roleid, permissions } = req.body;

  try {
    const existingRole = await prisma.user_role.findUnique({
      where: { id: roleid },
    });

    if (!existingRole) {
      return res.status(404).json({
        message: "Role tidak ditemukan",
      });
    }

    const existingAccess = await prisma.access.findMany({
      where: {
        role_id: existingRole.id,
      },
    });

    if (existingAccess.length > 0) {
      for (const data of permissions) {
        const existingAccessId = existingAccess.find(access => access.key === data.key)?.id;
    
        if (existingAccessId) {
          await prisma.access.update({
            where: {
              id: existingAccessId,
            },
            data: {
              value: Boolean(data.value),
            },
          });
        } else {
          // Create new access entry if it doesn't exist
          await prisma.access.create({
            data: {
              key: data.key,
              value: Boolean(data.value),
              role_id: Number(existingRole.id),
            },
          });
        }
      }
    } else {
      const accessData = permissions.map((perm: any) => ({
        key: perm.key,
        value: Boolean(perm.value),
        role_id: Number(existingRole.id),
      }));

      await prisma.access.createMany({
        data: accessData,
      });
    }

    return res.status(200).json({
      message: "Berhasil membuat ataupun mengubah akses role",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};
