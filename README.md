# 🧠 AI-Powered Interview Assistant

A smart, resume-driven interview platform built with React. It simulates a full-stack technical interview using AI-generated questions, scores candidate responses, and provides a dashboard for interviewers to review results.

---

## 🚀 Features

### 👤 Interviewee Tab
- Upload resume (PDF required, DOCX optional)
- Automatically extracts **Name**, **Email**, and **Phone**
- If any field is missing, chatbot prompts the candidate before starting
- Timed interview with 6 AI-generated questions:
  - 2 Easy (30s each)
  - 2 Medium (60s each)
  - 2 Hard (120s each)
- Auto-submits answers when time runs out
- Final score and AI-generated summary at the end

### 🧑‍💼 Interviewer Tab (Dashboard)
- View all candidates sorted by score
- Search and sort by name/email
- Click to view full Q&A history, profile, and AI summary
- Delete candidates if needed

### 💾 Persistence
- All data stored locally using `localStorage`
- Automatically restores progress on refresh or reopen
- “Welcome Back” modal for unfinished interviews

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **UI Library**: Ant Design
- **Resume Parsing**:
  - PDF: `pdfjs-dist`
  - DOCX: `mammoth`
- **NLP**: `compromise` (for name extraction)
- **State Management**: React hooks + localStorage

---

## ✅ How It Works

Candidate uploads resume → fields extracted

Missing fields? Chatbot asks before starting

Interview begins → questions shown one at a time

Timer runs → auto-submits if time expires

Final score + summary generated

Interviewer dashboard updates instantly

---

## 📦 Installation

```bash
git clone https://github.com/Pravin-moses/AI_Powered_Interview_Assistant.git
cd AI_Powered_Interview_Assistant
npm install
npm run dev
