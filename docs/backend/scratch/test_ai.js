const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;
console.log('Using API Key:', apiKey);

const run = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    console.log('Client initialized.');
    
    console.log('Sending test request to gemini-2.5-flash...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Hello, this is a test from CareerGenie developer.',
    });
    
    console.log('Response text:', response.text);
  } catch (error) {
    console.error('Error occurred:', error.stack || error.message);
  }
};

run();
