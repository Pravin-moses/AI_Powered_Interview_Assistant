// src/components/Dashboard.jsx
import React, { useState } from "react";
import { Table, Input, Button, Modal, List, Tag, Typography } from "antd";

const { Title, Text } = Typography;

export default function Dashboard({ candidates, onDeleteCandidate }) {
  const [searchText, setSearchText] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Filter candidates by search
  const filteredCandidates = candidates.filter(
    (c) =>
      c.profile.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.profile.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: ["profile", "name"],
      key: "name",
      sorter: (a, b) => a.profile.name.localeCompare(b.profile.name),
    },
    {
      title: "Email",
      dataIndex: ["profile", "email"],
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: ["profile", "phone"],
      key: "phone",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      sorter: (a, b) => (a.score || 0) - (b.score || 0),
      render: (score) =>
        score !== null ? (
          <Tag color={score > 60 ? "green" : "red"}>{score}</Tag>
        ) : (
          "—"
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "blue" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => setSelectedCandidate(record)}>
            View
          </Button>
          <Button type="link" danger onClick={() => onDeleteCandidate(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "auto" }}>
      <Title level={3}>Candidate Dashboard</Title>
      <Input.Search
        placeholder="Search by name or email"
        style={{ marginBottom: 16, maxWidth: 400 }}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredCandidates}
        pagination={{ pageSize: 5 }}
      />

      {selectedCandidate && (
        <Modal
          title={`Interview Details - ${selectedCandidate.profile.name}`}
          open={!!selectedCandidate}
          onCancel={() => setSelectedCandidate(null)}
          footer={null}
          width={700}
        >
          <p><b>Email:</b> {selectedCandidate.profile.email}</p>
          <p><b>Phone:</b> {selectedCandidate.profile.phone}</p>
          <p>
            <b>Final Score:</b>{" "}
            <Tag color={selectedCandidate.score > 60 ? "green" : "red"}>
              {selectedCandidate.score}
            </Tag>
          </p>
          <p><b>AI Summary:</b> {selectedCandidate.summary}</p>
          <Title level={5} style={{ marginTop: 16 }}>Q&A History</Title>
          <List
            bordered
            dataSource={selectedCandidate.chatHistory}
            renderItem={(item, idx) => (
              <List.Item>
                <div style={{ width: "100%" }}>
                  <Text strong>
                    Q{idx + 1} ({item.difficulty}): {item.question}
                  </Text>
                  <br />
                  <Text>Answer: {item.answer}</Text>
                  <br />
                  <Text type="secondary">Score: {item.score}</Text>
                </div>
              </List.Item>
            )}
          />
        </Modal>
      )}
    </div>
  );
}
