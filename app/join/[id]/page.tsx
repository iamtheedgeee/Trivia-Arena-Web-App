"use client"
import {useRouter} from "next/navigation"
import { getSocket } from "@/lib/socket";
import {useState,useEffect, useRef} from "react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
interface JoinPageProps{
    params:{
        id:string;
    }
}

interface Member{
    name:string;
    id:string;
    leader?:boolean;
}
interface RoomProperties{
    id:string;
    category:string;
    members:Member[];
    hostId:string;


}
export default function Join({params}:JoinPageProps){
    const [loading,setLoading]=useState(true)
    const [starting,setStarting]=useState(false)
    const [info,setInfo]=useState<RoomProperties>()
    const [members,setMembers]=useState<Member[]>([])
    const [name,setName]=useState("")
    const [player,setPlayer]=useState<Member>()
    const roomId=useRef<string|null>(null)
    const router=useRouter()
    
    async function loadPage(){
        const socket=getSocket()
        const {id}=await params
        roomId.current=id
        socket.emit("viewRoom",roomId.current)
    }

    function joinRoom(){
        const socket=getSocket()
        console.log("joining",roomId.current)
        socket.emit("joinRoom",roomId.current,name)
    }

    function begin(){
        const socket=getSocket()
        console.log("starting",roomId.current)
        socket.emit("startGame",roomId.current)
    }
    useEffect(()=>{
        const socket=getSocket()
        loadPage()

        socket.on("showRoom",(room:RoomProperties)=>{
            setInfo(room)
            setLoading(false)
        })

        socket.on("noRoom",()=>{
            alert("Room closed or doesnt exist")
            router.push('/')
        })

        socket.on("seeMembers",(roomMembers:Member[])=>{
            setMembers(roomMembers)
        })

        socket.on("seePlayer",(self:Member)=>{
            setPlayer(self)
        })

        socket.on("starting",()=>{
            setStarting(true)
        })
        socket.on("begin",(id:string)=>{
            console.log("beginning",roomId.current)
            router.push(`/play/${roomId.current}`)
        })

        return ()=>{
            socket.off("showRoom")
            socket.off("noRoom")
            socket.off("seeMembers")
            socket.off("begin")
            socket.off("starting")
        }
    },[])

    if(loading)return <div>loading</div>
    return (
        <div>
            <div>{info?.id}</div>
            <div>{info?.category}</div>
            
            {members.length>0?
            <div>
                <ul>
                    {members.map((member)=>{
                        return <li key={member.id} className={member.leader?"text-blue-400":""}>{member.name}</li>
                    })}
                </ul>
                {
                    starting?
                        <div>starting........</div>
                    :
                        (player?.leader?
                            <Button onClick={begin}>Start</Button>
                        :
                            <div>Waiting for host.....</div>
                        )
                }
            </div>
            :
                    <>
                        <Input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
                        <Button onClick={joinRoom}>Join</Button>
                    </>
            }
        </div>
    )
}