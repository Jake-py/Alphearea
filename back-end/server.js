import express from 'express';
import cors from 'cors';
import axios from 'axios';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { siteInfo } from './config/siteInfo.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HfInference } from '@huggingface/inference';
import https from 'https';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

// Load environment variables from .env.production file
config({ path: path.resolve(process.cwd(), '.env.production') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test configuration
let testConfig = {};
try {
  const configPath = path.join(__dirname, 'testConfig.json');
  const configData = await fs.readFile(configPath, 'utf8');
  testConfig = JSON.parse(configData);
} catch (error) {
  console.warn('Could not load testConfig.json, using defaults:', error.message);
  testConfig = {
    topics: ["Present Simple", "Past Simple"],
    level: "intermediate",
    questionsPerBatch: 2,
    totalQuestions: 10,
    timeout: 60000,
    retries: 2,
    aiModel: "gemini-3-pro-preview"
  };
}


const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ACCOUNTS_DIR = path.join(__dirname, 'accounts');
const PROFILES_DIR = path.join(__dirname, 'profiles');
const TESTS_DIR = path.join(__dirname, 'tests');

// CSRF protection setup
app.use(cookieParser());
const csrfProtection = csurf({ cookie: true });

// Gemini AI configuration
const GENAI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI({ apiKey: GENAI_API_KEY });
const GEMINI_MODEL = "gemini-3-pro-preview";

// Hugging Face Inference API configuration
const HUGGINGFACE_API_KEY = process.env.HF_API_KEY;
console.log('Hugging Face API Key loaded:', HUGGINGFACE_API_KEY ? 'Yes' : 'No');
const hf = new HfInference(HUGGINGFACE_API_KEY);
const HUGGINGFACE_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

// Simple rate limiting enabled
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP

// Enable CORS for frontend
app.use(cors({
  origin: 'https://alphearea.onrender.com',
  credentials: true
}));
app.use(express.json());

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'wasm-unsafe-eval' blob: https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' blob:; " +
    "img-src 'self' data: blob: https://*.googleusercontent.com; " +
    "font-src 'self' data: blob: https://fonts.gstatic.com; " +
    "worker-src blob: 'self'; " +
    "connect-src 'self' https://alphearea-b.onrender.com https://api.google.com https://huggingface.co; " +
    "frame-src 'none'; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';");
   
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  next();
});

// JWT authentication middleware disabled
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

//   if (!token) {
//     return res.status(401).json({ error: 'Access token required' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid or expired token' });
//     }
//     req.user = user;
//     next();
//   });
// };

// Guest token verification middleware
const verifyGuestToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Guest token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // Assuming guest token contains userId
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired guest token' });
  }
};

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

// Rate limiting middleware disabled
// app.use('/api/chat', (req, res, next) => {
//   const clientIP = req.ip || req.connection.remoteAddress;
//   const now = Date.now();
//   const windowStart = now - RATE_LIMIT_WINDOW;

//   if (!requestCounts.has(clientIP)) {
//     requestCounts.set(clientIP, []);
//   }

//   const requests = requestCounts.get(clientIP);
//   // Remove old requests outside the window
//   const validRequests = requests.filter(time => time > windowStart);
//   requestCounts.set(clientIP, validRequests);

//   if (validRequests.length >= MAX_REQUESTS_PER_WINDOW) {
//     return res.status(429).json({ error: 'Too many requests. Please try again later.' });
//   }

//   validRequests.push(now);
//   next();
// });

// Check if Gemini AI is available
async function checkGeminiConnection() {
  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "Test connection" }] }]
    });
    return result.response !== undefined;
  } catch (error) {
    console.error('Gemini AI connection check failed:', error.message);
    return false;
  }
}

