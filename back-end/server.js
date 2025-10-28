const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { siteInfo } = require('./config/siteInfo.js');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  // Add site context to the prompt
  const contextPrompt = `You are Gemma 2, an AI assistant on the Alphearea educational platform. ${siteInfo.description} ${siteInfo.purpose}

Site information:
- Name: ${siteInfo.name}
- Purpose: ${siteInfo.purpose}
- Description: ${siteInfo.description}

If asked about the site, respond based on this information. Always be helpful and educational.

User question: ${message}`;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'gemma2:2b',
      prompt: contextPrompt,
      stream: false
    });

    res.json({ response: response.data.response });
  } catch (error) {
    console.error('Error communicating with Ollama:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
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
  console.log(`Loaded site identity: ${siteInfo.name}`);
});
