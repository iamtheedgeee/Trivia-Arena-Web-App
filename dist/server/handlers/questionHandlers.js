var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { rooms } from "../rooms.js";
import { checkAnswers, startAutoSubmitTimer } from "../functions/serverFunctions.js";
import EVENTS from "../../globals/constants/events.js";
import { isMemberOfRoom, transformObject } from "../functions/utils.js";
export default function questionHandlers(io, socket) {
    const { clientId } = socket.handshake.auth;
    socket.on(EVENTS.GET_QUESTION, (id) => {
        const room = rooms.get(id);
        if (!room) {
            socket.emit(EVENTS.NO_ROOM);
            return;
        }
        if (!isMemberOfRoom(room, clientId)) {
            socket.emit(EVENTS.NOT_MEMBER);
            return;
        }
        if (room.game) {
            if (room.game.finished) {
                const scores = transformObject(room.game.scores);
                socket.emit(EVENTS.RECEIVE_FINAL_SCORES, scores);
                return;
            }
            const _a = room.game.currentQuestion, { answer, answers, explanation } = _a, question = __rest(_a, ["answer", "answers", "explanation"]);
            socket.emit(EVENTS.RECEIVE_QUESTION, Object.assign(Object.assign({}, question), { category: room.category }));
            socket.emit(EVENTS.UPDATE_SCORE, transformObject(room.game.scores));
        }
    });
    socket.on(EVENTS.SUBMIT_ANSWER, async (id, answer) => {
        const room = rooms.get(id);
        if (room === null || room === void 0 ? void 0 : room.game) {
            const player = room.players.find((player) => player.id === clientId);
            const alreadyAnsweredBSM = room.game.currentQuestion.answers.some((item) => item.player.id === player.id);
            if (alreadyAnsweredBSM)
                return;
            room.game.currentQuestion.answers.push({ player, answer });
            room.game.waitingPlayers = room.game.waitingPlayers.filter((_player) => _player.id !== player.id);
            //BASICALLY IF EVERYONES SUBMITTED AN ANSWER
            if (room.game.waitingPlayers.length === 0) {
                //CLEAR AUTO SUBMIT TIMEOUT IF THERE IS ONE
                if (room.questionSubmitTimeOut) {
                    clearTimeout(room.questionSubmitTimeOut);
                    room.questionSubmitTimeOut = null;
                }
                checkAnswers(io, room);
            }
            else {
                //EMIT WAITING EVENT TO ALL MEMBERS WHO HAVE ANSWERED.
                const socketsInRoom = await io.in(room.id).fetchSockets();
                socketsInRoom.forEach((socket) => {
                    var _a, _b;
                    const clientId = socket.handshake.auth.clientId;
                    const currentlyWaiting = (_a = room.game) === null || _a === void 0 ? void 0 : _a.waitingPlayers.some((player) => player.id === clientId);
                    if (!currentlyWaiting) {
                        socket.emit(EVENTS.WAITING, (_b = room.game) === null || _b === void 0 ? void 0 : _b.waitingPlayers);
                    }
                });
                startAutoSubmitTimer(io, room);
                io.to(room.id).emit(EVENTS.SUBMIT_TIMER, room.countdownStartTimeStamp, room.countdownDuration);
            }
        }
    });
}
