const express = require('express');
const cors = require('cors');
const axios = require('axios');
const argon2 = require('argon2');
const fs = require('fs').promises;
const path = require('path');
const { siteInfo } = require('./config/siteInfo.js');

const app = express();
const PORT = process.env.PORT || 3002;
const ACCOUNTS_DIR = path.join(__dirname, 'accounts');
const PROFILES_DIR = path.join(__dirname, 'profiles');
const TESTS_DIR = path.join(__dirname, 'tests');

// Hugging Face API configuration
const HF_API_URL = "https://api-inference.huggingface.co/models/google/gemma-2b-it";
const HF_HEADERS = {"Authorization": "Bearer YOUR_HF_TOKEN_HERE"};

// Simple rate limiting (in production, use a proper library like express-rate-limit)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP

app.use(cors());
app.use(express.json());

// Ensure directories exist
async function ensureDirectories() {
  const dirs = [ACCOUNTS_DIR, PROFILES_DIR, TESTS_DIR];
  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      console.error(`Failed to create directory ${dir}:`, error);
    }
  }
}

ensureDirectories();

// Rate limiting middleware
app.use('/api/chat', (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  if (!requestCounts.has(clientIP)) {
    requestCounts.set(clientIP, []);
  }

  const requests = requestCounts.get(clientIP);
  // Remove old requests outside the window
  const validRequests = requests.filter(time => time > windowStart);
  requestCounts.set(clientIP, validRequests);

  if (validRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  validRequests.push(now);
  next();
});

// Pre-build context prompt template for efficiency
const contextPromptTemplate = `You are Gemma 2, an AI assistant on the Alphearea educational platform. ${siteInfo.description} ${siteInfo.purpose}

Site information:
- Name: ${siteInfo.name}
- Purpose: ${siteInfo.purpose}
- Description: ${siteInfo.description}

If asked about the site, respond based on this information. Always be helpful and educational.

User question: `;

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
  }

  // Build the full prompt
  const contextPrompt = contextPromptTemplate + message.trim();

  try {
    const payload = { inputs: contextPrompt };
    const response = await axios.post(HF_API_URL, payload, {
      headers: HF_HEADERS,
      timeout: 120000 // 120 seconds timeout
    });

    if (response.data && response.data[0] && response.data[0].generated_text) {
      res.json({ response: response.data[0].generated_text });
    } else {
      res.status(500).json({ error: 'Invalid response from Hugging Face API' });
    }
  } catch (error) {
    console.error('Error communicating with Hugging Face API:', error.message);

    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      res.status(503).json({ error: 'AI service is currently unavailable. Please try again later.' });
    } else if (error.code === 'ETIMEDOUT') {
      res.status(504).json({ error: 'Request timed out. Please try again.' });
    } else {
      res.status(500).json({ error: 'Failed to get response from AI' });
    }
  }
});

app.get('/api/about', (req, res) => {
  res.json(siteInfo);
});

app.get('/api/faq', (req, res) => {
  res.json({ answer: siteInfo.faq["Что за сайт Alphearea?"] });
});

// Get user profile endpoint
app.get('/api/profile/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const profileFile = path.join(PROFILES_DIR, `${username}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);

    res.json({ profile: profileData.profile });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Profile not found' });
    }
    console.error('Error loading profile:', error);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// Update user profile endpoint
