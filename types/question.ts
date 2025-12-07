import {z} from "zod"

const MultiChoiceQuestionSchema=z.object({
    sn:z.number(),
    question:z.string(),
    a:z.string(),
    b:z.string(),
    c:z.string(),
    d:z.string(),
    answer:z.string(),
    explanation:z.string(),
})
export const MultipleChoiceListSchema=z.array(MultiChoiceQuestionSchema)

const FreeResponseQuestionSchema=z.object({
    sn:z.number(),
    question:z.string(),
    answer:z.string(),
    explanation:z.string(),
})

export const AnswerCheckSchema=z.object({
    correct:z.boolean()
})
export const FreeResponseListSchema=z.array(FreeResponseQuestionSchema)
export interface FreeResponseQuestion extends z.infer<typeof FreeResponseQuestionSchema>{}
export interface MultipleChoiceQuestion extends z.infer<typeof MultiChoiceQuestionSchema>{}
export interface answerDisplay{
    explanation:string;
    answer:string;
    givenAnswer:string;
    correct:boolean;
    next:()=>void;

}