// Check if Hugging Face Inference API is available
async function checkHuggingFaceConnection() {
  try {
    console.log('Testing Hugging Face connection with model:', HUGGINGFACE_MODEL);
    console.log('Hugging Face API Key:', HUGGINGFACE_API_KEY);
    const response = await hf.textGeneration({
      model: HUGGINGFACE_MODEL,
      inputs: "Test connection"
    });
    console.log('Hugging Face connection successful:', response);
    return response !== undefined;
  } catch (error) {
    console.error('Hugging Face Inference API connection check failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

// Pre-build context prompt template for efficiency
const contextPromptTemplate = `говори только с таким языком, как и язык в запросе, отвечай всегда с таким языком который тебе пишут или просят`;

app.post('/api/chat', async (req, res) => {
  const { message, model = 'gemini' } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
  }

  try {
    let responseText = '';
    
    if (model === 'gemini') {
      // Check if Gemini AI is available
      const isGeminiAvailable = await checkGeminiConnection();
      if (!isGeminiAvailable) {
        return res.status(503).json({ error: 'Gemini AI service is not available. Please ensure your API key is valid.' });
      }

      const geminiModel = genAI.getGenerativeModel({ model: GEMINI_MODEL });
      const prompt = `говори только с таким языком, как и язык в запросе, отвечай всегда с таким языком который тебе пишут или просят\n\nUser: ${message.trim()}`;

      const result = await geminiModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });

      responseText = await result.response.text();
    } else if (model === 'huggingface') {
      // Check if Hugging Face Inference API is available
      const isHuggingFaceAvailable = await checkHuggingFaceConnection();
      if (!isHuggingFaceAvailable) {
        return res.status(503).json({ error: 'Hugging Face Inference API service is not available. Please ensure your API key is valid.' });
      }

      const prompt = `говори только с таким языком, как и язык в запросе, отвечай всегда с таким языком который тебе пишут или просят\n\nUser: ${message.trim()}`;

      const response = await hf.textGeneration({
        model: HUGGINGFACE_MODEL,
        inputs: prompt
      });

      responseText = response.generated_text;
    } else {
      return res.status(400).json({ error: 'Invalid model specified. Use "gemini" or "huggingface".' });
    }

    res.json({ response: responseText, model });
  } catch (error) {
    console.error('Error communicating with AI:', error.message);

    if (error.message.includes('API key')) {
      res.status(401).json({ error: 'Invalid API key.' });
    } else if (error.message.includes('quota')) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
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

// User registration endpoint - БЕЗ CSRF (это API, не HTML форма)
app.post('/api/register', async (req, res) => {
  const { username, password, email, firstName, lastName, nickname, dateOfBirth, specialization } = req.body;

  // Input validation to prevent injection
  if (!username || !password || !email) {
    return res.status(400).json({
      error: 'Username, password, and email are required'
    });
  }

  // Sanitize inputs to prevent injection
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/[<>'"&]/g, '');
  };

  const sanitizedUsername = sanitizeInput(username);
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedFirstName = sanitizeInput(firstName);
  const sanitizedLastName = sanitizeInput(lastName);
  const sanitizedNickname = sanitizeInput(nickname);

  if (password.length < 8) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long'
    });
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(sanitizedUsername)) {
    return res.status(400).json({
      error: 'Username can only contain letters, numbers, and underscores'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitizedEmail)) {
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

// User login endpoint - БЕЗ CSRF (это API, не HTML форма)
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

    // Generate JWT token
    const token = jwt.sign(
      { username: userData.username, email: userData.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Login successful', user: userInfo, profile: profileData.profile, token });
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

  // Check if Gemini AI is available
  const isGeminiAvailable = await checkGeminiConnection();
  if (!isGeminiAvailable) {
    return res.status(503).json({ error: 'Gemini AI service is not available. Please ensure your API key is valid.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const prompt = `Генерируй тесты только в таком формате:

? Вопрос
+ Правильный ответ
- Неправильный ответ 1
- Неправильный ответ 2
- Неправильный ответ 3

? Следующий вопрос
+ Правильный ответ
- Неправильный ответ 1
- Неправильный ответ 2
- Неправильный ответ 3

И так далее. Всегда используй ? для вопросов, + для правильных ответов, - для неправильных.

Тема: ${topic}.
Сгенерируй 3 вопроса с вариантами ответа (A, B, C, D) и укажи правильный вариант.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const responseText = await result.response.text();
    res.json({ generated_test: responseText });
  } catch (error) {
    console.error('Error generating test:', error);
    res.status(500).json({ error: 'Failed to generate test' });
  }
});

// Helper function to generate questions in batches with retry
async function generateQuestionChunk(material, subject, difficulty, questionsPerBatch, generationMethod, parameters, retries = testConfig.retries) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      let promptContent = '';

      if (generationMethod === 'materials') {
        promptContent = `Based on the following material, generate ${questionsPerBatch} multiple-choice questions for ${subject} at ${difficulty || 'intermediate'} level.

Material:
${material}

Requirements:
- Each question must have exactly 4 options
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
      } else if (generationMethod === 'parameters') {
        promptContent = `Generate ${questionsPerBatch} multiple-choice questions for ${subject} at ${difficulty || 'intermediate'} level based on these parameters:

Parameters:
${parameters}

Requirements:
- Each question must have exactly 4 options
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
      }

      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
      const systemPrompt = "You are JARVIS 2B, an expert educator creating high-quality test questions. Always generate questions in the exact format specified. You are sarcastic, precise, and confident in your responses.";

      const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "user", parts: [{ text: promptContent }] }
        ]
      });

      const generatedContent = await result.response.text();

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

      return questions;
    } catch (error) {
      console.error(`Error generating chunk (attempt ${attempt + 1}/${retries + 1}):`, error.message);
      if (attempt === retries) {
        return null; // Failed after all retries
      }

      // Wait a bit before retrying (без setTimeout)
      await new Promise(resolve => {
        const start = performance.now();
        function check(now) {
          if (now - start >= 1000) resolve();
          else requestAnimationFrame(check);
        }
        requestAnimationFrame(check);
      });
    }
  }

  return null;
}

