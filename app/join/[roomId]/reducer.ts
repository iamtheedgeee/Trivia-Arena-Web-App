import EVENTS from "@/globals/constants/events";

export interface State{
    loadingRoom: boolean;
    startingGame: boolean;
    roomInfo:Room|null;
    otherPlayers:Player[];
    player:Player|null;
}
export const initialState:State={
    loadingRoom:true,
    startingGame:false,
    roomInfo:null,
    otherPlayers:[],
    player:null
}
type Action=
    |{type: typeof EVENTS.SHOW_ROOM, room:Room}
    |{type: typeof EVENTS.SEE_OTHER_PLAYERS, otherPlayers:Player[]}
    |{type: typeof EVENTS.SEE_PLAYER, player:Player}
    |{type: typeof EVENTS.STARTING}

type Reducer=(state:State,action:Action)=>State
export const reducer:Reducer=(state,action)=>{
    switch(action.type){
        case EVENTS.SHOW_ROOM:
            return {
                ...state,
                roomInfo:action.room,
                loadingRoom:false
            }
        case EVENTS.SEE_OTHER_PLAYERS:
            return{
                ...state,
                otherPlayers:action.otherPlayers
            }
        case EVENTS.SEE_PLAYER:
            return {
                ...state,
                player:action.player
            }
        case EVENTS.STARTING:
            return{
                ...state,
                startingGame:true
            }
        default:
            return state
    }
}