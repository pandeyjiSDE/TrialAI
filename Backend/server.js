// server.js
require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA routing fallback (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Initialize the GenAI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// A POST route to handle requests from our frontend
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Call the Gemini model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    // Send the response back to the frontend
    res.json({ generatedText });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Send a helpful error message to the frontend
    res.status(500).json({ error: 'Failed to generate content. Please try again later.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


