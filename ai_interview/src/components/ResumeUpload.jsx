import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { parseResume } from "../utils/resumeParser";

export default function ResumeUpload({ onResumeParsed }) {
  const [loading, setLoading] = useState(false);

  const beforeUpload = async (file) => {
    setLoading(true);
    try {
      const data = await parseResume(file);
      onResumeParsed(data);
      message.success("Resume parsed successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to parse resume. Please upload PDF or DOCX.");
    }
    setLoading(false);
    return false;
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Upload beforeUpload={beforeUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />} loading={loading}>
          Upload Resume (PDF/DOCX)
        </Button>
      </Upload>
    </div>
  );
}
