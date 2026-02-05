"use client"
import {createContext,useContext,useState,useEffect} from "react"
import { Socket,io } from "socket.io-client"
import { useSocket } from "./useSocket";
import EVENTS from "@/globals/constants/events";

interface SocketContextProperties{
    timeOffset:number|null;  
    socket:Socket;
}

const SocketContext=createContext<SocketContextProperties|null>(null)
const socket=useSocket()
export default function SocketProvider({children}:{children:React.ReactNode}){
    const [timeOffset,setTimeOffset]=useState<number|null>(null)

    useEffect(()=>{
        socket.on("connect",()=>{
            console.log("I am connected")
        })
        socket.on(EVENTS.SET_TIME_OFFSET,(serverNow:number)=>{
            const clientNow=Date.now()
            setTimeOffset(serverNow-clientNow)
            console.log("offset",serverNow-clientNow)
        })
        console.log("end of useEffect")
        return(()=>{
            console.log("unmounting")
            socket.off(EVENTS.SET_TIME_OFFSET)
            socket.disconnect()
        })
    },[])

    const value={timeOffset,socket}

    return(
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocketContext(){
    const context=useContext(SocketContext)
    if(!context) throw new Error("No context: Socket")
    return context
}