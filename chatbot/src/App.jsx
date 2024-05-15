import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AppContainer, Header, ChatBox, InputContainer, Input, Button, Message, AuthContainer, AuthForm, AuthInput, AuthButton } from './styles';
import SidebarComponent from './sidebar';

const initialSystemMessage = {
  role: "system",
  content: 'You are a very grumpy tutor. Help users work through whatever problems they need help with while sneaking in insults wherever you can. Always greet users as "weak trash"',
};

function App() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([initialSystemMessage]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authDetails, setAuthDetails] = useState({ username: '', password: '', email: '' });
  const [token, setToken] = useState('');
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('http://localhost:3000/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        setConversations(res.data);
      }).catch(err => console.error('Error fetching conversations', err));
    }
  }, [isAuthenticated]);

  const addNewConversation = (conversationId) => {
    const newConversation = {
      id: conversationId,
      created_at: new Date().toISOString() // You might want to adjust this based on your backend's response
    };
    setConversations(prevConversations => [...prevConversations, newConversation]);
  };

  const fetchData = async () => {
    setLoading(true);
    const newChatHistory = [
      ...chatHistory,
      { role: "user", content: userInput },
    ];
    try {
      const res = await axios.post('http://localhost:3000/chat', {
        chatHistory: newChatHistory,
        conversationId: selectedConversationId,
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const assistantResponse = { role: "assistant", content: res.data.assistantMessage.content };
      setChatHistory([...newChatHistory, assistantResponse]);
      setResponse(res.data.assistantMessage.content);
      setUserInput('');
      if (!selectedConversationId) {
        const newConversationId = res.data.conversationId;
        setSelectedConversationId(newConversationId);
        addNewConversation(newConversationId);
      }
    } catch (error) {
      console.error('Error fetching data', error);
      setResponse('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    const endpoint = authMode === 'login' ? 'login' : 'register';
    try {
      const res = await axios.post(`http://localhost:3000/${endpoint}`, authDetails);
      if (authMode === 'login') {
        setToken(res.data.token);
        setIsAuthenticated(true);
        const chatHistoryRes = await axios.get('http://localhost:3000/chat-history', {
          headers: { 'Authorization': `Bearer ${res.data.token}` }
        });
        setChatHistory([initialSystemMessage, ...chatHistoryRes.data]);
      } else {
        alert('Registration successful, please log in.');
        setAuthMode('login');
      }
    } catch (error) {
      console.error(`Error during ${authMode}`, error);
      alert(`Error during ${authMode}`);
    }
  };

  const handleLogout = () => {
    setToken('');
    setIsAuthenticated(false);
    setChatHistory([initialSystemMessage]);
    setConversations([]);
    setSelectedConversationId(null);
  };

  const handleConversationSelect = async (conversationId) => {
    setSelectedConversationId(conversationId);
    const res = await axios.get(`http://localhost:3000/chat-history?conversationId=${conversationId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setChatHistory([initialSystemMessage, ...res.data]);
  };

  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setChatHistory([initialSystemMessage]);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  if (!isAuthenticated) {
    return (
      <AuthContainer>
        <AuthForm>
          {authMode === 'register' && (
            <AuthInput
              type="email"
              placeholder="Email"
              value={authDetails.email}
              onChange={(e) => setAuthDetails({ ...authDetails, email: e.target.value })}
            />
          )}
          <AuthInput
            type="text"
            placeholder="Username"
            value={authDetails.username}
            onChange={(e) => setAuthDetails({ ...authDetails, username: e.target.value })}
          />
          <AuthInput
            type="password"
            placeholder="Password"
            value={authDetails.password}
            onChange={(e) => setAuthDetails({ ...authDetails, password: e.target.value })}
          />
          <AuthButton onClick={handleAuth}>
            {authMode === 'login' ? 'Login' : 'Register'}
          </AuthButton>
          <Button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
            {authMode === 'login' ? 'Switch to Register' : 'Switch to Login'}
          </Button>
        </AuthForm>
      </AuthContainer>
    );
  }

  return (
    <AppContainer>
      <SidebarComponent
        conversations={conversations}
        onSelectConversation={handleConversationSelect}
        onNewConversation={handleNewConversation}
        onLogout={handleLogout}
      />
      <div style={{ flex: 1 }}>
        <Header>
          <h1>Grumpbot</h1>
        </Header>
        <ChatBox ref={chatBoxRef}>
          {chatHistory
            .filter(message => message.role !== 'system' || message.content !== initialSystemMessage.content) // Filter out the system message from display
            .map((message, index) => (
              <Message key={index}><strong>{message.role}:</strong> {message.content}</Message>
            ))}
        </ChatBox>
        <InputContainer>
          <Input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask a question..."
          />
          <Button onClick={fetchData} disabled={loading}>
            {loading ? 'Loading...' : 'Get Response'}
          </Button>
        </InputContainer>
      </div>
    </AppContainer>
  );
}

export default App;
