import { RequestHandler } from "express";

interface ChatbotRequest {
  message: string;
  systemPrompt: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

interface ChatbotResponse {
  response: string;
}

export const handleChatbot: RequestHandler = async (req, res) => {
  try {
    const { message, systemPrompt, conversationHistory }: ChatbotRequest = req.body;

    if (!message || !systemPrompt) {
      return res.status(400).json({ error: 'Message and system prompt are required' });
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_KEY;
    if (!openaiApiKey) {
      return res.status(400).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in the project root .env and restart dev server.',
        errorCode: 'NO_OPENAI_KEY'
      });
    }

    // Prepare messages for OpenAI API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('OpenAI API error:', errorData || response.statusText);
      return res.status(502).json({ 
        error: 'Failed to get response from AI assistant',
        errorCode: 'UPSTREAM_ERROR'
      });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({ 
        error: 'No response from AI assistant' 
      });
    }

    const result: ChatbotResponse = {
      response: aiResponse
    };

    res.json(result);
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

export const handleChatbotHealth: RequestHandler = (_req, res) => {
  const key = process.env.OPENAI_API_KEY ?? "";
  const hasKey = Boolean(key);
  const masked = hasKey ? `${key.slice(0, 6)}...${key.slice(-4)}` : null;
  res.json({ hasKey, keySample: masked });
};

