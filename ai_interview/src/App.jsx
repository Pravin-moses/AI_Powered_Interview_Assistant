// src/App.jsx
import React, { useState, useEffect } from "react";
import { Layout, Menu, Modal } from "antd";
import { UserOutlined, TeamOutlined, UploadOutlined } from "@ant-design/icons";
import ResumeUpload from "./components/ResumeUpload";
import ChatBox from "./components/ChatBox";
import Dashboard from "./components/Dashboard";

const { Header, Content, Sider } = Layout;

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState("interviewee");

  const [candidates, setCandidates] = useState(() => {
    const saved = localStorage.getItem("candidates");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCandidate, setActiveCandidate] = useState(null);
  const [welcomeBackVisible, setWelcomeBackVisible] = useState(false);

  // Persist candidates to localStorage
  useEffect(() => {
    localStorage.setItem("candidates", JSON.stringify(candidates));
  }, [candidates]);

  // Check unfinished interview
  useEffect(() => {
    const unfinished = candidates.find((c) => c.status === "in-progress");
    if (unfinished) {
      setActiveCandidate(unfinished);
      setWelcomeBackVisible(true);
    }
  }, []);

  // Add new candidate after parsing resume
  const handleResumeParsed = (profile) => {
    const candidate = {
      id: Date.now(),
      profile,
      chatHistory: [],
      score: null,
      summary: "",
      status: "in-progress",
    };
    setCandidates([...candidates, candidate]);
    setActiveCandidate(candidate);
    setCurrentTab("chat");
  };

  // Complete interview
  const handleInterviewComplete = (candidateId, answersList, finalScore, summary) => {
    const updatedCandidates = candidates.map((c) =>
      c.id === candidateId
        ? {
            ...c,
            chatHistory: answersList,
            score: finalScore,
            summary,
            status: "completed",
          }
        : c
    );
    setCandidates(updatedCandidates);
    setActiveCandidate(null);
    setCurrentTab("dashboard");
  };

  // Delete candidate
  const handleDeleteCandidate = (id) => {
    setCandidates(candidates.filter((c) => c.id !== id));
    if (activeCandidate?.id === id) setActiveCandidate(null);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentTab]}
          onClick={(e) => setCurrentTab(e.key)}
          items={[
            { key: "interviewee", icon: <UploadOutlined />, label: "Interviewee" },
            { key: "chat", icon: <UserOutlined />, label: "Chat" },
            { key: "dashboard", icon: <TeamOutlined />, label: "Dashboard" },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ color: "white", fontSize: "20px" }}>
          AI-Powered Interview Assistant
        </Header>
        <Content style={{ margin: "16px" }}>
          {currentTab === "interviewee" && (
            <ResumeUpload onResumeParsed={handleResumeParsed} />
          )}
          {currentTab === "chat" && activeCandidate && (
            <ChatBox
              candidate={activeCandidate}
              onFinish={(answers, score, summary) =>
                handleInterviewComplete(activeCandidate.id, answers, score, summary)
              }
            />
          )}
          {currentTab === "dashboard" && (
            <Dashboard
              candidates={candidates}
              onDeleteCandidate={handleDeleteCandidate}
            />
          )}
        </Content>
      </Layout>

      <Modal
        title="Welcome Back!"
        open={welcomeBackVisible}
        onOk={() => {
          setCurrentTab("chat");
          setWelcomeBackVisible(false);
        }}
        onCancel={() => setWelcomeBackVisible(false)}
      >
        <p>You have an unfinished interview. Would you like to continue?</p>
      </Modal>
    </Layout>
  );
}
