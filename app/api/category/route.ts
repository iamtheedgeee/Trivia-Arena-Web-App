import {NextResponse} from "next/server"
import prisma from "@/lib/prisma"


export async function POST(req:Request){
    const data= await req.formData()
    const name=data.get("category") as string
    try{
        const category= await prisma.category.create({
            data:{
                name
            }
        })
        return NextResponse.redirect("http://localhost:3000/?success=true")
    } catch(error){
        console.log(error)
        return NextResponse.redirect("http://localhost:3000/?success=false")
    }    
}

export async function GET(req:Request){
    try{
        const categories= await prisma.category.findMany()
        return NextResponse.json({success:true,categories})
    }catch(error){
        console.log(error)
        return NextResponse.json({success:false,error:"System Error"},{status:500})
    }
}