app.put('/api/profile/:username', async (req, res) => {
  const { username } = req.params;
  const { profile } = req.body;

  if (!profile) {
    return res.status(400).json({ error: 'Profile data is required' });
  }

  try {
    const profileFile = path.join(PROFILES_DIR, `${username}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);

    // Update profile
    profileData.profile = { ...profileData.profile, ...profile };

    // Save updated profile
    await fs.writeFile(profileFile, JSON.stringify(profileData, null, 2));

    res.json({ message: 'Profile updated successfully', profile: profileData.profile });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Profile not found' });
    }
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Password hashing endpoint using Argon2id
app.post('/api/hash-password', async (req, res) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({
      error: 'Password must be a string with at least 8 characters'
    });
  }

  try {
    // Hash password using Argon2id with recommended parameters
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3, // 3 iterations
      parallelism: 1, // 1 thread
      hashLength: 32 // 32 bytes
    });

    res.json({ hash });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Failed to hash password' });
  }
});

// Password verification endpoint
app.post('/api/verify-password', async (req, res) => {
  const { password, hash } = req.body;

  if (!password || !hash) {
    return res.status(400).json({
      error: 'Both password and hash are required'
    });
  }

  try {
    const isValid = await argon2.verify(hash, password);
    res.json({ valid: isValid });
  } catch (error) {
    console.error('Error verifying password:', error);
    res.status(500).json({ error: 'Failed to verify password' });
  }
});

// User registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password, email, firstName, lastName, nickname, dateOfBirth, specialization } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      error: 'Username, password, and email are required'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long'
    });
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      error: 'Username can only contain letters, numbers, and underscores'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }

  try {
    // Check if user already exists
    const userFile = path.join(ACCOUNTS_DIR, `${username}.txt`);
    try {
      await fs.access(userFile);
      return res.status(409).json({ error: 'Username already exists' });
    } catch (error) {
      // File doesn't exist, continue with registration
    }

    // Hash password
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3, // 3 iterations
      parallelism: 1, // 1 thread
      hashLength: 32 // 32 bytes
    });

    // Create user data
    const userData = {
      username,
      passwordHash,
      email,
      firstName,
      lastName,
      nickname,
      dateOfBirth,
      specialization,
      createdAt: new Date().toISOString()
    };

    // Create user profile data
    const profileData = {
      username,
      email,
      createdAt: new Date().toISOString(),
      profile: {
        displayName: nickname || username,
        firstName,
        lastName,
        nickname,
        dateOfBirth,
        specialization,
        bio: '',
        avatar: '',
        preferences: {
          theme: 'dark',
          language: 'en'
        },
        progress: {
          english: { level: 'beginner', completed: [] },
          korean: { level: 'beginner', completed: [] },
          philosophy: { level: 'beginner', completed: [] },
          psychology: { level: 'beginner', completed: [] },
          russian: { level: 'beginner', completed: [] }
        },
        settings: {
          notifications: true,
          privacy: 'public'
        }
      }
    };

    // Write account data
    await fs.writeFile(userFile, JSON.stringify(userData, null, 2));

    // Write profile data
    const profileFile = path.join(PROFILES_DIR, `${username}.json`);
    await fs.writeFile(profileFile, JSON.stringify(profileData, null, 2));

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and password are required'
    });
  }

  try {
    // Read user file
    const userFile = path.join(ACCOUNTS_DIR, `${username}.txt`);
    const userDataStr = await fs.readFile(userFile, 'utf8');
    const userData = JSON.parse(userDataStr);

    // Verify password
    const isValid = await argon2.verify(userData.passwordHash, password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user info (excluding password hash)
    const { passwordHash, ...userInfo } = userData;

    // Load user profile
    const profileFile = path.join(PROFILES_DIR, `${username}.json`);
    let profileData = null;
    try {
      const profileStr = await fs.readFile(profileFile, 'utf8');
      profileData = JSON.parse(profileStr);
    } catch (error) {
      // Profile doesn't exist, create default
      profileData = {
        username,
        email: userData.email,
        createdAt: userData.createdAt,
        profile: {
          displayName: username,
          bio: '',
          avatar: '',
          preferences: {
            theme: 'dark',
            language: 'en'
          },
          progress: {
            english: { level: 'beginner', completed: [] },
            korean: { level: 'beginner', completed: [] },
            philosophy: { level: 'beginner', completed: [] },
            psychology: { level: 'beginner', completed: [] },
            russian: { level: 'beginner', completed: [] }
          },
          settings: {
            notifications: true,
            privacy: 'public'
          }
        }
      };
      // Save the default profile
      await fs.writeFile(profileFile, JSON.stringify(profileData, null, 2));
    }

    res.json({ message: 'Login successful', user: userInfo, profile: profileData.profile });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Change password endpoint
app.post('/api/change-password', async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({
      error: 'Username, current password, and new password are required'
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      error: 'New password must be at least 8 characters long'
    });
  }

  try {
    // Read user file
    const userFile = path.join(ACCOUNTS_DIR, `${username}.txt`);
    const userDataStr = await fs.readFile(userFile, 'utf8');
    const userData = JSON.parse(userDataStr);

    // Verify current password
    const isValid = await argon2.verify(userData.passwordHash, currentPassword);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3, // 3 iterations
      parallelism: 1, // 1 thread
      hashLength: 32 // 32 bytes
    });

    // Update password hash
    userData.passwordHash = newPasswordHash;

    // Save updated user data
    await fs.writeFile(userFile, JSON.stringify(userData, null, 2));

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Reset password endpoint
app.post('/api/reset-password', async (req, res) => {
  const { identifier, newPassword } = req.body;

  if (!identifier || !newPassword) {
    return res.status(400).json({
      error: 'Identifier and new password are required'
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      error: 'New password must be at least 8 characters long'
    });
  }

  try {
    // Find user by username or email
    let userFile = null;
    let username = null;

    // Check if identifier is a username
    const usernameFile = path.join(ACCOUNTS_DIR, `${identifier}.txt`);
    try {
      await fs.access(usernameFile);
      userFile = usernameFile;
      username = identifier;
    } catch (error) {
      // Not a username, check if it's an email
      const files = await fs.readdir(ACCOUNTS_DIR);
      for (const file of files) {
        if (file.endsWith('.txt')) {
          const filePath = path.join(ACCOUNTS_DIR, file);
          const userDataStr = await fs.readFile(filePath, 'utf8');
          const userData = JSON.parse(userDataStr);
          if (userData.email === identifier) {
            userFile = filePath;
            username = userData.username;
            break;
          }
        }
      }
    }

    if (!userFile) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const newPasswordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3, // 3 iterations
      parallelism: 1, // 1 thread
      hashLength: 32 // 32 bytes
    });

    // Read current user data
    const userDataStr = await fs.readFile(userFile, 'utf8');
    const userData = JSON.parse(userDataStr);

    // Update password hash
    userData.passwordHash = newPasswordHash;

    // Save updated user data
    await fs.writeFile(userFile, JSON.stringify(userData, null, 2));

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Update user data endpoint
app.put('/api/user/:username', async (req, res) => {
  const { username } = req.params;
  const { username: newUsername, email } = req.body;

  if (!newUsername || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(newUsername)) {
    return res.status(400).json({
      error: 'Username can only contain letters, numbers, and underscores'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }

  try {
    // Read current user file
    const userFile = path.join(ACCOUNTS_DIR, `${username}.txt`);
    const userDataStr = await fs.readFile(userFile, 'utf8');
    const userData = JSON.parse(userDataStr);

    // Check if new username already exists (if changed)
    if (newUsername !== username) {
      const newUserFile = path.join(ACCOUNTS_DIR, `${newUsername}.txt`);
      try {
        await fs.access(newUserFile);
        return res.status(409).json({ error: 'Username already exists' });
      } catch (error) {
        // Username is available
      }
    }

    // Update user data
    userData.username = newUsername;
    userData.email = email;

    // If username changed, rename files
    if (newUsername !== username) {
      // Rename user account file
      const newUserFile = path.join(ACCOUNTS_DIR, `${newUsername}.txt`);
      await fs.writeFile(newUserFile, JSON.stringify(userData, null, 2));
      await fs.unlink(userFile);

      // Rename profile file
      const oldProfileFile = path.join(PROFILES_DIR, `${username}.json`);
      const newProfileFile = path.join(PROFILES_DIR, `${newUsername}.json`);
      try {
        await fs.rename(oldProfileFile, newProfileFile);
      } catch (error) {
        // Profile file might not exist, that's ok
      }
    } else {
      // Just update the user file
      await fs.writeFile(userFile, JSON.stringify(userData, null, 2));
    }

    res.json({ message: 'User data updated successfully', user: { username: newUsername, email } });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Test management endpoints

// Get all tests
app.get('/api/tests', async (req, res) => {
  try {
    const files = await fs.readdir(TESTS_DIR);
    const tests = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const testPath = path.join(TESTS_DIR, file);
        const testData = await fs.readFile(testPath, 'utf8');
        const test = JSON.parse(testData);
        tests.push(test);
      }
    }

    res.json({ tests });
  } catch (error) {
    console.error('Error loading tests:', error);
    res.status(500).json({ error: 'Failed to load tests' });
  }
});

// Get test by ID
app.get('/api/tests/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const testFile = path.join(TESTS_DIR, `${id}.json`);
    const testData = await fs.readFile(testFile, 'utf8');
    const test = JSON.parse(testData);

    res.json({ test });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Test not found' });
    }
    console.error('Error loading test:', error);
    res.status(500).json({ error: 'Failed to load test' });
  }
});

// Create new test
app.post('/api/tests', async (req, res) => {
  const { title, subject, questions, createdBy } = req.body;

  if (!title || !subject || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: 'Title, subject, and questions array are required' });
  }

  try {
    const testId = Date.now().toString();
    const test = {
      id: testId,
      title,
      subject,
      questions,
      createdBy,
      createdAt: new Date().toISOString(),
      isBeta: false
    };

    const testFile = path.join(TESTS_DIR, `${testId}.json`);
    await fs.writeFile(testFile, JSON.stringify(test, null, 2));

    res.json({ message: 'Test created successfully', test });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ error: 'Failed to create test' });
  }
});

// Update test
app.put('/api/tests/:id', async (req, res) => {
  const { id } = req.params;
  const { title, subject, questions } = req.body;

  try {
    const testFile = path.join(TESTS_DIR, `${id}.json`);
    const testData = await fs.readFile(testFile, 'utf8');
    const test = JSON.parse(testData);

    if (title) test.title = title;
    if (subject) test.subject = subject;
    if (questions && Array.isArray(questions)) test.questions = questions;
    test.updatedAt = new Date().toISOString();

    await fs.writeFile(testFile, JSON.stringify(test, null, 2));

    res.json({ message: 'Test updated successfully', test });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Test not found' });
    }
    console.error('Error updating test:', error);
    res.status(500).json({ error: 'Failed to update test' });
  }
});

// Delete test
app.delete('/api/tests/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const testFile = path.join(TESTS_DIR, `${id}.json`);
    await fs.unlink(testFile);

    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Test not found' });
    }
    console.error('Error deleting test:', error);
    res.status(500).json({ error: 'Failed to delete test' });
  }
});

// Parse uploaded test file
app.post('/api/tests/parse', async (req, res) => {
  const { content, format } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'File content is required' });
  }

  try {
    let questions = [];

    if (format === 'standard') {
      // Parse standard format: ? question\n+ correct\n- wrong\n- wrong
      const lines = content.split('\n').map(line => line.trim()).filter(line => line);
      let currentQuestion = null;

      for (const line of lines) {
        if (line.startsWith('?')) {
          if (currentQuestion) questions.push(currentQuestion);
          currentQuestion = {
            question: line.substring(1).trim(),
            options: [],
            correctAnswer: null
          };
        } else if (line.startsWith('+') && currentQuestion) {
          currentQuestion.correctAnswer = currentQuestion.options.length;
          currentQuestion.options.push(line.substring(1).trim());
        } else if (line.startsWith('-') && currentQuestion) {
          currentQuestion.options.push(line.substring(1).trim());
        }
      }

      if (currentQuestion) questions.push(currentQuestion);
    }

    res.json({ questions });
  } catch (error) {
    console.error('Error parsing test file:', error);
    res.status(500).json({ error: 'Failed to parse test file' });
  }
});

// Generate test from topic using AI
app.post('/api/generate-test', async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  const prompt = `Тема: ${topic}.
Сгенерируй 3 вопроса с вариантами ответа (A, B, C, D) и укажи правильный вариант.
Формат:
Вопрос 1: [Текст вопроса]
A) [Вариант 1]
B) [Вариант 2]
C) [Вариант 3]
D) [Вариант 4]
Правильный ответ: [Буква]

