"use client"
import {useRouter} from "next/navigation"
import {useState,useEffect,useReducer} from "react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EVENTS from "@/globals/constants/events";
import { useParams } from "next/navigation";
import { initialState, reducer } from "./reducer";
import { useSocketContext } from "@/hooks/SocketContext";
import { ArrowLeft, ClipboardCopyIcon, Link2, CrownIcon, ArrowRight } from "lucide-react";
import { LogoImage } from "@/components/Logo";
import CategoryTitle from "@/components/CategoryTitle";
export default function Join(){
    const [{roomInfo,loadingRoom,startingGame,otherPlayers,player},dispatch]=useReducer(reducer,initialState)
    const [name,setName]=useState("")
    const {roomId}=useParams() as {roomId:string}
    const {socket}=useSocketContext()
    const router=useRouter()
    const link=`${window.location.hostname}/join/${roomId}`
    async function copyLink(){
        try{
            await navigator.clipboard.writeText(link)
        }catch(error){
            console.log(error)
            alert("failed to copy")
        }
    } 
    function loadPage(){
        socket.emit(EVENTS.VIEW_ROOM,roomId)
    }

    function joinRoom(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        if(!name) return
        socket.emit(EVENTS.JOIN_ROOM,roomId,name)
    }

    function begin(){
        socket.emit(EVENTS.SET_GAME,roomId)
    }
    useEffect(()=>{
        socket.on(EVENTS.SHOW_ROOM,(room:Room)=>{
            dispatch({type:EVENTS.SHOW_ROOM,room})
            
        })
        socket.on(EVENTS.SEE_OTHER_PLAYERS,(otherPlayers:Player[])=>{
            dispatch({type:EVENTS.SEE_OTHER_PLAYERS, otherPlayers})
        })

        socket.on(EVENTS.SEE_PLAYER,(player:Player)=>{
            dispatch({type:EVENTS.SEE_PLAYER, player})
        })

        socket.on(EVENTS.STARTING,()=>{
            dispatch({type:EVENTS.STARTING})
        })

        socket.on(EVENTS.NO_ROOM,()=>{
            alert("Room closed or doesnt exist")
            router.push('/')
        })

        socket.on(EVENTS.BEGIN,(id:string)=>{
            router.push(`/play/${roomId}`)
        })

        socket.on(EVENTS.HAS_GAME,()=>{
            alert("Game started Without You, Sad Shii")
            router.push('/')
        })

        socket.on(EVENTS.QUESTIONS_ERROR,()=>{
            alert("Error fetching Questions")
            router.push('/')
        })
        loadPage()

        return ()=>{
            socket.off(EVENTS.SHOW_ROOM)
            socket.off(EVENTS.NO_ROOM)
            socket.off(EVENTS.SEE_OTHER_PLAYERS)
            socket.off(EVENTS.BEGIN)
            socket.off(EVENTS.STARTING)
        }
    },[])
    if(loadingRoom)return <div></div>
    return (
        <div className="flex items-center h-full border sm:px-40 md:px-65 lg:px-90">
            <div className="p-7 border border-gray-400 w-full">
                <div className="text-gray-400 cursor-pointer flex items-center gap-1"><ArrowLeft size="1em"/> Leave Game</div>
                <div className="flex flex-col items-center gap-3">
                    <LogoImage h={35} w={35}/>
                    <CategoryTitle name={roomInfo?.category as string}/>
                    
                    <div className="w-full rounded-xl border border-gray-300 flex justify-center gap-4 p-1 text-gray-400 items-center h-12.5">
                        <span className="overflow-x-hidden">{link}</span>
                        <ClipboardCopyIcon size="1.25em" className="cursor-pointer" onClick={copyLink}/>
                    </div>

                    <div
                        onClick={copyLink} 
                        className="w-full rounded-xl border cursor-pointer border-gray-300 h-12.5 p-2 flex justify-center items-center gap-4 text-primary">
                        <Link2 size="1em"/> Invite Players
                    </div>

                    {otherPlayers.length>0?
                        <div className="flex flex-col gap-3 w-full">
                            <div className="text-gray-400">Players</div>
                            {
                                otherPlayers.map((player)=>{
                                    return <div key={player.id} className="w-full rounded-lg flex items-center gap-1.5 py-2 px-4 bg-gray-800 text-gray-200">{player.name} {player.leader?<CrownIcon size="1em"/>:""}</div>
                                })
                            }
                            {
                                <Button onClick={begin} disabled={startingGame||!player?.leader} className="w-full">
                                    {
                                        startingGame?
                                            "Starting..."
                                        :player?.leader?
                                            otherPlayers.length>1?
                                                "Start"
                                            :
                                                <span className="flex gap-1.5 items-center">Play Solo <ArrowRight size="1em"/></span>
                                        :
                                            "Waiting for host..."
                                    }
                                </Button>
                            }
                        </div>
                    :
                        <form className="w-full flex justify-between space-x-1" onSubmit={joinRoom}>
                            <Input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Input your name...." />
                            <Button type="submit">Join</Button>
                        </form>
                    }

                    
                </div>
                
            </div>
        </div>
    )
}