import EVENTS from "@/globals/constants/events";
import { Socket } from "socket.io-client";

export interface Question{
    sn:string;
    question:string;
    category:string;
}

export interface Score{
    player:Player,
    points:number
}

export interface State{
    loading:boolean;
    question:Question|null;
    checking:boolean;
    waitingPlayers:Player[];
    submitted:boolean;
    completed:boolean;
    results:Results|null;
    scores:Score[];
    finished:boolean;
}

type Action=
    |{type:"NEXT"}
    |{type:"SUBMIT_ANSWER"}
    |{type: typeof EVENTS.RECEIVE_QUESTION, currentQuestion:Question}
    |{type: typeof EVENTS.CHECKING}
    |{type: typeof EVENTS.WAITING, waitingPlayers:Player[]}
    |{type: typeof EVENTS.RECEIVE_VERDICT, results:Results}
    |{type: typeof EVENTS.LAST_QUESTION}
    |{type: typeof EVENTS.RECEIVE_FINAL_SCORES, scores:Score[]}
    |{type: typeof EVENTS.UPDATE_SCORE, scores:Score[]}
    |{type: typeof EVENTS.ANSWER_CHECK_ERROR}
type Reducer=(state:State,action:Action)=>State

export const reducer:Reducer=(state,action)=>{
    switch(action.type){
        case "NEXT":
            return {
                ...state,
                results:null
            }
        case "SUBMIT_ANSWER":
            return {
                ...state,
                submitted:true
            }
        case EVENTS.RECEIVE_QUESTION:
            return{
                ...state,
                loading:false,
                question:action.currentQuestion,
                submitted:false
            }
        case EVENTS.CHECKING:
            return{
                ...state,
                waitingPlayers:[],
                checking:true
            }
        case EVENTS.ANSWER_CHECK_ERROR:
                return{
                    ...state,
                    checking:false,
                    submitted:false
                }
        case EVENTS.WAITING:
            return{
                ...state,
                waitingPlayers:action.waitingPlayers
            }
        case EVENTS.RECEIVE_VERDICT:
            return{
                ...state,
                results:action.results,
                checking:false
            }
        case EVENTS.UPDATE_SCORE:
            return{
                ...state,
                scores:action.scores
            }
        case EVENTS.LAST_QUESTION:
            return{
                ...state,
                completed:true
            }
        case EVENTS.RECEIVE_FINAL_SCORES:
            return{
                ...state,
                loading:false,
                scores:action.scores,
                finished:true
            }
        default:
            return state
    }
}
export const initialState:State={
    loading:true,
    question:null,
    checking:false,
    waitingPlayers:[],
    submitted:false,
    completed:false,
    results:null,
    scores:[],
    finished:false,
}