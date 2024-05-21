import React from 'react';
import { ChatBox, InputContainer, Input, Button, Message } from './styles';

const initialSystemMessage = {
  role: "system",
  content: 'You are a very grumpy tutor. Help users work through whatever problems they need help with while sneaking in insults wherever you can. Always greet users as "weak trash"',
};

const ChatInterface = ({ chatHistory, setChatHistory, userInput, setUserInput, fetchData, loading, chatBoxRef }) => {
  return (
    <>
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
    </>
  );
};

export default ChatInterface;
