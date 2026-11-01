import type { AnswerRequest, AnswerResponse, Transcript, TranscriptItem } from "../types/interviews.types";

/**
 * The thread after a successful answer, built from the request and response so no GET is needed: the answer (and the
 * reaction, when the interviewer moved on) go right after the answered question, then the next question (if any).
 * A follow-up turn has no reaction. Each line carries its question's position, kind and main number, as the
 * transcript returns them. The answer item gets a client id (the response doesn't return the stored one); a later
 * refetch replaces it with the real one.
 */
export function appendAnswerTurn(
  transcript: Transcript | undefined,
  { question_id, answer }: AnswerRequest,
  { reaction, current_question }: AnswerResponse,
): Transcript | undefined {
  if (!transcript || transcript.items.some((item) => item.kind === "answer" && item.question_id === question_id)) {
    return transcript;
  }
  const index = transcript.items.findIndex((item) => item.kind === "question" && item.question_id === question_id);
  if (index === -1) {
    return transcript;
  }
  const { position, question_kind, main_number } = transcript.items[index];
  const ofQuestion = { question_id, position, question_kind, main_number, created_at: null };

  const turn: TranscriptItem[] = [
    { ...ofQuestion, id: `${question_id}-answer`, role: "candidate", kind: "answer", text: answer },
  ];
  if (reaction) {
    turn.push({ ...ofQuestion, id: reaction.id, role: "interviewer", kind: "reaction", text: reaction.text });
  }
  if (current_question) {
    turn.push({
      id: current_question.id,
      question_id: current_question.id,
      position: current_question.position,
      question_kind: current_question.question_kind,
      main_number: current_question.main_number,
      role: "interviewer",
      kind: "question",
      text: current_question.text,
      created_at: null,
    });
  }

  return { items: [...transcript.items.slice(0, index + 1), ...turn, ...transcript.items.slice(index + 1)] };
}