// Generate test from materials using AI with batch processing
app.post('/api/tests/generate', async (req, res) => {
  const { material, subject, difficulty, numQuestions, generationMethod, parameters } = req.body;

  if (!subject) {
    return res.status(400).json({ error: 'Subject is required' });
  }

  if (generationMethod === 'materials' && !material) {
    return res.status(400).json({ error: 'Material content is required for materials generation method' });
  }

  if (generationMethod === 'parameters' && !parameters) {
    return res.status(400).json({ error: 'Parameters are required for parameters generation method' });
  }

  // Check if Gemini AI is available
  const isGeminiAvailable = await checkGeminiConnection();
  if (!isGeminiAvailable) {
    return res.status(503).json({ error: 'Gemini AI service is not available. Please ensure your API key is valid.' });
  }

  const totalQuestions = numQuestions || testConfig.totalQuestions;
  const questionsPerBatch = testConfig.questionsPerBatch;
  const allQuestions = [];

  try {
    // Generate questions in batches
    for (let batchStart = 0; batchStart < totalQuestions; batchStart += questionsPerBatch) {
      const batchSize = Math.min(questionsPerBatch, totalQuestions - batchStart);

      console.log(`Generating batch ${Math.floor(batchStart / questionsPerBatch) + 1}: ${batchSize} questions`);

      const batchQuestions = await generateQuestionChunk(
        material,
        subject,
        difficulty,
        batchSize,
        generationMethod,
        parameters
      );

      if (batchQuestions && batchQuestions.length > 0) {
        allQuestions.push(...batchQuestions);
        console.log(`Batch completed: ${batchQuestions.length} questions generated`);
      } else {
        console.error(`Failed to generate batch starting at question ${batchStart}`);
        // Continue with next batch instead of failing completely
      }
    }

    // Cache the generated questions
    const cacheKey = `${subject}_${generationMethod}_${Date.now()}`;
    const cacheFile = path.join(__dirname, 'questions_cache.json');
    try {
      let cache = {};
      try {
        const cacheData = await fs.readFile(cacheFile, 'utf8');
        cache = JSON.parse(cacheData);
      } catch (error) {
        // Cache file doesn't exist or is invalid, start fresh
      }
      cache[cacheKey] = {
        questions: allQuestions,
        timestamp: new Date().toISOString(),
        subject,
        generationMethod,
        totalQuestions: allQuestions.length
      };
      await fs.writeFile(cacheFile, JSON.stringify(cache, null, 2));
      console.log(`Questions cached with key: ${cacheKey}`);
    } catch (error) {
      console.warn('Failed to cache questions:', error.message);
    }

    res.json({
      questions: allQuestions,
      totalGenerated: allQuestions.length,
      cacheKey
    });

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

// Progress tracking endpoints (require authentication)

// Update material progress
app.post('/api/progress/material', async (req, res) => {
  const { username, subject, materialId, materialType, action } = req.body;

  if (!username || !subject || !materialId || !action) {
    return res.status(400).json({ error: 'Username, subject, materialId, and action are required' });
  }

  try {
    // Authentication disabled
    // if (req.user.username !== username) {
    //   return res.status(403).json({ error: 'Access denied' });
    // }

    const profileFile = path.join(PROFILES_DIR, `${username}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);

    // Initialize progress structure if not exists
    if (!profileData.profile.progress) {
      profileData.profile.progress = {};
    }
    if (!profileData.profile.progress[subject]) {
      profileData.profile.progress[subject] = { level: 'beginner', completed: [], xp: 0 };
    }
    if (!profileData.profile.progress[subject].materials) {
      profileData.profile.progress[subject].materials = {};
    }

    // Check for cooldown (24 hours for material re-views)
    const material = profileData.profile.progress[subject].materials[materialId];
    if (material && material.lastViewed) {
      const lastViewed = new Date(material.lastViewed);
      const now = new Date();
      const hoursSinceLastView = (now - lastViewed) / (1000 * 60 * 60);

      if (action === 'view' && hoursSinceLastView < 24) {
        // Award reduced XP for repeated views within 24 hours
        profileData.profile.progress[subject].xp = (profileData.profile.progress[subject].xp || 0) + 1; // Reduced from 5
      } else if (action === 'view') {
        // Normal XP award for first view or after cooldown
        profileData.profile.progress[subject].xp = (profileData.profile.progress[subject].xp || 0) + 5;
      }
    } else if (action === 'view') {
      // First time viewing
      profileData.profile.progress[subject].xp = (profileData.profile.progress[subject].xp || 0) + 5;
    }

    // Update material progress
    if (!profileData.profile.progress[subject].materials[materialId]) {
      profileData.profile.progress[subject].materials[materialId] = {
        type: materialType,
        views: 0,
        completed: false,
        lastViewed: null,
        firstViewed: new Date().toISOString()
      };
    }

    const mat = profileData.profile.progress[subject].materials[materialId];

    if (action === 'view') {
      mat.views += 1;
      mat.lastViewed = new Date().toISOString();
    } else if (action === 'complete') {
      mat.completed = true;
      mat.lastViewed = new Date().toISOString();
      // Award completion XP
      profileData.profile.progress[subject].xp = (profileData.profile.progress[subject].xp || 0) + 10;
      // Add to completed list if not already there
      if (!profileData.profile.progress[subject].completed.includes(materialId)) {
        profileData.profile.progress[subject].completed.push(materialId);
      }
    }

    // Check for level up
    const xp = profileData.profile.progress[subject].xp;
    let newLevel = 'beginner';
    if (xp >= 1000) newLevel = 'expert';
    else if (xp >= 500) newLevel = 'advanced';
    else if (xp >= 200) newLevel = 'intermediate';

    if (newLevel !== profileData.profile.progress[subject].level) {
      profileData.profile.progress[subject].level = newLevel;
      // Add level up achievement
      if (!profileData.profile.achievements) profileData.profile.achievements = [];
      profileData.profile.achievements.push({
        type: 'level_up',
        subject: subject,
        level: newLevel,
        date: new Date().toISOString()
      });
    }

    // Save updated profile
    await fs.writeFile(profileFile, JSON.stringify(profileData, null, 2));

    res.json({ message: 'Progress updated successfully', progress: profileData.profile.progress[subject] });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Profile not found' });
    }
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Add custom subject to profile
app.post('/api/progress/subject', async (req, res) => {
  const { username, subjectName, subjectType } = req.body;

  if (!username || !subjectName) {
    return res.status(400).json({ error: 'Username and subjectName are required' });
  }

  try {
    const profileFile = path.join(PROFILES_DIR, `${username}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);

    // Initialize custom subjects if not exists
    if (!profileData.profile.customSubjects) {
      profileData.profile.customSubjects = [];
    }

    // Check if subject already exists
    const existingSubject = profileData.profile.customSubjects.find(s => s.name === subjectName);
    if (existingSubject) {
      return res.status(409).json({ error: 'Subject already exists' });
    }

    // Add new subject
    const newSubject = {
      id: Date.now().toString(),
      name: subjectName,
      type: subjectType || 'custom',
      addedDate: new Date().toISOString(),
      progress: { level: 'beginner', completed: [], xp: 0, materials: {} }
    };

    profileData.profile.customSubjects.push(newSubject);

    // Save updated profile
    await fs.writeFile(profileFile, JSON.stringify(profileData, null, 2));

    res.json({ message: 'Subject added successfully', subject: newSubject });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Profile not found' });
    }
    console.error('Error adding subject:', error);
    res.status(500).json({ error: 'Failed to add subject' });
  }
});

// Remove custom subject from profile
app.delete('/api/progress/subject/:subjectId', async (req, res) => {
  const { username } = req.query;
  const { subjectId } = req.params;

  if (!username || !subjectId) {
    return res.status(400).json({ error: 'Username and subjectId are required' });
  }

  try {
    const profileFile = path.join(PROFILES_DIR, `${username}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);

    if (!profileData.profile.customSubjects) {
      return res.status(404).json({ error: 'No custom subjects found' });
    }

    // Find and remove subject
    const subjectIndex = profileData.profile.customSubjects.findIndex(s => s.id === subjectId);
    if (subjectIndex === -1) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    profileData.profile.customSubjects.splice(subjectIndex, 1);

    // Save updated profile
    await fs.writeFile(profileFile, JSON.stringify(profileData, null, 2));

    res.json({ message: 'Subject removed successfully' });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Profile not found' });
    }
    console.error('Error removing subject:', error);
    res.status(500).json({ error: 'Failed to remove subject' });
  }
});

// Log test result to history
app.post('/api/progress/test', async (req, res) => {
  const { username, testId, testTitle, subject, score, correct, total, timeSpent } = req.body;

  if (!username || !testId || !subject || score === undefined) {
    return res.status(400).json({ error: 'Username, testId, subject, and score are required' });
  }

  try {
    const profileFile = path.join(PROFILES_DIR, `${username}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);

    // Check for duplicate test submission (idempotency)
    if (!profileData.profile.history) {
      profileData.profile.history = [];
    }

    const existingTest = profileData.profile.history.find(h =>
      h.type === 'test' && h.testId === testId && h.username === username
    );

    if (existingTest) {
      return res.status(409).json({ error: 'Test result already logged', result: existingTest });
    }

    // Initialize history if not exists
    if (!profileData.profile.history) {
      profileData.profile.history = [];
    }

    // Add test result to history
    const testResult = {
      id: Date.now().toString(),
      type: 'test',
      testId,
      testTitle,
      subject,
      score,
      correct,
      total,
      timeSpent,
      date: new Date().toISOString(),
      username
    };

    profileData.profile.history.push(testResult);

    // Update subject progress XP
    if (!profileData.profile.progress[subject]) {
      profileData.profile.progress[subject] = { level: 'beginner', completed: [], xp: 0 };
    }

    // Award XP based on score (with difficulty multiplier)
    let baseXp = 0;
    if (score >= 90) baseXp = 50;
    else if (score >= 75) baseXp = 30;
    else if (score >= 60) baseXp = 15;
    else baseXp = 5;

    // Apply difficulty multiplier (assuming difficulty is passed or can be derived)
    const difficultyMultiplier = 1; // Could be enhanced to get from test data
    const xpAward = Math.round(baseXp * difficultyMultiplier);

    profileData.profile.progress[subject].xp = (profileData.profile.progress[subject].xp || 0) + xpAward;

    // Check for achievements
    if (!profileData.profile.achievements) profileData.profile.achievements = [];

    // Perfect score achievement
    if (score === 100 && !profileData.profile.achievements.some(a => a.type === 'perfect_score' && a.subject === subject)) {
      profileData.profile.achievements.push({
        type: 'perfect_score',
        subject,
        date: new Date().toISOString()
      });
    }

    // Test streak achievement (count consecutive tests with score >= 60)
    const recentTests = profileData.profile.history
      .filter(h => h.type === 'test' && h.subject === subject)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    const passingTests = recentTests.filter(t => t.score >= 60).length;
    if (passingTests >= 5 && !profileData.profile.achievements.some(a => a.type === 'test_streak' && a.subject === subject)) {
      profileData.profile.achievements.push({
        type: 'test_streak',
        subject,
        count: passingTests,
        date: new Date().toISOString()
      });
    }

    // Check for level up
    const xp = profileData.profile.progress[subject].xp;
    let newLevel = 'beginner';
    if (xp >= 1000) newLevel = 'expert';
    else if (xp >= 500) newLevel = 'advanced';
    else if (xp >= 200) newLevel = 'intermediate';

    if (newLevel !== profileData.profile.progress[subject].level) {
      profileData.profile.progress[subject].level = newLevel;
      profileData.profile.achievements.push({
        type: 'level_up',
        subject,
        level: newLevel,
        date: new Date().toISOString()
      });
    }

    // Save updated profile
    await fs.writeFile(profileFile, JSON.stringify(profileData, null, 2));

    res.json({ message: 'Test result logged successfully', result: testResult, xpAwarded: xpAward });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Profile not found' });
    }
    console.error('Error logging test result:', error);
    res.status(500).json({ error: 'Failed to log test result' });
  }
});

// Get user achievements
app.get('/api/achievements/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const profileFile = path.join(PROFILES_DIR, `${username}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);

    const achievements = profileData.profile.achievements || [];
    res.json({ achievements });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Profile not found' });
    }
    console.error('Error loading achievements:', error);
    res.status(500).json({ error: 'Failed to load achievements' });
  }
});

