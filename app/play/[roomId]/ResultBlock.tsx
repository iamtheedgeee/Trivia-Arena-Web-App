import { Button } from "@/components/ui/button"
import { Question, State } from "./reducer"
import QuestionStatement from "./QuestionStatement"
import { ArrowRight } from "lucide-react"

interface Props{
    state:State,
    handleNext:()=>void,
}
export default function ResultBlock({state,handleNext}:Props){
    const {results,completed,question}=state
    return (
        <div className="px-2 py-3 flex flex-col gap-2 sm:px-20 md:px-40 lg:px-70 xl:px-80">
            <QuestionStatement question={question!}/>
            <div className="w-full flex flex-col gap-1">
                {results!.verdict.map((verdict)=>{
                    return(
                    <div key={verdict.player.id} className="w-full rounded-md overflow-hidden flex">
                        <div className="flex-1/4 p-2 bg-gray-700 text-white">{verdict.player.name}</div>
                        <div className={` border border-gray-900 flex-3/4 text-right p-2 rounded-tr-md rounded-br-md border-l-0 ${verdict.verdict.correct?"text-green-500":"text-red-500"}`}>{verdict.verdict.answer}</div>
                    </div>
                )})}
            </div>
            <div className="w-full flex flex-col gap-1">
                <div className="text-gray-400 font-mono text-sm">CORRECT ANSWER</div>
                <div className="text-green-500">{results!.answer}</div>
                <div>{results!.explanation}</div>
                <Button onClick={handleNext} className="flex justify-center items-center">
                    {completed?"See Results":"Next"}
                    <ArrowRight size="1em"/>
                </Button>
            </div>
        </div>
    )
}