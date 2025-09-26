# EcoBot Chatbot Setup

## Overview
EcoBot is an AI-powered environmental learning assistant integrated into CarbonCtrl. It helps students learn about climate change, sustainability, and environmental science through interactive conversations.

## Features
- **Educational Focus**: Specialized in environmental science and climate topics
- **Guardrails**: Strict content filtering to maintain educational focus
- **Quick Actions**: Pre-defined prompts for common environmental topics
- **Context Awareness**: Understands CarbonCtrl features and missions
- **Student-Friendly**: Age-appropriate responses with encouraging tone

## Setup Instructions

### 1. Environment Configuration
Create a `.env` file in the project root with your OpenAI API key:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

### 3. Install Dependencies
The required dependencies are already included in the project:
- `openai` (via fetch API calls)
- React components for UI
- Framer Motion for animations

### 4. Start the Development Server
```bash
pnpm dev
```

## Usage

### For Students
1. Click the chat bubble icon in the bottom-right corner
2. Ask questions about climate change, sustainability, or environmental science
3. Use quick action buttons for common topics
4. Get personalized learning recommendations

### For Teachers
- Monitor student interactions through the chatbot
- Use as a teaching aid for environmental education
- Encourage students to explore different topics

## Guardrails and Safety

### Content Restrictions
- **ONLY** environmental science and climate topics
- No personal advice or medical information
- Age-appropriate content for students
- Educational focus maintained at all times

### Response Guidelines
- Encouraging and supportive tone
- Scientifically accurate information
- References to CarbonCtrl features when relevant
- Simple language appropriate for students

### Redirect Behavior
If users ask about non-environmental topics, EcoBot will:
1. Politely acknowledge the question
2. Redirect to environmental education
3. Suggest relevant CarbonCtrl features
4. Maintain helpful and educational tone

## API Endpoints

### POST /api/chatbot
Handles chatbot conversations with OpenAI integration.

**Request Body:**
```json
{
  "message": "What is climate change?",
  "systemPrompt": "You are EcoBot...",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous message"
    }
  ]
}
```

**Response:**
```json
{
  "response": "Climate change refers to long-term shifts in global temperatures..."
}
```

## Customization

### System Prompt
The system prompt can be modified in `client/components/chatbot/Chatbot.tsx` to:
- Change the assistant's personality
- Add new guardrails
- Include additional context about CarbonCtrl features

### Quick Actions
Add new quick action buttons in the `quickActions` array:
```typescript
const quickActions = [
  { icon: BookOpen, text: "New Topic", prompt: "Tell me about..." },
  // ... existing actions
];
```

### UI Styling
The chatbot uses Tailwind CSS classes and can be customized by modifying the component styles in `Chatbot.tsx`.

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured" error**
   - Ensure your `.env` file contains a valid `OPENAI_API_KEY`
   - Restart the development server after adding the key

2. **Chatbot not responding**
   - Check browser console for API errors
   - Verify OpenAI API key is valid and has credits
   - Ensure network connection is stable

3. **Styling issues**
   - Check that Tailwind CSS is properly configured
   - Verify all UI components are imported correctly

### Debug Mode
Enable debug logging by adding console.log statements in the chatbot component or API route.

## Security Considerations

- API key is stored server-side only
- No sensitive data is logged or stored
- Conversation history is not persisted
- All requests are validated and sanitized

## Future Enhancements

- Conversation history persistence
- Integration with user progress tracking
- Advanced topic recommendations
- Multi-language support
- Voice interaction capabilities