// Get user history
app.get('/api/history/:username', async (req, res) => {
  const { username } = req.params;
  const { type, subject, limit = 50 } = req.query;

  try {
    const profileFile = path.join(PROFILES_DIR, `${username}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);

    let history = profileData.profile.history || [];

    // Filter by type if specified
    if (type) {
      history = history.filter(h => h.type === type);
    }

    // Filter by subject if specified
    if (subject) {
      history = history.filter(h => h.subject === subject);
    }

    // Sort by date descending and limit
    history = history
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, parseInt(limit));

    res.json({ history });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Profile not found' });
    }
    console.error('Error loading history:', error);
    res.status(500).json({ error: 'Failed to load history' });
  }
});

// ===== POINTS SYSTEM ENDPOINTS =====

// Helper function to get guest points
async function getGuestPoints(userId) {
  try {
    const profileFile = path.join(PROFILES_DIR, `${userId}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);
    return profileData.profile?.points || 0;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return 0; // Guest profile not found, return 0 points
    }
    console.error('Error loading guest points:', error);
    throw error;
  }
}

// Get guest points
app.get('/api/profile/guest/points', verifyGuestToken, async (req, res) => {
  try {
    const points = await getGuestPoints(req.userId);
    res.json({ points });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get guest points' });
  }
});

