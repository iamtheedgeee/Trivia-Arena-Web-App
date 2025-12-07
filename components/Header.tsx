"use client"
import { AUTH_OPTIONS } from "@/app/api/auth/[...nextauth]/route"
import {useSession,signOut} from "next-auth/react"
export default function Header(){
    const {data:session,status}=useSession()

    if(status==="loading") return <div>Loading....</div>

    if(!session) return <></>
    return(
        <div className="text-center font-bold text-2xl text-blue-500 hover:text-blue-700 cursor-pointer" onClick={()=>{signOut()}}>Welcome to Online Trivia Arena Mr {session?.user.username}</div>
    )

}