Вопрос 2: [Текст вопроса]
...`;

  try {
    const payload = { inputs: prompt };
    const response = await axios.post(HF_API_URL, payload, {
      headers: HF_HEADERS,
      timeout: 300000 // 5 minutes timeout for AI generation
    });

    if (response.data && response.data[0] && response.data[0].generated_text) {
      res.json({ generated_test: response.data[0].generated_text });
    } else {
      res.status(500).json({ error: 'Invalid response from Hugging Face API' });
    }
  } catch (error) {
    console.error('Error generating test:', error);
    res.status(500).json({ error: 'Failed to generate test' });
  }
});

// Generate test from materials using AI (legacy endpoint)
app.post('/api/tests/generate', async (req, res) => {
  const { material, subject, difficulty, numQuestions } = req.body;

  if (!material || !subject) {
    return res.status(400).json({ error: 'Material content and subject are required' });
  }

  const prompt = `You are an expert educator creating high-quality test questions. Based on the following material, generate ${numQuestions || 10} multiple-choice questions for ${subject} at ${difficulty || 'intermediate'} level.

Material:
${material}

Requirements:
- Each question must have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Questions should test understanding, not just memorization
- Include a mix of factual and conceptual questions
- Format each question as:
? Question text
+ Correct answer
- Wrong answer 1
- Wrong answer 2
- Wrong answer 3

