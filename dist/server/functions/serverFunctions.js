import { judgeAnswers } from "./apiFunctions.js";
import EVENTS from "../../globals/constants/events.js";
import { transformObject } from "./utils.js";
export const startAutoSubmitTimer = (io, room) => {
    room.countdownStartTimeStamp = Date.now();
    room.questionSubmitTimeOut = setTimeout(() => {
        var _a;
        (_a = room.game) === null || _a === void 0 ? void 0 : _a.waitingPlayers.forEach((player) => {
            var _a;
            (_a = room.game) === null || _a === void 0 ? void 0 : _a.currentQuestion.answers.push({ player, answer: "Timed Out" });
        });
        checkAnswers(io, room);
        clearTimeout(room.questionSubmitTimeOut);
        room.questionSubmitTimeOut = null;
    }, room.countdownDuration);
};
export const updateScore = (room, verdict) => {
    console.log("updating scores");
    verdict.forEach((verdict) => {
        if (verdict.verdict.correct) {
            room.game.scores[verdict.player.id].points += 1;
        }
    });
};
export const checkAnswers = async (io, room) => {
    var _a;
    console.log((_a = room.game) === null || _a === void 0 ? void 0 : _a.currentQuestion);
    io.to(room.id).emit(EVENTS.CHECKING);
    if (!room.game)
        return;
    let verdict;
    try {
        verdict = await judgeAnswers(room.game.currentQuestion, room.category);
    }
    catch (error) {
        if (error instanceof Error) {
            io.to(room.id).emit(EVENTS.ANSWER_CHECK_ERROR, error.message);
            room.game.waitingPlayers = room.players;
            room.game.currentQuestion.answers = [];
        }
        return;
    }
    updateScore(room, verdict);
    //Compiling results innocently and peacefully
    const results = {
        verdict,
        answer: room.game.currentQuestion.answer,
        explanation: room.game.currentQuestion.explanation
    };
    //checking for last question
    if (room.game.index + 1 === room.game.questions.length)
        (io.to(room.id).emit(EVENTS.LAST_QUESTION));
    //Reseting for next round
    let index = room.game.index + 1;
    if (index >= room.game.questions.length) {
        index -= 1;
        room.game.finished = true;
    }
    const currentQuestion = room.game.questions[index];
    room.game.index = index;
    room.game.currentQuestion = currentQuestion;
    room.game.waitingPlayers = room.players;
    //Emit results back to the ever patient clients
    io.to(room.id).emit(EVENTS.RECEIVE_VERDICT, results);
    io.to(room.id).emit(EVENTS.UPDATE_SCORE, transformObject(room.game.scores));
};
