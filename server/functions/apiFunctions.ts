import Groq from "groq-sdk"
import {z} from "zod"
import { AnswerCheckList, FreeResponseListSchema, FreeResponseQuestionSchema, AnswerCheckSchema } from "../schema/questions.js"
interface FreeResponseQuestion extends z.infer<typeof FreeResponseQuestionSchema>{}
interface AnswerCheck extends z.infer<typeof AnswerCheckSchema>{}
const client=new Groq({apiKey:process.env.GROQ_API_KEY})


class CustomError extends Error{
    constructor(message:string){
        super(message)
    }
}
export const getDummyQuestions=async(x:string)=>{
    let dummy:Question[]=[]
    dummy=[
        {
            sn:1,
            question:"What is the quantization frequency of a Marleyan?",
            answer:"Yohan",
            answers:[],
            explanation:"The quantization frequency of a marleyan is indeed a yohan congratulayions young tester or..old,idk."

        },
        {
            sn:2,
            question:"What is the quantization frequency of a Mustapha?",
            answer:"Yonko",
            answers:[],
            explanation:"The quantization frequency of a marleyan is indeed a yonko congratulayions young tester or..old,idk."
            
        },
        {
            sn:3,
            question:"What is the quantization frequency of a Globnark?",
            answer:"yohohoho",
            answers:[],
            explanation:"The quantization frequency of a marleyan is indeed a yohohoho congratulayions young tester or..old,idk."
            
        },
        {
            sn:4,
            question:"What is the blahhhhhhh frequency of a Globnark?",
            answer:"yohohoho",
            answers:[],
            explanation:"The quantization frequency of a marleyan is indeed a yohohoho congratulayions young tester or..old,idk."
            
        }

    ]
    return dummy
    
}
export const getQuestions=async(category:string)=>{
    
    const prompt=`
        You are an assistant that generates an array of 10 questions with single-word or single-phrase answers. 
        Return the output as a **JSON array** where each item follows this exact schema:

        {
            "sn": number,
            "question": string,
            "answer": string,
            "explanation": string
        }

        Requirements:
        1. Generate exactly 10 questions.
        2. Each answer must be a single word or a single phrase (no full sentences).
        3. Each explanation should be 1–2 sentences, clearly explaining the answer.
        4. The JSON must be valid, properly formatted, and contain only the array — do not include extra text or commentary.

        Topic: ${category}

        Return the JSON array only.
    `
    try{
        const response= await client.chat.completions.create({
            model:"llama-3.3-70b-versatile",
            messages:[
                {role:"system", content:"You Are a JSON Generator. Respond ONLY in JSON. Make it safe for immediate parsing"},
                {role:"user", content:prompt}
            ]
        })
        //Extracting Message Content
        const raw= response.choices[0].message.content
        if(!raw) throw new CustomError("No response")

        //Extracting the Json Part for safe Parsing
        const jsonMatch= raw.match(/\[[\s\S]*\]/)
        if(!jsonMatch) throw new CustomError("No Json")

        
        const content=JSON.parse(jsonMatch[0])
        const result= FreeResponseListSchema.safeParse(content)//Checking Whether the parsed json matches the required schema
        if(!result.success)throw new CustomError("Json Shape Mismatch")
        const questions=content as FreeResponseQuestion[]
        return questions.map((question)=>{
            return {
                ...question,
                answers:[] as Answer[]
            }
        })
    }catch(error){
        console.log(error)
        if(error instanceof CustomError) throw new Error(error.message)
        throw new Error("System Error")
    }
}



export const judgeAnswers=async(question:Question,category:string)=>{
    const verdict:Verdict[]=[]
    const prompt=`
        You are an assistant that evaluates answers for correctness.
        Your task is to return **only a JSON object** of an array with each items being in the EXACT format {"id":*given id*,"correct":*boolean indicating whether the answer associated with the given id is correct*}
        For example, for {"id":"12u4bdeo","answer":"America" }, return {"id":"12u4bdeo","answer":true} if "America" is the answer to the given question under the given topic and "correct":false if it is not.
        Mark every answer "i dont know" or "timed out" as false. if the answer given is unclear or ambiguos or in any way an attempt o give multiple answers, mark it as false as well
        Do this for every object in the given Answer array,for the given question under the given category.
    
        Here is the information:

        Category:${category}
        Question:${question.question}
        Answer Array:${JSON.stringify(question.answers.map((answer)=>{
            return {
                id:answer.player.id,
                answer:answer.answer
            }
        }))}
    `
    try{
        const response= await client.chat.completions.create({
            model:"llama-3.3-70b-versatile",
            messages:[
                {role:"system", content:"You Are a JSON Generator. Respond ONLY in JSON. Make it safe for immediate parsing"},
                {role:"user", content:prompt}
            ]
        })
        //Extracting Message Content
        const raw= response.choices[0].message.content
        if(!raw) throw new CustomError("No response")

        //Extracting the Json Part for safe Parsing
        const jsonMatch= raw.match(/\[[\s\S]*\]/)
        if(!jsonMatch) throw new CustomError("No Json")

        
        const content=JSON.parse(jsonMatch[0])
        const result= AnswerCheckList.safeParse(content)//Checking Whether the parsed json matches the required schema
        if(!result.success)throw new CustomError("Json Shape Mismatch")
        const answers=content as AnswerCheck[]

        question.answers.forEach((answerObj)=>{
            const answer=answers.find((answer)=>answer.id===answerObj.player.id)
            if(answer){
                verdict.push({
                    player:answerObj.player,
                    verdict:{
                        answer:answerObj.answer,
                        correct:answer.correct
                    }
                })
            }
        })

        return verdict
       
    }catch(error){
        console.log(error)
        if(error instanceof CustomError) throw new Error(error.message)
        throw new Error("System Error")
    }
}

export const dummyJudge=async(question:Question,x:string)=>{
    const verdict:Verdict[]=[]
    question.answers.forEach((answerObj)=>{
        verdict.push({
            player:answerObj.player,
            verdict:{
                answer:answerObj.answer,
                correct:true
            }
        })
    })

    return verdict
}