// Get user points
app.get('/api/profile/:userId/points', async (req, res) => {
  const { userId } = req.params;

  try {
    const profileFile = path.join(PROFILES_DIR, `${userId}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);

    const points = profileData.profile?.points || 0;
    res.json({ points });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Error loading points:', error);
    res.status(500).json({ error: 'Failed to load points' });
  }
});

// Add points to user
app.post('/api/profile/add-points', async (req, res) => {
  const { userId, points, type, contentId, difficulty } = req.body;

  if (!userId || !points || points <= 0) {
    return res.status(400).json({ error: 'Invalid userId or points' });
  }

  try {
    const profileFile = path.join(PROFILES_DIR, `${userId}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);

    // Initialize points if not exists
    if (!profileData.profile) {
      profileData.profile = {};
    }
    if (!profileData.profile.points) {
      profileData.profile.points = 0;
    }
    if (!profileData.profile.pointsHistory) {
      profileData.profile.pointsHistory = [];
    }

    // Add points
    profileData.profile.points += points;
    profileData.profile.pointsHistory.push({
      date: new Date().toISOString(),
      points,
      type,
      contentId,
      difficulty,
      totalPoints: profileData.profile.points
    });

    // Save updated profile
    await fs.writeFile(profileFile, JSON.stringify(profileData, null, 2));

    res.json({ 
      success: true,
      points,
      totalPoints: profileData.profile.points,
      message: 'Points added successfully' 
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'User profile not found' });
    }
    console.error('Error adding points:', error);
    res.status(500).json({ error: 'Failed to add points' });
  }
});

