const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.post('/', async (req, res) => {
  const chatHistory = req.body.chatHistory;
  let content = await main(chatHistory);
  res.send(content);
});

async function main(chatHistory) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: chatHistory,
    temperature: 1.3,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return response.choices[0].message.content;
}

app.listen(port, () => {
  console.log(`Chatbot server running at http://localhost:${port}`);
});
