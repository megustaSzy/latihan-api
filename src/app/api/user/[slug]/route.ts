
import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const check = await prisma.tb_user.findUnique({
    where: {
      id: Number(params.slug),
    },
  });

  // jika data tidak ditemukan
  if (!check) {
    return NextResponse.json({
      message: "data user tidak ditemukan",
      success: false,
    });
  }

  // jika data user ditemukan
  await prisma.tb_user.delete({
    where: {
      id: Number(params.slug),
    },
  });
  // tampilkan response succes
  return NextResponse.json({
    message: "data user berhasil dihapus",
    success: true,
  });
};

// PUT user
export const PUT = async (request: NextRequest, context: { params: Promise<{ slug: string }> }) => {
    try {
        const { slug } = await context.params;
        const userId = Number(slug);

        if (isNaN(userId)) {
            return NextResponse.json({
                message: "id tidak valid",
                success: false
            });
        }

        const data = await request.json();

        // Cek email apakah sudah dipakai user lain
        const existingUser = await prisma.tb_user.findFirst({
            where: {
                email: data.email,
                NOT: { id: userId }
            }
        });

        if (existingUser) {
            return NextResponse.json({
                message: "email sudah digunakan user lain",
                success: false
            });
        }

        // Update user langsung di sini
        const updatedUser = await prisma.tb_user.update({
            where: { id: userId },
            data
        });

        return NextResponse.json({
            message: "data berhasil diubah",
            success: true,
            data: updatedUser
        });
    } catch (error: any) {
        return NextResponse.json({
            message: error.message || "Terjadi kesalahan",
            success: false
        });
    }
};
