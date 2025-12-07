import { api } from "@/axios/api";

export async function QuestionPrompt(prompt:string){
    try{
        const res= await api.post('/api/openai/generate-questions',{prompt})
        const {content}=res.data
        return content
    }catch(error){
        if(error instanceof Error)throw new Error(error.message)
    }
}

export async function AnswerPrompt(prompt:string){
    try{
        const res= await api.post('/api/openai/check-answer',{prompt})
        const {content}=res.data
        return content
    }catch(error){
        if(error instanceof Error)throw new Error(error.message)
    }
}