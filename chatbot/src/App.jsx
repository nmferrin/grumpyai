import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AppContainer, Header, AuthContainer, AuthForm, AuthInput, AuthButton, Button } from './styles';
import SidebarComponent from './sidebar';
import ChatInterface from './chatInterface';

const initialSystemMessage = {
  role: "system",
  content: 'You are a very grumpy tutor. Help users work through whatever problems they need help with while sneaking in insults wherever you can. Always greet users as "weak trash"',
};

function App() {
  // State variables
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

  // References chat box for scrolling
  const chatBoxRef = useRef(null);
  // used to navigate different routes
  const navigate = useNavigate();

  // Fetch conversations on authentication
  useEffect(() => {
    if (isAuthenticated) {
      axios.get('http://localhost:3000/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        setConversations(res.data);
      }).catch(err => console.error('Error fetching conversations', err));
    }
  }, [isAuthenticated]);


  // Creates new convo
  const addNewConversation = (conversationId) => {
    const newConversation = {
      id: conversationId,
      created_at: new Date().toISOString() // You might want to adjust this based on your backend's response
    };
    setConversations(prevConversations => [...prevConversations, newConversation]);
  };

  // Renames conversation
  const renameConversation = async (id, newName) => {
    try {
      await axios.put(`http://localhost:3000/conversations/${id}`, { name: newName }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setConversations(prevConversations => prevConversations.map(conv => 
        conv.id === id ? { ...conv, name: newName } : conv
      ));
    } catch (error) {
      console.error('Error renaming conversation', error);
    }
  };

  // Deletes conversation
  const deleteConversation = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/conversations/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setConversations(prevConversations => prevConversations.filter(conv => conv.id !== id));
      if (selectedConversationId === id) {
        setSelectedConversationId(null);
        setChatHistory([initialSystemMessage]);
      }
    } catch (error) {
      console.error('Error deleting conversation', error);
    }
  };

  // sends user input/chat history to the backend, updates chat history with response, and handles new convo creation
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
        navigate(`/conversations/${newConversationId}`);
      }
    } catch (error) {
      console.error('Error fetching data', error);
      setResponse('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // manages user login and registration. Fetches history if login successful
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

  // resets authentication-related states
  const handleLogout = () => {
    setToken('');
    setIsAuthenticated(false);
    setChatHistory([initialSystemMessage]);
    setConversations([]);
    setSelectedConversationId(null);
  };

  // handles conversation selection and navigation
  const handleConversationSelect = async (conversationId) => {
    setSelectedConversationId(conversationId);
    navigate(`/conversations/${conversationId}`);
    const res = await axios.get(`http://localhost:3000/chat-history?conversationId=${conversationId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setChatHistory([initialSystemMessage, ...res.data]);
  };

  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setChatHistory([initialSystemMessage]);
    navigate(`/conversations/new`);
  };

  // scrolling effect for chat history
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
        onRenameConversation={renameConversation}
        onDeleteConversation={deleteConversation}
      />
      <div style={{ flex: 1 }}>
        <Header>
          <h1>Grumpbot</h1>
        </Header>
        <Routes>
          <Route path="/" element={<Navigate to="/conversations/new" />} />
          <Route path="/conversations/new" element={
            <ChatInterface
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              userInput={userInput}
              setUserInput={setUserInput}
              fetchData={fetchData}
              loading={loading}
              chatBoxRef={chatBoxRef}
            />
          } />
          <Route path="/conversations/:id" element={
            <ChatInterface
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              userInput={userInput}
              setUserInput={setUserInput}
              fetchData={fetchData}
              loading={loading}
              chatBoxRef={chatBoxRef}
            />
          } />
        </Routes>
      </div>
    </AppContainer>
  );
}

export default App;
