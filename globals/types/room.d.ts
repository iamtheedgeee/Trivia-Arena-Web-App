//Player Object|Member of Rooms
interface Player{
    name:string;
    id:string;
    leader?:boolean;
}

//Answer Object|Answer to a Question including the PLayer Object and Given Answer
interface Answer{
    player:Player;
    answer:string;
}

//Question Object| Self Explanatory| Belongs 
interface Question{
    sn:number;
    question:string;
    answer:string;
    explanation:string;
    answers:Answer[];
}

//Game Object| Holds info About the Game being Played in a Room
interface Game{
    category:string;
    questions:Question[];
    index:number;
    currentQuestion:Question;
    waitingPlayers:Player[];
    scores:Scores;
    finished:boolean;
}

//Room Object
interface Room{
    id:string;
    category:string;
    players:Player[];
    hostId:string;
    started:boolean;
    game?:Game;
    countdownStartTimeStamp:number|null;
    countdownDuration:number;
    questionSubmitTimeOut:NodeJS.Timeout | null;
}

//Scores Object| Stored in a Game Object | Keeps track of Scores of Individual Players
interface Scores{
    [id:string]:{
        player:Player,
        points:number
    }
}

//Verdict Object| Judgment of Players Answers as Complied by The AI
interface Verdict{
    player:Player;
    verdict:{answer:string,correct:boolean}
}

//Results Object| Contains The Verdict Object alongside info about the Question| To be sent back to the Clients after each question
interface Results{
    verdict:Verdict[];
    answer:string;
    explanation:string;
}