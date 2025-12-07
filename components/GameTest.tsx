"use client"
import { QuestionPrompt } from "@/lib/openai"
import { useEffect, useState,useRef } from "react"
import { Button } from "./ui/button"
import { FreeResponseQuestion, MultipleChoiceQuestion } from "@/types/question";

import FreeResponseQuestionDisplay from "./Question/FreeResponseQuestionDisplay"

export default function GameTest({category}:{category:string}){
    const first=useRef(true)
    const [questions,setQuestions]=useState<FreeResponseQuestion[] | MultipleChoiceQuestion[]>([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")

    async function load(){
        try{
            setError("")
            setLoading(true)
            const content= await QuestionPrompt(`
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
`)
            console.log(content)
            setQuestions(content)
        }catch(error){
            if(error instanceof Error) setError(error.message)
        }finally{
            setLoading(false)
        }  
    }    
    useEffect(()=>{
        if(!first.current) return
        first.current=false
        load()
    },[])
    if(loading)return <div>loading...</div>
    if(error)return <div>{error}<Button onClick={()=>load()}>Retry</Button></div>
    return(
        <FreeResponseQuestionDisplay questions={questions} category={category}/>
    )
}

//Context was a Bad idea!! do things normally now!