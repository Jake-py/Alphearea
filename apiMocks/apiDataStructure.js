// Пример структуры для тестирования
const requestData = {
  userId: "user123",
  action: "generateExercise",
  content: "Создать интерактивное упражнение"
};

const responseData = {
  success: true,
  result: "Упражнение сгенерировано",
  metadata: { tokensUsed: 5 }
};

module.exports = { requestData, responseData };