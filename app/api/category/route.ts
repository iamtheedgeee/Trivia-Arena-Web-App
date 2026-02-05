import {NextResponse} from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req:Request){
    try{
        const categories= await prisma.category.findMany()
        return NextResponse.json({success:true,categories})
    }catch(error){
        console.log(error)
        return NextResponse.json({success:false,error:"System Error"},{status:500})
    }
}