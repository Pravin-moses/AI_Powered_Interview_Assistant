// src/components/ChatBox.jsx

import React, { useState, useEffect } from "react";
import { Input, Button, Card, Progress, message } from "antd";
import { generateQuestions, scoreAnswer, generateSummary } from "../utils/scoring";

export default function ChatBox({ candidate, onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [input, setInput] = useState("");

  const [profile, setProfile] = useState(candidate.profile);
  const [collectingInfo, setCollectingInfo] = useState(
    !profile.name || !profile.email || !profile.phone
  );
  const [fieldPrompt, setFieldPrompt] = useState("");

  useEffect(() => {
    if (collectingInfo) {
      if (!profile.name) setFieldPrompt("Please enter your name:");
      else if (!profile.email) setFieldPrompt("Please enter your email:");
      else if (!profile.phone) setFieldPrompt("Please enter your phone number:");
    }
  }, [collectingInfo, profile]);

  const handleFieldSubmit = () => {
    const updated = { ...profile };
    if (!profile.name) updated.name = input.trim();
    else if (!profile.email) updated.email = input.trim();
    else if (!profile.phone) updated.phone = input.trim();

    if (!input.trim()) {
      message.error("This field cannot be empty.");
      return;
    }

    setProfile(updated);
    candidate.profile = updated;
    setInput("");

    if (updated.name && updated.email && updated.phone) {
      setCollectingInfo(false);
      const qs = generateQuestions();
      setQuestions(qs);
      setTimer(qs[0].time);
    }
  };

  useEffect(() => {
    if (!collectingInfo && questions.length === 0) {
      const qs = generateQuestions();
      setQuestions(qs);
      setTimer(qs[0].time);
    }
  }, [collectingInfo]);

  useEffect(() => {
    if (timer <= 0 || questions.length === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, currentQ]);

  useEffect(() => {
    if (timer <= 0 && questions.length > 0) {
      handleNext();
    }
  }, [timer]);

  const handleNext = () => {
    const question = questions[currentQ];
    const score = scoreAnswer(input, question.difficulty);

    const newAnswer = {
      question: question.text,
      answer: input || "(No Answer)",
      score,
      difficulty: question.difficulty,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setInput("");

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setTimer(questions[currentQ + 1].time);
    } else {
      const totalScore = updatedAnswers.reduce((sum, a) => sum + a.score, 0);
      const summary = generateSummary(totalScore);
      onFinish(updatedAnswers, totalScore, summary);
    }
  };

  if (collectingInfo) {
    return (
      <Card title="Missing Information">
        <p>{fieldPrompt}</p>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here..."
        />
        <Button type="primary" onClick={handleFieldSubmit} style={{ marginTop: "1rem" }}>
          Submit
        </Button>
      </Card>
    );
  }

  if (questions.length === 0) return <p>Loading interview...</p>;

  const question = questions[currentQ];

  return (
    <Card title={`Question ${currentQ + 1} of ${questions.length}`}>
      <p><strong>{question.text}</strong></p>
      <p>Time Left:</p>
      <Progress percent={(timer / question.time) * 100} showInfo={false} />
      <Input.TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        placeholder="Type your answer..."
      />
      <Button type="primary" onClick={handleNext} style={{ marginTop: "1rem" }}>
        {currentQ + 1 < questions.length ? "Next" : "Finish"}
      </Button>
    </Card>
  );
}
