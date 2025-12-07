"use client"

import { randomAlphaString } from "@/lib/utils";
import { Button } from "./ui/button"
import { getSocket } from "@/lib/socket";
import {useRouter} from "next/navigation"
interface Room{
    category:string;
    roomId:string;
}
export default function StartButton({category}:{category:string}){
    const router=useRouter()
    async function start(){
        const roomObject:Room={
            category,
            roomId:randomAlphaString()
        }
        const socket=getSocket()
        socket.emit("createRoom",roomObject)
        router.push(`/join/${roomObject.roomId}`)
    }
    return <Button onClick={start}>Start</Button>
}