import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve("c:/Users/Rohith Sivakumar/Desktop/Flashmind/Flashmind/.env"), 'utf8');
const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const API_KEY = match ? match[1].replace(/["']/g, '').trim() : null;

if (!API_KEY) {
  console.error("No API Key found");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  try {
    // In SDK versions that don't have listModels on the genAI object, we might have to use raw fetch. 
    // Wait, the SDK has genAI.getGenerativeModel but does it have listModels?
    // Let's use fetch directly since we know the endpoint.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const modelNames = data.models.map(m => m.name);
    console.log(modelNames.join('\n'));
  } catch(e) {
    console.error(e);
  }
}
run();
