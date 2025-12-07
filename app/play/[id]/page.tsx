"use client"
interface PageProps{
    params:{
        id:string
    }
}
interface Question{
    sn:string;
    question:string;
}

interface Member{
    name:string;
    id:string;
    leader?:boolean;
}

interface Verdict{
    player:Member;
    verdict:{answer:string,correct:boolean}
}

interface Results{
    verdict:Verdict[];
    answer:string;
    explanation:string;
}

interface Score{
    player:Member,
    points:number
}


import type { Socket } from "socket.io-client"
import { getSocket } from "@/lib/socket"
import{useState,useEffect, useRef} from "react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Play({params}:PageProps){
    const [question,setQuestion]=useState<Question>()
    const [checking,setChecking]=useState(false)
    const [waitingMembers,setWaitingMembers]=useState<Member[]>([])
    const [submitted,setSubmitted]=useState(false)
    const [completed,setCompleted]=useState(false)
    const [answer,setAnswer]=useState("")
    const [results,setResults]=useState<Results | null>(null)
    const [scores,setScores]=useState<Score[]|null>()
    const roomId=useRef<string|null>(null)
    async function getQuestion(socket:Socket){
        const {id}=await params
        roomId.current= id
        socket.emit("getQuestion",id)
    }

    function handleNext(){
        const socket=getSocket()
        setResults(null)
        if(completed){
            socket.emit("getFinalScores",roomId.current)
        }else{
            socket.emit("getQuestion",roomId.current)
        }
    }
    

    function submitAnswer(){
        const socket=getSocket()
        socket.emit("submitAnswer",roomId.current,answer)
        setSubmitted(true)
    }
    useEffect(()=>{
        const socket=getSocket()
        getQuestion(socket)
        socket.on("recieveQuestion",(currentQuestion:Question)=>{
            setQuestion(currentQuestion)
            setAnswer("")
            setSubmitted(false)

            
        })

        socket.on("checking",()=>{
            setWaitingMembers([])
            setChecking(true)
        })

        socket.on("waiting",(members:Member[])=>{
            setWaitingMembers(members)
        })

        socket.on("recieveVerdict",(results:Results)=>{
            setChecking(false)
            setResults(results)
        })

        socket.on("lastQuestion",()=>{
            setCompleted(true)
        })

        socket.on("recieveFinalScores",(scores:Score[])=>{
            setScores(scores)
        })

        return ()=>{
            socket.off("recieveQuestion")
            socket.off("waiting")
            socket.off("checking")
            socket.off("recieveVerdict")
            socket.off("lastQuestion")
        }
    },[])
    return(
        <div>
            <div>{question?.sn}</div>
            <div>{question?.question}</div>
            <Input placeholder="Your Answer..." type="text" value={answer} onChange={(e)=>setAnswer(e.target.value)}/>
            {!submitted&&<Button onClick={submitAnswer}>Submit</Button>}
            {waitingMembers.length>0&&
                <div>
                    Waiting for:{waitingMembers.map((member)=>{
                        return <span key={member.id}>{member.name}</span>
                    })}
                </div>
            }
            {checking&&<div>judging you....</div>}
            {results&&
                <div>
                    {results.verdict.map((verdict)=>{
                        return <div key={verdict.player.id}>
                            <div>Player:{verdict.player.name}</div>
                            <div>Answer:<span className={verdict.verdict.correct?"text-green-500":"text-red-400"}>{verdict.verdict.answer}</span></div>
                        </div>
                    })}
                    <div>Answer:{results.answer}</div>
                    <div>Explanation:{results.explanation}</div>
                    <Button onClick={handleNext}>{completed?"See Results":"Next"}</Button>
                </div>
            }
            {scores&&
                <div>
                    <div>Final results</div>
                    {scores.map((score)=>{
                        return <div key={score.player.id}>{score.player.name}--{score.points}</div>
                    })}
                    <Link href="/"><Button>Finish</Button></Link>
                </div>
            }

        </div>
    )
}