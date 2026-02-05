import { Dispatch, SetStateAction } from "react";
import { State } from "./reducer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import QuestionStatement from "./QuestionStatement";
import { ArrowRight } from "lucide-react";
interface Props{
    state:State,
    answer:string,
    setAnswer:Dispatch<SetStateAction<string>>,
    submitAnswer:(e:React.FormEvent<HTMLFormElement>)=>void,
    idk:()=>void,
    timer:number|null
}
export default function QuestionBlock({state,answer,setAnswer,submitAnswer,timer,idk}:Props){
    const {question,submitted,waitingPlayers,checking}=state
    return(
        <div className="px-2 py-3 flex flex-col gap-2 sm:px-20 md:px-40 lg:px-70 xl:px-80">
            <QuestionStatement question={question!}/>
            {!submitted&&
            <>
                <form className="w-full flex justify-between space-x-1" onSubmit={submitAnswer}>
                    <Input placeholder="Your Answer..." type="text" value={answer} onChange={(e)=>setAnswer(e.target.value)}/>
                    <Button type="submit">Submit</Button>
                </form>
                {timer&&<div className="w-full flex justify-center items-center"><span className="rounded-full flex justify-center items-center w-5 h-5 border border-red-500 p-3">{timer}</span></div>}
                <div onClick={idk} className="w-full text-sm text-muted-foreground flex justify-center items-center gap-1 cursor-pointer hover:text-gray-800">
                    I don't know <ArrowRight size="1em"/>
                </div>
            </>
            }
            {checking?
                <div className="w-full text-sm text-muted-foreground text-center">Checking answers...</div>
            :waitingPlayers.length>0&&
                <div className="w-full text-sm text-muted-foreground flex justify-center items-center gap-1">
                    Waiting for {waitingPlayers.length===1?waitingPlayers[0].name:"Others"}...<span className="rounded-full flex justify-center items-center w-5 h-5 border border-green-500 p-3">{timer}</span>
                </div>
            }
        </div>
    )
}