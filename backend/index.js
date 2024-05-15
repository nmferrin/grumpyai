const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const cors = require('cors');
const { app: authApp, authenticateToken } = require('./auth');
const pool = require('./db');

require('dotenv').config();

const app = express();
const port = 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use(authApp);

// Fetch the list of saved conversations
app.get('/conversations', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query('SELECT id, created_at, name FROM conversations WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/chat', authenticateToken, async (req, res) => {
  const { chatHistory, conversationId } = req.body;
  const userId = req.user.userId;

  try {
    let convId = conversationId;

    if (!conversationId) {
      const conversation = await pool.query('INSERT INTO conversations (user_id) VALUES ($1) RETURNING id', [userId]);
      convId = conversation.rows[0].id;
    }

    for (const message of chatHistory) {
      await pool.query(
        'INSERT INTO chats (conversation_id, user_id, role, content) VALUES ($1, $2, $3, $4)',
        [convId, userId, message.role, message.content]
      );
    }

    const content = await main(chatHistory);
    const assistantMessage = { role: "assistant", content };
    await pool.query(
      'INSERT INTO chats (conversation_id, user_id, role, content) VALUES ($1, $2, $3, $4)',
      [convId, userId, assistantMessage.role, assistantMessage.content]
    );

    res.json({ assistantMessage, conversationId: convId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/conversations/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.userId;

  try {
    await pool.query('UPDATE conversations SET name = $1 WHERE id = $2 AND user_id = $3', [name, id, userId]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/conversations/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    await pool.query('DELETE FROM chats WHERE conversation_id = $1 AND user_id = $2', [id, userId]);
    await pool.query('DELETE FROM conversations WHERE id = $1 AND user_id = $2', [id, userId]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/chat-history', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.query.conversationId;
  try {
    const result = await pool.query('SELECT role, content FROM chats WHERE user_id = $1 AND conversation_id = $2 ORDER BY created_at ASC', [userId, conversationId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
