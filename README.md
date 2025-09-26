# CarbonCtrl

A gamified environmental education platform with interactive 3D globe, quizzes, missions, and AI-powered learning assistant.

## Features

- 🌍 Interactive 3D Earth with mission locations
- 🎮 Gamified learning with EcoCoins rewards
- 🤖 AI chatbot (EcoBot) for environmental education
- 📚 Quizzes and missions on climate change topics
- 🏆 Leaderboards and progress tracking
- 🔥 Firebase authentication
- ⚡ Vite + React + TypeScript

## Tech Stack

- **Frontend**: React 18 + React Router 6 + TypeScript + Vite + TailwindCSS
- **Backend**: Express server with OpenAI integration
- **Database**: Firebase
- **3D Graphics**: Three.js + React Three Fiber
- **UI**: Radix UI + TailwindCSS + Lucide React icons
- **AI**: OpenAI GPT for educational chatbot

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env` file in the project root:

```bash
# OpenAI API Key (required for chatbot)
OPENAI_API_KEY=your_openai_api_key_here

# Optional
PING_MESSAGE=ping
```

## Deployment

This project is configured for Vercel deployment with serverless functions for the Express API.

## License

MIT
