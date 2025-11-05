const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/api/login`,
  register: `${API_BASE_URL}/api/register`,
  resetPassword: `${API_BASE_URL}/api/reset-password`,
  changePassword: `${API_BASE_URL}/api/change-password`,
  chat: `${API_BASE_URL}/api/chat`,
  profile: (username) => `${API_BASE_URL}/api/profile/${username}`,
  user: (username) => `${API_BASE_URL}/api/user/${username}`,
  tests: `${API_BASE_URL}/api/tests`,
  testsParse: `${API_BASE_URL}/api/tests/parse`,
  testsGenerate: `${API_BASE_URL}/api/tests/generate`,
  testsCleanup: `${API_BASE_URL}/api/tests/cleanup`,
  test: (testId) => `${API_BASE_URL}/api/tests/${testId}`
};

export default API_BASE_URL;
