import { Server, Socket } from "socket.io"
import { rooms } from "../rooms.js"
import { getDummyQuestions, getQuestions } from "../functions/apiFunctions.js"
import EVENTS from "../../globals/constants/events.js"
import { transformObject } from "../functions/utils.js"
export default function GameHandlers(io:Server,socket:Socket){
    const {clientId}=socket.handshake.auth as {clientId:string}
    socket.on(EVENTS.SET_GAME,async (id:string)=>{
        const room=rooms.get(id)
        if(!room)return
        if(room.hostId===clientId){
            room.started=true
            io.to(room.id).emit(EVENTS.STARTING)
            let questions:Question[]
            try{
                questions= await getQuestions(room.category)
            }catch(error){
                if(error instanceof Error) io.to(room.id).emit(EVENTS.QUESTIONS_ERROR,error.message)
                return
            }
            const scores:Scores={}
            room.players.forEach((player)=>{
                scores[player.id]={
                    player,
                    points:0
                }
            })
            const game:Game={
                category:room.category,
                questions,
                index:0,
                currentQuestion:questions[0],
                waitingPlayers:room.players,
                scores,
                finished:false,
            }
            room.game=game
            io.to(room.id).emit(EVENTS.BEGIN,room.id)
        }
    })

    socket.on(EVENTS.GET_FINAL_SCORES,(id:string)=>{
        const room=rooms.get(id)
        if(!room?.game)return

        //Transforming Score Prop-bject into an array for easy rendering
        const scores=transformObject(room.game.scores)
        socket.emit(EVENTS.RECEIVE_FINAL_SCORES,scores)
    })

}