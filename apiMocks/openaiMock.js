// apiMocks/openaiMock.js
export async function callOpenAI(prompt) {
  console.log("Mock OpenAI call:", prompt);
  return {
    text: "Это тестовый ответ от OpenAI",
    tokensUsed: 5
  };
}