import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// buat GET user
export const GET = async () => {
  const users = await prisma.tb_user.findMany({
  orderBy: {
    id: "desc"
  }
  });
  return NextResponse.json(users);
};


// buat POST 
export const POST = async (req: NextRequest) => {
  // simpan data
  const data = await req.json();
  // cek apakah udh ada apa belum
  const check = await prisma.tb_user.findFirst({
    where: {
      email: data.email,
      notelp: data.notelp
    },
    select: {
      email: true,
      notelp: true
    }
  })
  // jika user ada
  if (check) {
    return NextResponse.json({
      message: "data user gagal disimpan, email atau no telp sudah ada",
      success: false
    })
  }

  // jika kode barang tidak ditemukan
  // else {
    // simpan data sesuai request
    await prisma.tb_user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        notelp: data.notelp,
        role: data.role,
      },
    })

    // response success
    return NextResponse.json({
      message: "Data berhasil disimpan",
      success: true
    }) 
}