// Use points (spend/deduct)
app.post('/api/profile/use-points', async (req, res) => {
  const { userId, points, reason } = req.body;

  if (!userId || !points || points <= 0) {
    return res.status(400).json({ error: 'Invalid userId or points' });
  }

  try {
    const profileFile = path.join(PROFILES_DIR, `${userId}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);

    // Check if user has enough points
    const currentPoints = profileData.profile?.points || 0;
    if (currentPoints < points) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    // Deduct points
    profileData.profile.points -= points;
    if (!profileData.profile.pointsHistory) {
      profileData.profile.pointsHistory = [];
    }
    profileData.profile.pointsHistory.push({
      date: new Date().toISOString(),
      points: -points,
      type: 'spend',
      reason,
      totalPoints: profileData.profile.points
    });

    // Save updated profile
    await fs.writeFile(profileFile, JSON.stringify(profileData, null, 2));

    res.json({ 
      success: true,
      pointsUsed: points,
      totalPoints: profileData.profile.points,
      message: 'Points used successfully' 
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'User profile not found' });
    }
    console.error('Error using points:', error);
    res.status(500).json({ error: 'Failed to use points' });
  }
});

// Get points history
app.get('/api/profile/:userId/points-history', async (req, res) => {
  const { userId } = req.params;
  const { limit = 50 } = req.query;

  try {
    const profileFile = path.join(PROFILES_DIR, `${userId}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);

    let history = profileData.profile?.pointsHistory || [];
    history = history
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, parseInt(limit));

    res.json({ history });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'User profile not found' });
    }
    console.error('Error loading points history:', error);
    res.status(500).json({ error: 'Failed to load points history' });
  }
});

