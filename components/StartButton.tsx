"use client"
import { randomAlphaString } from "@/lib/utils";
import { Button } from "./ui/button"
import {useRouter} from "next/navigation"
import EVENTS from "@/globals/constants/events";
import { useSocketContext } from "@/hooks/SocketContext";
import {ArrowRight} from "lucide-react"
interface Room{
    category:string;
    roomId:string;
}
export default function StartButton({category}:{category:string}){
    const router=useRouter()
    const {socket}=useSocketContext()
    async function start(){
        const roomObject:Room={
            category,
            roomId:randomAlphaString()
        }
        socket.emit(EVENTS.CREATE_ROOM,roomObject)
        router.push(`/join/${roomObject.roomId}`)
    }
    return <Button onClick={start} className="font-bold w-fit">Play <ArrowRight/></Button>
}