export const formatQuestionCount = (count: number) => `${count} ${count === 1 ? "question" : "questions"}`;

export const formatQuestionPosition = (position: number, total: number) => `Question ${position} of ${total}`;