Generate the questions now:`;

  try {
    const payload = { inputs: prompt };
    const response = await axios.post(HF_API_URL, payload, {
      headers: HF_HEADERS,
      timeout: 300000 // 5 minutes timeout for AI generation
    });

    if (response.data && response.data[0] && response.data[0].generated_text) {
      const generatedContent = response.data[0].generated_text;

      // Parse the generated content
      const questions = [];
      const lines = generatedContent.split('\n').map(line => line.trim()).filter(line => line);
      let currentQuestion = null;

      for (const line of lines) {
        if (line.startsWith('?')) {
          if (currentQuestion) questions.push(currentQuestion);
          currentQuestion = {
            question: line.substring(1).trim(),
            options: [],
            correctAnswer: null
          };
        } else if (line.startsWith('+') && currentQuestion) {
          currentQuestion.correctAnswer = currentQuestion.options.length;
          currentQuestion.options.push(line.substring(1).trim());
        } else if (line.startsWith('-') && currentQuestion) {
          currentQuestion.options.push(line.substring(1).trim());
        }
      }

      if (currentQuestion) questions.push(currentQuestion);

      res.json({ questions, rawContent: generatedContent });
    } else {
      res.status(500).json({ error: 'Invalid response from Hugging Face API' });
    }
  } catch (error) {
    console.error('Error generating test:', error);
    res.status(500).json({ error: 'Failed to generate test' });
  }
});

// Clean up beta test records
app.post('/api/tests/cleanup', async (req, res) => {
  try {
    const files = await fs.readdir(TESTS_DIR);
    let deletedCount = 0;

    for (const file of files) {
      if (file.endsWith('.json')) {
        const testPath = path.join(TESTS_DIR, file);
        const testData = await fs.readFile(testPath, 'utf8');
        const test = JSON.parse(testData);

        if (test.isBeta) {
          await fs.unlink(testPath);
          deletedCount++;
        }
      }
    }

    res.json({ message: `Cleaned up ${deletedCount} beta test records` });
  } catch (error) {
    console.error('Error cleaning up tests:', error);
    res.status(500).json({ error: 'Failed to clean up tests' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Hugging Face API URL: ${HF_API_URL}`);
  console.log(`Loaded site identity: ${siteInfo.name}`);
});
