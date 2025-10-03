// src/utils/scoring.js

export const QUESTIONS = [
  { id: 1, difficulty: "Easy", text: "What is React? Explain in 1-2 lines.", time: 30 },
  { id: 2, difficulty: "Easy", text: "Explain the difference between let and const in JavaScript.", time: 30 },
  { id: 3, difficulty: "Medium", text: "What is a REST API? Give an example of designing a POST endpoint.", time: 60 },
  { id: 4, difficulty: "Medium", text: "How do props differ from state in React? When do you use each?", time: 60 },
  { id: 5, difficulty: "Hard", text: "How would you optimize React performance? Give 3 techniques.", time: 120 },
  { id: 6, difficulty: "Hard", text: "How would you design authentication in a MERN app? Consider tokens and refresh.", time: 120 },
];

// Return all questions
export const generateQuestions = () => QUESTIONS;

// Score based on keyword matches
export const scoreAnswer = (answer, difficulty) => {
  if (!answer) return 0;

  const keywords = {
    Easy: ["react", "ui", "const", "block", "scope"],
    Medium: ["api", "endpoint", "props", "state"],
    Hard: ["optimize", "memo", "cache", "auth", "token", "security"],
  };

  let count = 0;
  keywords[difficulty].forEach((word) => {
    if (answer.toLowerCase().includes(word)) count++;
  });

  if (difficulty === "Easy") return Math.min(count, 2) * 5;     // Max 10
  if (difficulty === "Medium") return Math.min(count, 3) * 10;  // Max 30
  if (difficulty === "Hard") return Math.min(count, 5) * 12;    // Max 60

  return 0;
};

// Generate summary based on score
export const generateSummary = (totalScore) => {
  if (totalScore > 80) {
    return `Candidate scored ${totalScore}/100. Strong in all levels, good fit for full-stack role.`;
  } else if (totalScore > 60) {
    return `Candidate scored ${totalScore}/100. Good on medium and hard questions, some scope for improvement.`;
  } else if (totalScore > 40) {
    return `Candidate scored ${totalScore}/100. Strong in basics, but struggled on advanced topics.`;
  } else {
    return `Candidate scored ${totalScore}/100. Needs significant improvement in fundamentals.`;
  }
};
