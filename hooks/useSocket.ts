"use client"
import {io,Socket} from "socket.io-client"
let socket:Socket|null=null

function getClientId() {
    if (typeof window === "undefined") return // safe fallback
    let clientId = localStorage.getItem("clientId");
    if (!clientId) {
        clientId = crypto.randomUUID();
        localStorage.setItem("clientId", clientId);
    }
    return clientId;
}
export function useSocket(){
    const clientId=getClientId() as string

    if(!socket){
        socket=io("",{
            auth:{clientId}
        })
    }
    return socket
}