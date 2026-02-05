export function isMemberOfRoom(room:Room,client:string){
    const isMember=room.players.some((player)=>player.id===client)
    return isMember
}

export function transformObject(obj:Scores){
    const scores:{player:Player,points:number}[]=[]
        for(let score in obj){
            scores.push({
                player:obj[score].player,
                points:obj[score].points
            })
        }
    return scores
}