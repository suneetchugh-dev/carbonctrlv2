import { render, screen, fireEvent } from '@testing-library/react';
import { Chatbot } from './Chatbot';

// Mock the API call
global.fetch = jest.fn();

describe('Chatbot Component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders chatbot toggle button when closed', () => {
    render(<Chatbot isOpen={false} onToggle={() => {}} />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('chatbot-toggle')).toBeInTheDocument();
  });

  it('opens chatbot panel when toggle button is clicked', () => {
    const mockToggle = jest.fn();
    render(<Chatbot isOpen={false} onToggle={mockToggle} />);
    
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    expect(mockToggle).toHaveBeenCalled();
  });

  it('displays welcome message when opened', () => {
    render(<Chatbot isOpen={true} onToggle={() => {}} />);
    
    expect(screen.getByText(/Hi! I'm EcoBot/)).toBeInTheDocument();
    expect(screen.getByText(/environmental learning assistant/)).toBeInTheDocument();
  });

  it('shows quick actions for new users', () => {
    render(<Chatbot isOpen={true} onToggle={() => {}} />);
    
    expect(screen.getByText('Quick actions:')).toBeInTheDocument();
    expect(screen.getByText('Climate Basics')).toBeInTheDocument();
    expect(screen.getByText('Renewable Energy')).toBeInTheDocument();
  });

  it('allows typing in input field', () => {
    render(<Chatbot isOpen={true} onToggle={() => {}} />);
    
    const input = screen.getByPlaceholderText(/Ask about climate change/);
    fireEvent.change(input, { target: { value: 'What is climate change?' } });
    
    expect(input).toHaveValue('What is climate change?');
  });

  it('sends message when enter key is pressed', () => {
    const mockToggle = jest.fn();
    render(<Chatbot isOpen={true} onToggle={mockToggle} />);
    
    const input = screen.getByPlaceholderText(/Ask about climate change/);
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
    
    // The message should be sent (we can't test the actual API call without mocking)
    expect(input).toHaveValue('');
  });
});

