import { answerDisplay } from "@/types/question";
import { Butterfly_Kids } from "next/font/google";
import { Button } from "../ui/button";

export default function AnswerDisplay({display}:{display:answerDisplay}){
    return (
        <div>
            <div className={display.correct?"text-green-400":"text-red-500"}>Your answer:{display.givenAnswer}</div>
            <div>{display.answer}</div>
            <div>{display.explanation}</div>
            <Button onClick={display.next}>Next</Button>
        </div>
    ) 
}