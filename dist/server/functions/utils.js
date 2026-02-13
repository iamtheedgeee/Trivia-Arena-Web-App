export function isMemberOfRoom(room, client) {
    const isMember = room.players.some((player) => player.id === client);
    return isMember;
}
export function transformObject(obj) {
    const scores = [];
    for (let score in obj) {
        scores.push({
            player: obj[score].player,
            points: obj[score].points
        });
    }
    return scores;
}
