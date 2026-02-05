"use client"
import{useState,useEffect,useReducer, useRef} from "react"
import {useRouter} from "next/navigation"
import { useParams } from "next/navigation";
import EVENTS from "@/globals/constants/events";
import { initialState, Question, reducer, Score } from "./reducer";
import { useSocketContext } from "@/hooks/SocketContext";
import QuestionBlock from "./QuestionBlock";
import ScoreBoard from "./ScoreBoard";
import ResultBlock from "./ResultBlock";
import FinalBlock from "./FinalBlock";
export default function Play(){
    const [state,dispatch]=useReducer(reducer,initialState)
    const {loading,finished,results,scores,completed}=state
    const [answer,setAnswer]=useState("")
    const [timer,setTimer]=useState<number|null>(null)
    const interval=useRef<NodeJS.Timeout|null>(null)
    const offSet=useRef<number|null>(null)
    const {roomId}=useParams() as {roomId:string}
    const router=useRouter()
    const {socket}=useSocketContext()
    function getQuestion(){
        socket.emit(EVENTS.GET_QUESTION,roomId)
    }

    function handleNext(){
        completed?
            socket.emit(EVENTS.GET_FINAL_SCORES,roomId)
        :
            socket.emit(EVENTS.GET_QUESTION,roomId)
        dispatch({type:"NEXT"})
    } 

    function submitAnswer(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        if(!answer) return
        socket.emit(EVENTS.SUBMIT_ANSWER,roomId,answer)
        dispatch({type:"SUBMIT_ANSWER"})
    }
    
    function idk(){
        socket.emit(EVENTS.SUBMIT_ANSWER,roomId,"I don't Know")
        dispatch({type:"SUBMIT_ANSWER"})
    }
    useEffect(()=>{
        socket.on(EVENTS.RECEIVE_QUESTION,(currentQuestion:Question)=>{
            setAnswer("")
            dispatch({type:EVENTS.RECEIVE_QUESTION, currentQuestion})            
        })

        socket.on(EVENTS.CHECKING,()=>{
            if(interval.current){
                clearInterval(interval.current)
                interval.current=null
                setTimer(null)
            }
            dispatch({type:EVENTS.CHECKING})
        })
        socket.on(EVENTS.ANSWER_CHECK_ERROR,()=>{
            alert("Something went wrong submitting answers")
            dispatch({type:EVENTS.ANSWER_CHECK_ERROR})
            
        })
        socket.on(EVENTS.WAITING,(waitingPlayers:Player[])=>{
            dispatch({type:EVENTS.WAITING,waitingPlayers})
        })

        socket.on(EVENTS.RECEIVE_VERDICT,(results:Results)=>{
            dispatch({type:EVENTS.RECEIVE_VERDICT,results})
        })

        socket.on(EVENTS.LAST_QUESTION,()=>{
           dispatch({type:EVENTS.LAST_QUESTION})
        })

        socket.on(EVENTS.RECEIVE_FINAL_SCORES,(scores:Score[])=>{
            dispatch({type:EVENTS.RECEIVE_FINAL_SCORES,scores})
        })
        socket.on(EVENTS.UPDATE_SCORE,(scores:Score[])=>{
            dispatch({type:EVENTS.UPDATE_SCORE,scores})
        })
        socket.on(EVENTS.SUBMIT_TIMER,(startTime:number,duration:number)=>{
            offSet.current=startTime-Date.now()
            interval.current=setInterval(()=>{
                const elapsed=(Date.now()+offSet.current!)-startTime
                const remaining=duration-elapsed
                setTimer(Math.round(remaining/1000))
                if(remaining<=0){
                    clearInterval(interval.current!)
                    interval.current=null
                    setTimer(null)
                }
            },200)
        })
        socket.on(EVENTS.NOT_MEMBER,()=>{
            alert("You are Trespassing! Leave!")
            router.push('/')
        })

        socket.on(EVENTS.NO_ROOM,()=>{
            alert("Room closed or doesnt exist")
            router.push('/')
        })
        
        getQuestion()

        return ()=>{
            socket.off(EVENTS.RECEIVE_QUESTION)
            socket.off(EVENTS.WAITING)
            socket.off(EVENTS.CHECKING)
            socket.off(EVENTS.RECEIVE_VERDICT)
            socket.off(EVENTS.ANSWER_CHECK_ERROR)
            socket.off(EVENTS.LAST_QUESTION)
            socket.off(EVENTS.NO_ROOM)
            socket.off(EVENTS.NOT_MEMBER)
            socket.off(EVENTS.SUBMIT_TIMER)
            socket.off(EVENTS.UPDATE_SCORE)
            socket.off(EVENTS.RECEIVE_FINAL_SCORES)
        }
    },[])
    if(loading) return <div></div>
    return(
        <div className="h-full">
            {
                finished?
                    <FinalBlock scores={scores}/>
                :
                    <>
                        <ScoreBoard scores={scores}/>
                        {
                            results?
                                <ResultBlock handleNext={handleNext} state={state}/>
                            :
                                <QuestionBlock state={state} answer={answer} timer={timer} setAnswer={setAnswer} submitAnswer={submitAnswer} idk={idk}/>
                        
                        }
                    </>
            }
        </div>
    )
}