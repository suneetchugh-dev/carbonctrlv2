import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  AlertCircle,
  Sparkles,
  BookOpen,
  Lightbulb,
  Globe,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SYSTEM_PROMPT = `You are EcoBot, an AI assistant for CarbonCtrl, a gamified environmental education platform. Your role is to help students learn about climate change, sustainability, and environmental science.

CONTEXT:
- CarbonCtrl is an educational platform with interactive 3D globe, quizzes, missions, games, and leaderboards
- Students earn EcoCoins by completing environmental challenges
- Missions include: Solar Revolution (Delhi), Carbon Footprint Simulator (Beijing), Arctic Ecosystem Protector (Moscow), etc.
- Quiz topics: Climate Basics, Carbon Footprint 101, Renewable Energy, Sustainable Cities, Climate Policy
- Target audience: Students, teachers, and schools learning about environmental science

GUARDRAILS:
1. ONLY discuss topics related to environmental science, climate change, sustainability, and CarbonCtrl features
2. Provide educational, age-appropriate content suitable for students
3. Encourage learning through gamification and positive reinforcement
4. Never provide personal advice, medical information, or non-environmental topics
5. If asked about non-environmental topics, politely redirect to environmental education
6. Always maintain a helpful, encouraging, and educational tone
7. Use simple language appropriate for students while being scientifically accurate
8. Suggest CarbonCtrl features when relevant (quizzes, missions, games)

RESPONSE STYLE:
- Be encouraging and supportive
- Use emojis sparingly and appropriately (🌱, 🌍, ⚡, 🌞, etc.)
- Provide actionable learning suggestions
- Reference CarbonCtrl features when helpful
- Keep responses concise but informative
- Ask follow-up questions to encourage deeper learning`;

export default function Chatbot({ isOpen, onToggle }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm EcoBot, your environmental learning assistant! 🌱 I'm here to help you learn about climate change, sustainability, and environmental science. What would you like to explore today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          systemPrompt: SYSTEM_PROMPT,
          conversationHistory: messages.slice(-10) // Last 10 messages for context
        }),
      });

      if (!response.ok) {
        let friendly = 'Sorry, I encountered an error. Please try again.';
        try {
          const err = await response.json();
          if (err?.errorCode === 'NO_OPENAI_KEY') {
            friendly = 'Server is missing the OpenAI API key. Add OPENAI_API_KEY to your .env and restart the dev server.';
          }
        } catch {}
        throw new Error(friendly);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chatbot error:', err);
      const msg = err instanceof Error ? err.message : 'Sorry, I encountered an error. Please try again.';
      setError(msg);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment! 🌱",
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: BookOpen, text: "Climate Basics", prompt: "Tell me about climate change basics" },
    { icon: Zap, text: "Renewable Energy", prompt: "Explain renewable energy sources" },
    { icon: Globe, text: "Global Impact", prompt: "How does my carbon footprint affect the planet?" },
    { icon: Lightbulb, text: "Sustainability Tips", prompt: "Give me practical sustainability tips" }
  ];

  return (
    <>
      {/* Chatbot Toggle Button (hidden when panel is open) */}
      {!isOpen && (
        <motion.div
          className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-40"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Button
            onClick={onToggle}
            className={cn(
              "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
              "bg-white text-black hover:bg-white/90 mono-glow"
            )}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      {/* Chatbot Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50 rounded-2xl border border-white/20 bg-black/90 backdrop-blur-xl shadow-2xl flex flex-col w-[calc(100vw-2rem)] sm:w-[400px] max-w-[92vw]"
            style={{ 
              maxHeight: "calc(100vh - 8rem)", 
              minHeight: "400px",
              height: "auto"
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-orbitron text-white text-sm">EcoBot</h3>
                  <p className="text-white/60 text-xs">Environmental Learning Assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                        message.role === 'user'
                          ? "bg-white text-black"
                          : message.isError
                          ? "bg-red-500/20 text-red-300 border border-red-400/30"
                          : "bg-white/10 text-white"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <div className="bg-white/10 text-white rounded-2xl px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>EcoBot is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              </ScrollArea>
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="p-4 border-t border-white/10">
                <p className="text-white/60 text-xs mb-3">Quick actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(action.prompt)}
                      className="h-8 text-xs border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      <action.icon className="h-3 w-3 mr-1" />
                      {action.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs mb-2">
                  <AlertCircle className="h-3 w-3" />
                  {error}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about climate change, sustainability..."
                  className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

