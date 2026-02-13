import { rooms } from "../rooms.js";
import EVENTS from "../../globals/constants/events.js";
export default function roomHandlers(io, socket) {
    const { clientId } = socket.handshake.auth;
    //CREATE ROOM
    socket.on(EVENTS.CREATE_ROOM, ({ category, roomId }) => {
        rooms.set(roomId, {
            id: roomId,
            category,
            players: [],
            hostId: clientId,
            started: false,
            countdownStartTimeStamp: null,
            countdownDuration: 15000,
            questionSubmitTimeOut: null,
        });
    });
    //SHOW ROOM
    socket.on(EVENTS.VIEW_ROOM, (id) => {
        const room = rooms.get(id);
        if (room) {
            socket.emit(EVENTS.SHOW_ROOM, room);
            //CHECK IF PLAYER IS ALREADY A MEMBER OF THE ROOM
            const player = room.players.find((player) => player.id === clientId);
            if (player) {
                socket.emit(EVENTS.SEE_OTHER_PLAYERS, room.players);
                socket.emit(EVENTS.SEE_PLAYER, player);
            }
        }
        else {
            socket.emit(EVENTS.NO_ROOM);
        }
    });
    //JOIN ROOM
    socket.on(EVENTS.JOIN_ROOM, (id, name) => {
        const room = rooms.get(id);
        if (!room) {
            socket.emit(EVENTS.NO_ROOM);
            return;
        }
        else if (room.started) {
            socket.emit(EVENTS.HAS_GAME);
        }
        const player = Object.assign({ name, id: clientId }, (room.hostId === clientId && { leader: true }));
        room.players.push(player);
        socket.join(room.id);
        io.to(room.id).emit(EVENTS.SEE_OTHER_PLAYERS, room.players);
        socket.emit(EVENTS.SEE_PLAYER, player);
    });
}
