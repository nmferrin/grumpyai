// src/styles.js
import styled from 'styled-components';

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  color: #ffffff;
  font-family: 'Arial', sans-serif;
  padding: 20px;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;

  h1 {
    font-size: 1.5em;
    color: #bb86fc;
  }
`;

export const ChatBox = styled.div`
  width: 60%;
  max-width: 800px;
  background-color: #2e2e3e;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  max-height: 75vh;
`;

export const InputContainer = styled.div`
  width: 60%;
  max-width: 800px;
  position: fixed;
  bottom: 20px;
  display: flex;
  background-color: #2e2e3e;
  border-radius: 8px;
  padding: 10px;
  height: 70px;
`;

export const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  margin-right: 10px;
  background-color: #1e1e2e;
  color: #ffffff;
  font-weight: 600;
  font-size: 18px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  background-color: #bb86fc;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #ffffff;
  transition: background-color 0.3s;
  font-weight: 500;
  font-size: 18px;

  &:hover {
    background-color: #bb86fc;
  }

  &:disabled {
    background-color: #444;
    cursor: not-allowed;
  }
`;

export const Message = styled.p`
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  max-width: 100%;
  font-size: 18px;
  font-weight: 400;

  strong {
    color: #bb86fc;
  }
`;
