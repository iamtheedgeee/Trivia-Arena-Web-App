import { rooms } from "../rooms.js";
import { getQuestions } from "../functions/apiFunctions.js";
import EVENTS from "../../globals/constants/events.js";
import { transformObject } from "../functions/utils.js";
export default function GameHandlers(io, socket) {
    const { clientId } = socket.handshake.auth;
    socket.on(EVENTS.SET_GAME, async (id) => {
        const room = rooms.get(id);
        if (!room)
            return;
        if (room.hostId === clientId) {
            room.started = true;
            io.to(room.id).emit(EVENTS.STARTING);
            let questions;
            try {
                questions = await getQuestions(room.category);
            }
            catch (error) {
                if (error instanceof Error)
                    io.to(room.id).emit(EVENTS.QUESTIONS_ERROR, error.message);
                return;
            }
            const scores = {};
            room.players.forEach((player) => {
                scores[player.id] = {
                    player,
                    points: 0
                };
            });
            const game = {
                category: room.category,
                questions,
                index: 0,
                currentQuestion: questions[0],
                waitingPlayers: room.players,
                scores,
                finished: false,
            };
            room.game = game;
            io.to(room.id).emit(EVENTS.BEGIN, room.id);
        }
    });
    socket.on(EVENTS.GET_FINAL_SCORES, (id) => {
        const room = rooms.get(id);
        if (!(room === null || room === void 0 ? void 0 : room.game))
            return;
        //Transforming Score Prop-bject into an array for easy rendering
        const scores = transformObject(room.game.scores);
        socket.emit(EVENTS.RECEIVE_FINAL_SCORES, scores);
    });
}
