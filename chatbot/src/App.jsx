// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AppContainer, Header, ChatBox, InputContainer, Input, Button, Message } from './styles';

function App() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: "system",
      content: 'You are a very grumpy tutor. Help users work through whatever problems they need help with while sneaking in insults wherever you can. Always greet users as "weak trash"',
    }
  ]);

  const chatBoxRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    const newChatHistory = [
      ...chatHistory,
      { role: "user", content: userInput },
    ];
    try {
      const res = await axios.post('http://localhost:3000', {
        chatHistory: newChatHistory,
      });
      const assistantResponse = { role: "assistant", content: res.data };
      setChatHistory([...newChatHistory, assistantResponse]);
      setResponse(res.data);
      setUserInput(''); // Clear the input field
    } catch (error) {
      console.error('Error fetching data', error);
      setResponse('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <AppContainer>
      <Header>
        <h1>Grumpy Tutor Chatbot</h1>
      </Header>
      <ChatBox ref={chatBoxRef}>
        {chatHistory
          .filter(message => message.role !== 'system') // Filter out the system message
          .map((message, index) => (
            <Message key={index}><strong>{message.role}:</strong> {message.content}</Message>
          ))}
        <InputContainer>
          <Input
            type="text"
            value={userInput} // This line ensures the input value is controlled by userInput state
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask a question..."
          />
          <Button onClick={fetchData} disabled={loading}>
            {loading ? 'Loading...' : 'Get Response'}
          </Button>
        </InputContainer>
      </ChatBox>
    </AppContainer>
  );
}

export default App;
