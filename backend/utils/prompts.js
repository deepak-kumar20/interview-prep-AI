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

const conceptExplainPrompt = (
  question
) => `You are an AI trained to generate explanations for a given interview question.

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

const assessmentInterviewPrompt = (
  role,
  experience,
  topicsToFocus,
  currentQuestionNumber,
  totalQuestions,
  previousQuestion = null,
  previousAnswer = null
) => {
  let contextText = "";
  if (previousQuestion && previousAnswer) {
    contextText = `

Previous Context:
- Previous Question: "${previousQuestion}"
- Student's Answer: "${previousAnswer}"

Based on the student's previous answer, you can either:
1. Ask a follow-up question to dive deeper into the same topic
2. Ask a new question on a different topic from the focus areas

Set "isFollowUp": true if this is a follow-up question, false otherwise.`;
  }

  return `You are an AI interviewer conducting a live technical interview for a ${role} position.

Interview Details:
- Role: ${role}
- Experience Level: ${experience}
- Focus Topics: ${topicsToFocus}
- Current Question: ${currentQuestionNumber} of ${totalQuestions}${contextText}

Task:
Generate ONE interview question that:
- Is appropriate for ${experience} level
- Tests knowledge in: ${topicsToFocus}
- Is clear and specific
- Can be answered in 1-2 minutes${
    previousAnswer ? "\n- Takes into account the student's previous answer" : ""
  }

Return ONLY a valid JSON object. Do not include any text outside JSON.

{
  "question": "Your interview question here?",
  "expectedAnswer": "Brief expected answer for evaluation purposes",
  "isFollowUp": ${previousAnswer ? "true or false" : "false"}
}`;
};

const assessmentEvaluationPrompt = (role, experience, questionsData) => {
  const questionsText = questionsData
    .map(
      (q, i) => `
Question ${i + 1}: ${q.question}
Student's Answer: ${q.studentAnswer || "No answer provided"}
Expected Answer: ${q.expectedAnswer}
Time Spent: ${q.timeSpent} seconds
`
    )
    .join("\n---\n");

  return `You are an AI evaluator assessing a technical interview for a ${role} position at ${experience} level.

Interview Data:
${questionsText}

Task:
Evaluate the student's performance across all questions and provide:

1. Individual Question Scores (0-10 for each)
2. Overall Scores:
   - Technical Score (0-100): Accuracy and depth of technical knowledge
   - Communication Score (0-100): Clarity and structure of answers
   - Problem Solving Score (0-100): Analytical thinking and approach
   - Overall Score (0-100): Weighted average of above scores

3. Analysis:
   - List 3-5 key strengths demonstrated
   - List 3-5 areas for improvement
   - Provide 3-5 specific recommendations for growth

4. Summary: 2-3 paragraph overall evaluation

Return ONLY a valid JSON object. Do not include any text outside JSON.

{
  "questions": [
    {
      "score": 8,
      "feedback": "Brief feedback for question 1"
    }
  ],
  "overallScore": 75,
  "technicalScore": 80,
  "communicationScore": 70,
  "problemSolvingScore": 75,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "summary": "Overall evaluation summary here"
}`;
};

const roadmapGeneratorPrompt = (role, experience, topics, duration) => `You are an AI career advisor creating a personalized learning roadmap for interview preparation.

Learning Plan Details:
- Target Role: ${role}
- Experience Level: ${experience}
- Topics/Syllabus: ${topics}
- Preparation Duration: ${duration} months

Task:
Create a comprehensive, week-by-week learning roadmap that:
- Breaks down the ${duration} month(s) into weekly goals
- Covers all topics: ${topics}
- Adjusts difficulty based on ${experience} level
- Includes specific learning resources (concepts, not URLs)
- Provides practical project ideas
- Includes milestone assessments
- Gives time management tips

IMPORTANT FORMATTING RULES:
- Use ## for major sections (e.g., ## 1. Overview, ## 2. Weekly Breakdown)
- Use ### for week/phase headers (e.g., ### Week 1: HTML Basics)
- Use **Bold Text** for subsection titles (e.g., **Goals:**, **Learning Resources:**, **Project Idea:**)
- Use * for bullet points (e.g., * Learn HTML tags)
- Use -- for horizontal dividers between major sections
- Use numbered lists (1., 2., 3.) for sequential steps
- Keep paragraphs concise and well-spaced

Structure the roadmap exactly like this:

## 1. Overview
[Introduction paragraph]

--

## 2. Weekly Breakdown

### Week 1: [Topic Name]
**Goals:**
* Goal 1
* Goal 2

**Learning Resources:**
* Resource/Concept 1
* Resource/Concept 2

**Project Idea:** [Project description]

### Week 2: [Topic Name]
...

--

## 3. Key Milestones
1. Milestone 1
2. Milestone 2

--

## 4. Final Tips
* Tip 1
* Tip 2

Return the roadmap as detailed, well-formatted Markdown-style text.
Make it professional, actionable, and motivating.

Do NOT return JSON. Return plain text with clear Markdown-style formatting.`;

module.exports = {
  questionAnswerPrompt,
  conceptExplainPrompt,
  assessmentInterviewPrompt,
  assessmentEvaluationPrompt,
  roadmapGeneratorPrompt,
};
