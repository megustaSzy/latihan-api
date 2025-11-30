//buat variable prisma
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server"

//buat service DELETE (hapus data)
export const DELETE =async(request: NextRequest,
    { params }: { params: { slug: string } }) => {
        // return NextResponse.json({
        //     slug: params.slug
        // })

        //cek apakah data barang ditemukan
        const check = await prisma.tb_barang.findUnique({
            where : {
                id: Number(params.slug)
            }
        })

        //jika data barang tidak ditemukan
        if(!check) {
            return NextResponse.json({
                message: "Data barang gagal dihapus!!! (Data barang tidak ditemukan!!!)",
                success: false
            })
        }

        //jika data barang ditemukan
        await prisma.tb_barang.delete({
            where : {
                id: Number(params.slug)
            }
        })
        return NextResponse.json({
            message: "Data barang berhasil dihapus!!!",
            success: true
        })
    }

    // buat service PUT (ubah data)
export const PUT = async (request: NextRequest, 
    { params }: { params: { slug: string } }) => {
    const id = params.slug
    const data = await request.json()

    // cek apakah id sudah ada / belum
    const check = await prisma.tb_barang.findFirst({
        where : {
            id : {
                not: Number (id)
            },
            kode: data.kode
        },
        select : {
            id : true
        }
    })

    // jika data  ditemukan
    if (check) {
        return NextResponse.json({
            message: "Data barang gagal diubah (kode barang tidak ditemukan)",
            success: false
        })
    }

    // jika data tidak ditemukan

    //jika kode tidak ditemukan
    await prisma.tb_barang.update({
        where : {
            id : Number (id)
        },
        data: {
            kode: data.kode,
            nama: data.nama,
            harga: data.harga,
            satuan: data.satuan
        } 
    })

    return NextResponse.json({
            message: "Data barang berhasil diubah",
            success: true
        })

}