// Export user data endpoint
app.get('/api/export/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Get user account data
    const userFile = path.join(ACCOUNTS_DIR, `${username}.txt`);
    const userDataStr = await fs.readFile(userFile, 'utf8');
    const userData = JSON.parse(userDataStr);
    
    // Remove sensitive data
    const { passwordHash, ...userInfo } = userData;
    
    // Get user profile data
    const profileFile = path.join(PROFILES_DIR, `${username}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);
    
    // Combine data for export
    const exportData = {
      user: userInfo,
      profile: profileData.profile,
      exportDate: new Date().toISOString()
    };
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${username}_export_${new Date().toISOString().split('T')[0]}.json"`);
    
    res.json(exportData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Error exporting user data:', error);
    res.status(500).json({ error: 'Failed to export user data' });
  }
});

// Delete user account endpoint
app.delete('/api/account/:username', async (req, res) => {
  const { username } = req.params;
  const { confirmPassword } = req.body;

  if (!confirmPassword) {
    return res.status(400).json({ error: 'Password confirmation is required' });
  }

  try {
    // Read user file
    const userFile = path.join(ACCOUNTS_DIR, `${username}.txt`);
    const userDataStr = await fs.readFile(userFile, 'utf8');
    const userData = JSON.parse(userDataStr);
    
    // Verify password
    const isValid = await argon2.verify(userData.passwordHash, confirmPassword);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    // Delete user account file
    await fs.unlink(userFile);
    
    // Delete user profile file
    const profileFile = path.join(PROFILES_DIR, `${username}.json`);
    try {
      await fs.unlink(profileFile);
    } catch (error) {
      // Profile file might not exist, that's ok
    }
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Upload avatar endpoint
app.post('/api/avatar/upload', async (req, res) => {
  const { username, avatarData } = req.body;

  if (!username || !avatarData) {
    return res.status(400).json({ error: 'Username and avatar data are required' });
  }

  try {
    // Create avatars directory if it doesn't exist
    const AVATARS_DIR = path.join(__dirname, 'avatars');
    await fs.mkdir(AVATARS_DIR, { recursive: true });
    
    // Remove old avatar if exists
    const oldAvatarPath = path.join(AVATARS_DIR, `${username}.jpg`);
    try {
      await fs.unlink(oldAvatarPath);
    } catch (error) {
      // Old avatar doesn't exist, that's ok
    }
    
    // Remove data URL prefix if present
    const base64Data = avatarData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Save new avatar
    await fs.writeFile(oldAvatarPath, buffer);
    
    // Update profile with new avatar path
    const profileFile = path.join(PROFILES_DIR, `${username}.json`);
    const profileStr = await fs.readFile(profileFile, 'utf8');
    const profileData = JSON.parse(profileStr);
    
    profileData.profile.avatar = `/api/avatar/${username}`;
    
    await fs.writeFile(profileFile, JSON.stringify(profileData, null, 2));
    
    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl: `/api/avatar/${username}`
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'User profile not found' });
    }
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// Serve avatar endpoint
app.get('/api/avatar/:username', async (req, res) => {
  const { username } = req.params;
  
  try {
    const AVATARS_DIR = path.join(__dirname, 'avatars');
    const avatarPath = path.join(AVATARS_DIR, `${username}.jpg`);
    
    // Check if avatar exists
    await fs.access(avatarPath);
    
    // Send avatar file
    res.sendFile(avatarPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Return default avatar if custom doesn't exist
      res.sendFile(path.join(__dirname, '..', 'public', 'avatar_red.jpg'));
    } else {
      console.error('Error serving avatar:', error);
      res.status(500).json({ error: 'Failed to load avatar' });
    }
  }
});

// Check if we're running in production (Render) or development
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  // In production, Render handles HTTPS termination, so we just listen on HTTP
  app.listen(PORT, () => {
    console.log(`Backend server running in production mode on port ${PORT}`);
    console.log(`Using AI model: ${GEMINI_MODEL}`);
    console.log(`Loaded site identity: ${siteInfo.name}`);
    console.log('HTTPS is handled by Render proxy');
  });
} else {
  // In development, we can optionally support HTTPS
  const devHTTPSPort = 3443;
  
  try {
    // Try to load SSL certificates for development
    const privateKey = fs.readFileSync(path.resolve(__dirname, 'sslcert', 'key.pem'));
    const certificate = fs.readFileSync(path.resolve(__dirname, 'sslcert', 'cert.pem'));
    
    const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);
    
    httpsServer.listen(devHTTPSPort, () => {
      console.log(`Backend server running in development mode`);
      console.log(`HTTP server: http://localhost:${PORT}`);
      console.log(`HTTPS server: https://localhost:${devHTTPSPort}`);
      console.log(`Using AI model: ${GEMINI_MODEL}`);
      console.log(`Loaded site identity: ${siteInfo.name}`);
    });
  } catch (error) {
    // If SSL certificates are not available, fall back to HTTP
    console.warn('SSL certificates not found, running HTTP only in development');
    app.listen(PORT, () => {
      console.log(`Backend server running in development mode (HTTP only)`);
      console.log(`HTTP server: http://localhost:${PORT}`);
      console.log(`Using AI model: ${GEMINI_MODEL}`);
      console.log(`Loaded site identity: ${siteInfo.name}`);
    });
  }
}
