const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions
) => `You are an AI trained to generate technical interview questions and answers.

Task:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${topicsToFocus}
- Write ${numberOfQuestions} interview questions.
- For each question, generate a clear and beginner-friendly answer.
- If the answer needs a code example, include a small code block.
- Keep formatting concise and professional.
- Return ONLY a valid JSON array. Do not include any text outside JSON.

[
  {
    "question": "Question here?",
    "answer": "Answer here."
  }
]`;

const conceptExplainPrompt = (question) => `You are an AI trained to generate explanations for a given interview question.

Task:
- Explain the following interview question and its concept in depth as if teaching a beginner developer.
- Question: "${question}"
- After the explanation, provide a short and clear title that summarizes the concept.
- If the explanation needs a code example, include a small code block.
- Keep formatting concise and professional.
- Return ONLY a valid JSON object. Do not include any text outside JSON.

{
  "title": "Short title here?",
  "explanation": "Explanation here."
}`;

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
