import { Server, Socket } from "socket.io";
import { rooms } from "../rooms";
import { checkAnswers, startAutoSubmitTimer } from "../functions/serverFunctions";
import EVENTS from "@/globals/constants/events";
import { isMemberOfRoom, transformObject } from "../functions/utils";

export default function questionHandlers(io:Server,socket:Socket){
    const {clientId}=socket.handshake.auth as {clientId:string}
    socket.on(EVENTS.GET_QUESTION,(id:string)=>{
        const room=rooms.get(id)
        if(!room){
            socket.emit(EVENTS.NO_ROOM)
            return
        }
        if(!isMemberOfRoom(room,clientId)){
            socket.emit(EVENTS.NOT_MEMBER)
            return
        }
        if(room.game){
            if(room.game.finished){
                const scores=transformObject(room.game.scores)
                socket.emit(EVENTS.RECEIVE_FINAL_SCORES,scores)
                return
            }
            const {answer,answers,explanation,...question}=room.game.currentQuestion
            socket.emit(EVENTS.RECEIVE_QUESTION,{...question,category:room.category})
            socket.emit(EVENTS.UPDATE_SCORE,transformObject(room.game.scores))
        }   
    })

    socket.on(EVENTS.SUBMIT_ANSWER,async (id:string,answer:string)=>{
        const room=rooms.get(id)
        if(room?.game){
            const player=room.players.find((player)=>player.id===clientId) as Player
            const alreadyAnsweredBSM=room.game.currentQuestion.answers.some((item)=>item.player.id===player.id)
            if(alreadyAnsweredBSM)return
            room.game.currentQuestion.answers.push({player,answer})
            room.game.waitingPlayers=room.game.waitingPlayers.filter((_player)=>_player.id!==player.id)
            
            //BASICALLY IF EVERYONES SUBMITTED AN ANSWER
            if(room.game.waitingPlayers.length===0){
                //CLEAR AUTO SUBMIT TIMEOUT IF THERE IS ONE
                if(room.questionSubmitTimeOut){
                    clearTimeout(room.questionSubmitTimeOut)
                    room.questionSubmitTimeOut=null
                } 
                checkAnswers(io,room)
            }else{
                //EMIT WAITING EVENT TO ALL MEMBERS WHO HAVE ANSWERED.
                const socketsInRoom=await io.in(room.id).fetchSockets()
                socketsInRoom.forEach((socket)=>{
                    const clientId=socket.handshake.auth.clientId as string
                    const currentlyWaiting=room.game?.waitingPlayers.some((player)=>player.id===clientId)
                    if(!currentlyWaiting){
                        socket.emit(EVENTS.WAITING,room.game?.waitingPlayers)
                    }
                })
                startAutoSubmitTimer(io,room)
                io.to(room.id).emit(EVENTS.SUBMIT_TIMER,room.countdownStartTimeStamp,room.countdownDuration)
            }
        }
    })

}