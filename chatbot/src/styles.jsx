import styled from 'styled-components';

export const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  color: #ffffff;
  font-family: 'Arial', sans-serif;
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
  flex: 1;
  background-color: #2e2e3e;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  max-height: 75vh;
  margin-bottom: 90px; /* Adjusted to avoid overlap with InputContainer */
  margin-left: auto;
  margin-right: auto;
  width: 40%; /* Adjust the width as needed */
`;

export const InputContainer = styled.div`
  flex: 1;
  max-width: 800px;
  position: fixed;
  bottom: 20px;
  display: flex;
  background-color: #2e2e3e;
  border-radius: 8px;
  padding: 10px;
  height: 70px;
  width: calc(100% - 250px); /* Adjusted to account for Sidebar width */
  left: 50%;
  transform: translateX(-50%);
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
    background-color: #a566db;
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

export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #2e2e3e;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const AuthForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  background-color: #1e1e2e;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const AuthInput = styled.input`
  padding: 10px;
  border: none;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #2e2e3e;
  color: #ffffff;
  font-weight: 600;
  font-size: 18px;
`;

export const AuthButton = styled.button`
  padding: 10px;
  background-color: #bb86fc;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #ffffff;
  transition: background-color 0.3s;
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 10px;

  &:hover {
    background-color: #a566db;
  }
`;

export const Sidebar = styled.div`
  width: 250px;
  background-color: #1e1e2e;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  height: 100vh;
  position: fixed;
`;

export const ProfileDropdown = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .dropdown {
    position: relative;
    display: inline-block;
    
    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #2e2e3e;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      z-index: 1;
      border-radius: 4px;
      right: 0;

      a {
        color: white;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        &:hover {
          background-color: #3e3e4e;
        }
      }
    }

    &:hover .dropdown-content {
      display: block;
    }
  }
`;
