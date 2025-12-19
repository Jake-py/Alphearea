// testApiMocks.js
import { callOpenAI } from './apiMocks/openaiMock.js';

async function testOpenAIMock() {
  const prompt = "Создать интерактивное упражнение";
  const result = await callOpenAI(prompt);
  console.log("Test result:", result);
}

testOpenAIMock();