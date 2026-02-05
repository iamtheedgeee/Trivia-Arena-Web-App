import "./dotenvSetup"
import { createServer} from "http"
import { Server } from "socket.io"
import next from "next"
import prisma from "@/lib/prisma"

import roomHandlers from "./handlers/roomHandlers"
import gameHandlers from "./handlers/gameHandlers"
import questionHandlers from "./handlers/questionHandlers"
import { rooms } from "./rooms"
import { isMemberOfRoom } from "./functions/utils"
import EVENTS from "@/globals/constants/events"
const dev= process.env.NODE_ENV!="production"
const app=next({dev})
const handle= app.getRequestHandler()
const PORT= process.env.PORT || 3000


async function startServer(){
    //Preparing Nextjs Application
    await app.prepare()

    //Creating HTTP Server
    const server= createServer((req,res)=>{
        //Directing Request to Nextjs Handlers
        handle(req,res)
    })

    //Creating Socket.io Server
    const io=new Server(server)

    //Connection Block
    io.on("connection",(socket)=>{
        //Mandatory Console log for my peace of Mind
        console.log(socket.id)
        const clientId=socket.handshake.auth.clientId as string

        //Sync Server and Client Timers
        socket.emit(EVENTS.SET_TIME_OFFSET,Date.now())
        //Rejoin Any room one may have been disconnected from.My genius suprises even myself at times
        rooms.forEach((room)=>{
            if(isMemberOfRoom(room,clientId)){
                console.log("member")
                socket.join(room.id)
                if(room.questionSubmitTimeOut){
                    socket.emit(EVENTS.SUBMIT_TIMER,room.countdownStartTimeStamp,room.countdownDuration)
                }
            }
        })
        console.log(`User ${clientId} connected`)
        
        //Assigning Various Handlers
        roomHandlers(io,socket)
        gameHandlers(io,socket)
        questionHandlers(io,socket)
 
        socket.on("disconnect",()=>{
            console.log(`User ${clientId} disconnected`)
        })
    })
    
    try{
        await prisma.$connect()
    }catch(error){
        console.log(error)
        return
    }
    server.listen(PORT,()=>{
        console.log(`> Server running on http://localhost:${PORT}`)
    })

}


startServer()



