// src/__tests__/App.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from '../App';

jest.mock('axios');

describe('App', () => {
  it('renders the Grumpy Tutor Chatbot title', () => {
    render(<App />);
    expect(screen.getByText('Grumpy Tutor Chatbot')).toBeInTheDocument();
  });

  it('sends a message and receives a response', async () => {
    axios.post.mockResolvedValue({
      data: 'This is a grumpy response',
    });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Ask a question...'), {
      target: { value: 'Hello!' },
    });
    fireEvent.click(screen.getByText('Get Response'));

    await waitFor(() => {
      expect(screen.getByText('user: Hello!')).toBeInTheDocument();
      expect(screen.getByText('assistant: This is a grumpy response')).toBeInTheDocument();
    });
  });

  it('clears the input field after sending a message', async () => {
    axios.post.mockResolvedValue({
      data: 'This is a grumpy response',
    });

    render(<App />);

    const inputField = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(inputField, { target: { value: 'Hello!' } });
    fireEvent.click(screen.getByText('Get Response'));

    await waitFor(() => {
      expect(inputField.value).toBe('');
    });
  });
});
