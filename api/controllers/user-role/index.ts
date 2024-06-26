import { Response, Request } from "express";
import { prisma } from "../../../lib/prisma";

export const getAllUserRole = async (req: Request, res: Response) => {
  try {
    const result = await prisma.user_role.findMany();

    return res.status(200).json({
      message: "Berhasil fetch data user role",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const getRoleByName = async (req: Request, res: Response) => {
  const { rolename } = req.body;
  try {
    const existingRole = await prisma.user_role.findFirst({
      where: {
        name: rolename
      }
    });
    if(!existingRole) {
      return res.status(404).json({
        message: "Role tidak ditemukan"
      })
    }

    return res.status(200).json({
      message: "Berhasil fetch",
      data: existingRole
    })
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
}

export const getAllUserAndRole = async (req: Request, res: Response) => {
  const { skip, take, search } = req.query;

  let filter: any = {}
  try {

    if (search && search !== "") {
      filter = {
        ...filter,
        OR: [{ name: { contains: search } }],
      };
    }

    const result = await prisma.user_role.findMany({
      include: {
        user: true,
      },
      where: filter,
      take: Number(take),
      skip: Number(skip)
    });

    const totalData = await prisma.user_role.count();

    return res.status(200).json({
      message: "Berhasil fetch",
      data: {
        result: result,
        metadata: {
          hasNextPage: Number(skip) + Number(take) < totalData,
          totalPages: Math.ceil(totalData / Number(take)),
          totalData: totalData,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
}

export const getRoleById = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const result = await prisma.user_role.findUnique({
      where: {
        id: id
      },
    });

    if(!result) {
      return res.status(404).json({
        message: "Role tidak ditemukan"
      })
    }

    return res.status(200).json({
      message: "berhasil fetch",
      data: result
    })
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
}

export const createNewRole = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    await prisma.user_role.create({
      data: {
        name,
      },
    });

    return res.status(201).json({
      message: "Berhasil membuat user role",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const editRole = async (req: Request, res: Response) => {
  const { id, name } = req.body;

  try {
    const existingRole = await prisma.user_role.findUnique({
      where: {
        id,
      },
    });

    if (!existingRole) {
      return res.status(404).json({
        message: "role tidak ditemukan",
      });
    }

    await prisma.user_role.update({
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const existingRole = await prisma.user_role.findUnique({
      where: {
        id,
      },
    });

    if (!existingRole) {
      return res.status(404).json({
        message: "role tidak ditemukan",
      });
    }

    await prisma.user_role.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "Berhasil hapus user role",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};
