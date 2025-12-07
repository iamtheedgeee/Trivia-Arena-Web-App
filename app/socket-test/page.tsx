"use client"
import { getSocket } from "@/lib/socket"
import {useEffect,useState} from "react"
export default function SocketTest(){
    useEffect(()=>{
        const socket=getSocket()
        socket.on("Welcome",(msg:string)=>{
            console.log(msg)
        })
    },[])
    return <>
        <div>Well Hello you amazing beautiful people welcome to the socket test page....good luck with this and that hehe</div>
    </>
}