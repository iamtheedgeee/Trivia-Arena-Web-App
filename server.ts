import { createServer} from "http"
import EventEmitter from "events"
import { Server } from "socket.io"
import next from "next"


const dev= true//process.env.NODE_ENV!="production"
const app=next({dev})
const handle= app.getRequestHandler()
const PORT= process.env.PORT || 3000

interface Member{
    name:string;
    id:string;
    leader?:boolean;
}

interface Question{
    sn:number;
    question:string;
    answer:string;
    explanation:string;
    answers:{player:Member,answer:string}[];
}

interface Scores{
    [id:string]:{
        player:Member,
        points:number
    }
}

interface Game{
    category:string;
    questions:Question[];
    index:number;
    currentQuestion:Question;
    waitingMembers:Member[];
    scores:Scores;

}

interface RoomProperties{
    id:string;
    category:string;
    members:Member[];
    hostId:string;
    game?:Game;
}

interface Verdict{
    player:Member;
    verdict:{answer:string,correct:boolean}
}

interface Results{
    verdict:Verdict[];
    answer:string;
    explanation:string;
}

const rooms= new Map<string,RoomProperties>()

const getQuestions=async(category:string)=>{
    setTimeout(()=>{},2000)
    return [
            {sn:1,question:"Yolo",answer:"whooo",explanation:"wubba",answers:[]},
            {sn:2,question:"Molo",answer:"onye", explanation:"Wubba luba dub dub",answers:[]}
    ]
}

const checkAnswers=async(questions:Question)=>{
    setTimeout(()=>{},3000)
    const verdict:Verdict[]=[]
    questions.answers.forEach((answerObj)=>{
        verdict.push({
            player:answerObj.player,
            verdict:{
                answer:answerObj.answer,
                correct:true
            }     
        })
        
    })
    return verdict
}


async function startServer(){
    await app.prepare()
    const server= createServer((req,res)=>{
        handle(req,res)
    })
    const io=new Server(server)
    const serverEvents=new EventEmitter()
    const FORCE_SUBMIT_TIME=10_000
    io.on("connection",(socket)=>{
        //MANDATORY FOR MY PEACE OF MIND
        console.log("A user connected:", socket.id)
        socket.emit("Welcome","Hello from the sevrer")
        socket.on("messageFromClient",(msg:string)=>{
            console.log("Recieved message from client",msg)
        })

        //MAIN LOGIC

        //----------creating room---------------
        socket.on("createRoom",({category,roomId})=>{
            rooms.set(roomId,{id:roomId,category,members:[],hostId:socket.id})
            console.log(rooms)
        })

        //----------showing room----------
        socket.on("viewRoom",(id:string)=>{
            const room=rooms.get(id)
            if(room){
                socket.emit("showRoom",room)
            }else{
                socket.emit("noRoom")
            }
        })

        //------------joining room...duhhh-----------
        socket.on("joinRoom",(id:string,name:string)=>{
            const room=rooms.get(id)
            if(!room)return
            const player:Member={name,id:socket.id,...(room.hostId===socket.id&&{leader:true})}
            room.members.push(player)
           
            socket.join(room?.id)
           
            io.to(room.id).emit("seeMembers",room.members)
            socket.emit("seePlayer",player)
        })

        //-----------------starting game-----------------
        socket.on("startGame",async (id:string)=>{
            const room=rooms.get(id)
            if(!room)return
            if(room.hostId===socket.id){
                io.to(room.id).emit("starting")
                //getQuestions here use try catch in case of errors
                const questions= await getQuestions(room.category)
                const scores:Scores={}
                room.members.forEach((player)=>{
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
                    waitingMembers:room.members,
                    scores
                }
                room.game=game
                io.to(room.id).emit("begin",room.id)
            }
        })

        socket.on("getQuestion",(id:string)=>{
            const room=rooms.get(id)
            if(room?.game){
                const {answer,answers,explanation,...question}=room.game.currentQuestion
                socket.emit("recieveQuestion",question)
            }   
        })

        socket.on("submitAnswer",(id:string,answer:string)=>{
            const room=rooms.get(id)
            if(room?.game){
                const player=room.members.find((member)=>member.id===socket.id) as Member
                const alreadyAnsweredBSM=room.game.currentQuestion.answers.some((item)=>item.player.id===player.id)
                if(alreadyAnsweredBSM)return
                room.game.currentQuestion.answers.push({player,answer})
                room.game.waitingMembers=room.game.waitingMembers.filter((_player)=>_player.id!==player.id)
                
                if (room.game.waitingMembers.length===0){
                    serverEvents.emit("checkAnswers",room)
                }else{
                    socket.emit("waiting",room.game.waitingMembers)
                }
            }
        })

        socket.on("getFinalScores",(id:string)=>{
            const room=rooms.get(id)
            if(!room?.game)return
            console.log(room.game.scores)

            //Transforming Score Prop-bject into an array for easy rendering
            const scores:{player:Member,points:number}[]=[]
            for(let score in room.game.scores){
                scores.push({
                    player:room.game.scores[score].player,
                    points:room.game.scores[score].points
                })
            }
            socket.emit("recieveFinalScores",scores)
        })
        //MANDATORY FOR MY PEACE OF MIND
        socket.on("disconnect",()=>{
            console.log("User disconnected",socket.id)
        })
    })
    /*serverEvents.on("setSubmitTimer",(room:RoomProperties)=>{
        setTimeout(()=>{
            for(let player of room.game!.waitingMembers){
                room.game?.currentQuestion.answers.push({player,answer:"judged late"})
            }
            serverEvents.emit("checkAnswers",room)    
        },FORCE_SUBMIT_TIME)
        
    })*/
    serverEvents.on("updateScore",(room:RoomProperties,verdict:Verdict[])=>{
        verdict.forEach((verdict)=>{
            if(verdict.verdict.correct){
                room.game!.scores[verdict.player.id].points+=1
            }
        })
        console.log("scores",room.game?.scores)
    })
    serverEvents.on("checkAnswers",async (room:RoomProperties)=>{
        io.to(room.id).emit("checking")
        //use try catch here of course
        if(!room.game)return
        const verdict=await checkAnswers(room.game.currentQuestion)
        serverEvents.emit("updateScore",room,verdict)
        //Compiling results innocently and peacefully
        const results:Results={
            verdict,
            answer:room.game.currentQuestion.answer,
            explanation:room.game.currentQuestion.explanation
        }
        
        //Reseting for next round
        //checking for last question
        if(room.game.index+1===room.game.questions.length)(
            io.to(room.id).emit("lastQuestion")
        )
        let index=room.game.index+1
        if(index>=room.game.questions.length){
            index-=1  

        }
        const currentQuestion=room.game.questions[index]
        room.game.index=index
        room.game.currentQuestion=currentQuestion
        room.game.waitingMembers=room.members

        //Emit results back to the ever patient clients
        io.to(room.id).emit("recieveVerdict",results)
    })

    server.listen(PORT,()=>{
        console.log(`> Server running on http://localhost:${PORT}`)
    })

}


startServer()



