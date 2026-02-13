import { Server } from "socket.io"
import { dummyJudge, judgeAnswers } from "./apiFunctions.js"
import EVENTS from "../../globals/constants/events.js"
import { transformObject } from "./utils.js"

export const startAutoSubmitTimer=(io:Server,room:Room)=>{
    room.countdownStartTimeStamp=Date.now()
    room.questionSubmitTimeOut=setTimeout(()=>{
        room.game?.waitingPlayers.forEach((player)=>{
            room.game?.currentQuestion.answers.push({player,answer:"Timed Out"})
        })
        checkAnswers(io,room)
        clearTimeout(room.questionSubmitTimeOut!)
        room.questionSubmitTimeOut=null

    },room.countdownDuration)
}

export const updateScore=(room:Room,verdict:Verdict[])=>{
    console.log("updating scores")
    verdict.forEach((verdict)=>{
        if(verdict.verdict.correct){
            room.game!.scores[verdict.player.id].points+=1
        }
    })
}

export const checkAnswers=async (io:Server,room:Room)=>{
    console.log(room.game?.currentQuestion)
    io.to(room.id).emit(EVENTS.CHECKING)
    if(!room.game)return
    let verdict:Verdict[]
    try{
        verdict=await judgeAnswers(room.game.currentQuestion,room.category)
    }catch(error){
        if(error instanceof Error){
            io.to(room.id).emit(EVENTS.ANSWER_CHECK_ERROR,error.message)
            room.game.waitingPlayers=room.players
            room.game.currentQuestion.answers=[]        
        }
            return
    }
    updateScore(room,verdict)
    //Compiling results innocently and peacefully
    const results:Results={
        verdict,
        answer:room.game.currentQuestion.answer,
        explanation:room.game.currentQuestion.explanation
    }
    
    
    //checking for last question
    if(room.game.index+1===room.game.questions.length)(
        io.to(room.id).emit(EVENTS.LAST_QUESTION)
    )

    //Reseting for next round
    let index=room.game.index+1
    if(index>=room.game.questions.length){
        index-=1
        room.game.finished=true  

    }
    const currentQuestion=room.game.questions[index]
    room.game.index=index
    room.game.currentQuestion=currentQuestion
    room.game.waitingPlayers=room.players

    //Emit results back to the ever patient clients
    io.to(room.id).emit(EVENTS.RECEIVE_VERDICT,results)
    io.to(room.id).emit(EVENTS.UPDATE_SCORE,transformObject(room.game.scores))

}