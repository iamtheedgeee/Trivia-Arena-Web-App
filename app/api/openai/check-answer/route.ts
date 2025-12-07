import {NextResponse} from "next/server"
import Groq from "groq-sdk"
import { AnswerCheckSchema } from "@/types/question"
const client=new Groq({apiKey:process.env.OPENAI_API_KEY})
export async function POST(req:Request){
    console.log("ai loading..")
    try{
        const {prompt}= await req.json()
        const response= await client.chat.completions.create({
            model:"llama-3.3-70b-versatile",
            messages:[
                {role:"system", content:"You Are a JSON Generator. Respond ONLY in JSON. Make it safe for immediate parsing"},
                {role:"user", content:prompt}
            ]
        })
        //Extracting Message Content
        const raw= response.choices[0].message.content
        if(!raw) return NextResponse.json({success:false, error:"No Response"},{status:500})

        //Extracting the Json Part for safe Parsing
        const jsonMatch= raw.match(/\{(?:[^{}]|(?:\{[^{}]*\}))*\}/)
        if(!jsonMatch) return NextResponse.json({success:false,error:"No Json"})

        let content;
        try{
            content=JSON.parse(jsonMatch[0])
            const result= AnswerCheckSchema.safeParse(content)//Checking Whether the parsed json matches the required schema
            if(!result.success)return NextResponse.json({success:false,error:"Invalid JSON Shape"},{status:500})
        }catch{
            return NextResponse.json({success:false,error:"Unable to Parse"},{status:500})
        }
        return NextResponse.json({success:true,content})
    }catch(error){
        console.log(error)
        return NextResponse.json({success:false,error:"System Error"},{status:500})
    }
}