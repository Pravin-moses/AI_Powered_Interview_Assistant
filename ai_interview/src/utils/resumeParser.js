import mammoth from "mammoth";
import nlp from "compromise";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.min?url"; // Vite-compatible URL

// Set the PDF.js worker URL globally
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

/**
 * Extract text from a PDF file
 * @param {File} file
 * @returns {Promise<string>}
 */
export const extractTextFromPdf = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((s) => s.str).join(" ") + "\n"; // newline per page
    }

    return text;
  } catch (err) {
    console.error("PDF parsing failed:", err);
    throw new Error("Could not extract text from PDF.");
  }
};

/**
 * Extract text from a DOCX file
 * @param {File} file
 * @returns {Promise<string>}
 */
export const extractTextFromDocx = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

/**
 * Parse fields like name, email, phone, LinkedIn, skills from text
 * @param {string} text
 * @returns {object}
 */
export const parseFields = (text) => {
  const doc = nlp(text);

  const name = doc.people().first().text() || "";
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/i);
  const phoneMatch = text.match(/(\+\d{1,3}[- ]?)?\d{10}/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+/i);

  const skillMatch = text.match(/Skills[:\s]*([\w\s,]+)/i);
  const skills = skillMatch ? skillMatch[1].split(",").map(s => s.trim()) : [];

  return {
    name,
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
    linkedin: linkedinMatch ? linkedinMatch[0] : "",
    skills,
  };
};

/**
 * Parse a resume file (PDF or DOCX) and return extracted fields
 * @param {File} file
 * @returns {Promise<object>}
 */
export const parseResume = async (file) => {
  let text = "";

  if (file.type === "application/pdf") {
    text = await extractTextFromPdf(file);
  } else if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    text = await extractTextFromDocx(file);
  } else {
    throw new Error("Invalid file type. Please upload PDF or DOCX.");
  }

  return parseFields(text);
};
