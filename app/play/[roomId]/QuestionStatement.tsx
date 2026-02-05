import { Question } from "./reducer";

export default function QuestionStatement({question}:{question:Question}){
    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex">
                <div className="p-1.5 bg-gray-900 rounded-tl-md rounded-bl-md text-white">{`Q${question!.sn}`}</div>
                <div className="p-1.5 bg-gray-700 text-primary rounded-tr-md rounded-br-md">{question!.category}</div>
            </div>
            <div className="w-full">{question.question}</div>
        </div>
    )
}