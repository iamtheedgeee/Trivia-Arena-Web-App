import { z } from "zod";
export const FreeResponseQuestionSchema = z.object({
    sn: z.number(),
    question: z.string(),
    answer: z.string(),
    explanation: z.string(),
});
export const AnswerCheckSchema = z.object({
    id: z.string(),
    correct: z.boolean(),
});
export const AnswerCheckList = z.array(AnswerCheckSchema);
export const FreeResponseListSchema = z.array(FreeResponseQuestionSchema);
