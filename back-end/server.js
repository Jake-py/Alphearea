const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { siteInfo } = require('./config/siteInfo.js');

const app = express();
const PORT = process.env.PORT || 3002;

// Environment variable for Ollama URL, defaults to localhost for local development
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';

// Simple rate limiting (in production, use a proper library like express-rate-limit)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP

app.use(cors());
app.use(express.json());

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
    const response = await axios.post(OLLAMA_URL, {
      model: 'gemma2:2b',
      prompt: contextPrompt,
      stream: false
    }, {
      timeout: 60000 // 60 seconds timeout
    });

    res.json({ response: response.data.response });
  } catch (error) {
    console.error('Error communicating with Ollama:', error.message);

    if (error.code === 'ECONNREFUSED') {
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

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Ollama URL: ${OLLAMA_URL}`);
  console.log(`Loaded site identity: ${siteInfo.name}`);
});
