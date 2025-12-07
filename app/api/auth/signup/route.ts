import {NextResponse} from "next/server"
import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"

export async function POST(req:Request){
    try{
        const {email,password,username}= await req.json()
        console.log(email,password,username)
        if(!email || !password){
            return NextResponse.json({success:false,error:"Missing fields"},{status:400})   
        }

        const existing= await prisma.user.findUnique({where:{email}})
        if(existing){
            return NextResponse.json({success:false,error:"User Already Exists"},{status:400})
        }

        const hashedPassword=await bcrypt.hash(password,10)

        const user= await prisma.user.create({
            data:{
                email,
                username,
                password:hashedPassword
            }
        })

        return NextResponse.json({success:true,user},{status:201})
    } catch(error){
        return NextResponse.json({success:false,error:"System Error"},{status:500})
    }
}