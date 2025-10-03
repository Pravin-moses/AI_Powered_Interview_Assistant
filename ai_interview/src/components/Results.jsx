// src/components/Results.jsx

import React from "react";
import { Card, List } from "antd";
import { generateSummary } from "../utils/scoring";

export default function Results({ candidate, answers }) {
  const finalScore = answers.reduce((sum, ans) => sum + ans.score, 0);
  const summary = generateSummary(finalScore);

  return (
    <Card title={`${candidate.name}'s Results`}>
      <p><strong>Final Score:</strong> {finalScore} / {answers.length * 10}</p>
      <p><strong>Summary:</strong> {summary}</p>
      <h3>Q&A Breakdown</h3>
      <List
        dataSource={answers}
        renderItem={(item, index) => (
          <List.Item>
            <div>
              <p><strong>Q{index + 1}:</strong> {item.question}</p>
              <p><strong>Answer:</strong> {item.answer}</p>
              <p><strong>Score:</strong> {item.score}</p>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
