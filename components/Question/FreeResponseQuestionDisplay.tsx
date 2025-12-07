"use client"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import {useState,useRef} from "react"
import { answerDisplay, FreeResponseQuestion } from "@/types/question"
import { AnswerPrompt } from "@/lib/openai"
import AnswerDisplay from "./AnswerDisplay"

export default function FreeResponseQuestionDisplay({questions,category}:{questions:FreeResponseQuestion[],category:string}){
    const [index,setIndex]=useState(0)
    const [answer,setAnswer]=useState("")
    const [display,setDisplay]=useState<answerDisplay|null>(null)
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    const currentQuestion=questions[index]
    const correct=useRef(0)

    function next(){
        if(index+1===questions.length){
            alert(`You Got ${correct.current} out of 10 questions`)
            return
        }
        setDisplay(null)       
        setIndex((prev)=>prev+1)
        setAnswer("")
    }
    async function submit(){
        console.log("answer",answer)
        try{
            setError("")
            setLoading(true)
            const content=await AnswerPrompt(`
                You are an assistant that evaluates answers for correctness. 
                Your task is to return **only a JSON object** in the exact format { "correct": true } or { "correct": false }.

                Do not add any explanations or extra text.
                Rules:
                    1. Return true if the answer is essentially correct, even if it has minor typos, spelling mistakes, or slight wording differences.
                    2. Return false only if the answer is clearly wrong or does not answer the question.
                    3. Do not add any explanations or extra text—output only the JSON.

                Here is the information:

                Topic: ${category}
                Question: ${currentQuestion.question}
                Answer: ${answer}

                Ignore obvious typos or misspells 
                Return { "correct": true } if the answer correctly answers the question for the given topic, otherwise return { "correct": false }.
            `)
            if(content.correct)correct.current+=1
            setDisplay(
                {
                    explanation:currentQuestion.explanation,
                    answer:currentQuestion.answer,
                    givenAnswer:answer,
                    correct:content.correct,
                    next
                }
            )
        }catch(error){
            if(error instanceof Error)setError(error.message)
        }finally{
            setLoading(false)
        }
        
    }
    return(
        <div>
            <div>{currentQuestion?.sn}</div>
            <div>{currentQuestion?.question}</div>
            {error && <div className="text-red-500">{error} Try Again</div>}
            {display?<AnswerDisplay display={display}/>:<><Input placeholder="Your Answer..." type="text" value={answer} onChange={(e)=>setAnswer(e.target.value)}/><Button onClick={submit} disabled={loading}>{loading?"Checking":"Submit"}</Button></>}
        </div>
    )
}