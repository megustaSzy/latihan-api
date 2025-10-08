// buat fungsi GET (ambil data)
import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

// buat variabel prisma (Prism Client)
const prisma = new PrismaClient()

// export async function GET() {
//   // gaya express  return new Response("Test")
//   return new NextResponse(JSON.stringify({ 
//     message: "Test API", 
//     success: true
//     }))
// }

// arrow funct
export const GET = async () => {
  // return new NextResponse(JSON.stringify({ 
  //   message: "Test API", 
  //   success: true
  //   }))


  // buat variabel untuk menampilkan data barang
  const barang = await prisma.tb_barang.findMany({
    orderBy: {
      kode: 'desc'
    }
  })
  // tampilkan data
  return NextResponse.json({
    barang: barang
  })
}

//  buat service untuk POST (simpan data) arrow function
export const POST = async (request: NextRequest) => {
  // simpan data
  const data = await request.json()

  // cek apakah kode barang sudah ada / belum
  const check = await prisma.tb_barang.findFirst({
    where: {
      kode: data.kode
    },
    select: {
      kode: true,
    }
  })

  // jika kode barang ditemukan
  if (check) {
    return NextResponse.json({
      message: "Kode Barang gagal disimpan, kode sudah ada",
      success: false
    })
  }

  // jika kode barang tidak ditemukan
  //else {
    await prisma.tb_barang.create({
      data: {
        kode: data.kode,
        nama: data.nama,
        harga: data.harga,
        satuan: data.satuan,
      },
    })
  
    return NextResponse.json({
      message: "Data berhasil disimpan",
      success: true
    }) 
  //}
}
