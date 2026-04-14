import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDMWMZO7XcW5RaVnBSh_M_TjeC8UOl0o1k";
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    if (data.models) {
      console.log(JSON.stringify(data.models.map(m => m.name), null, 2));
    } else {
      console.log(data);
    }
  } catch (err) {
    console.error(err);
  }
}

run();
