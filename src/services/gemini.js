import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// ✅ Use one consistent model name across the whole file
const MODEL_NAME = "gemini-2.5-flash";

// ─── Helper: parse JSON safely from AI response ───────────────────────────
const parseJSON = (rawText) => {
  const cleaned = rawText
    .replace(/```json/gi, "")  // remove ```json blocks
    .replace(/```/g, "")       // remove closing ```
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ JSON Parse Error. Raw output:", cleaned);
    throw new Error("Invalid JSON format returned by Gemini.");
  }
};

// ─── Generate Flashcards from text ────────────────────────────────────────
export const generateFlashcards = async (text) => {
  if (!API_KEY) throw new Error("Gemini API key is not configured.");

  const model = genAI.getGenerativeModel({ model: MODEL_NAME }); // ✅ consistent

  const prompt = `You are an AI that creates educational flashcards.
Given the text below, extract key concepts and return flashcards.

Return ONLY a raw JSON array. No markdown. No explanation.
Format:
[{ "question": "...", "answer": "..." }]

Input text:
${text}`;

  const result = await model.generateContent(prompt);
  return parseJSON(result.response.text());
};

// ─── Generate Quiz from a topic ───────────────────────────────────────────
export const generateQuiz = async (topic) => {
  if (!API_KEY) throw new Error("Gemini API key is not configured.");

  const model = genAI.getGenerativeModel({ model: MODEL_NAME }); // ✅ consistent

  const prompt = `Generate a 5-question multiple choice quiz on: "${topic}".

Return ONLY a raw JSON array. No markdown. No explanation.
Format:
[{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0
}]`;

  const result = await model.generateContent(prompt);
  return parseJSON(result.response.text());
};