'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Wrench, Mic, Send } from 'lucide-react';
import { CertificationLevel, Message } from '@/types';

interface ChatInterfaceProps {
  selectedLevel: CertificationLevel;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedLevel, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check API connection status
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/chat');
        const data = await response.json();
        setConnectionStatus(data.connection_status === 'connected' ? 'connected' : 'disconnected');
      } catch (error) {
        console.error('Connection check failed:', error);
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();

    // Add welcome message when component mounts
    const welcomeMessage: Message = {
      id: `welcome_${Date.now()}`,
      type: 'ai',
      role: 'assistant',
      content: selectedLevel === 'G3'
        ? "Welcome to your G3 Gas Technician Tutor! I'm here to help you with CSA B149.1-25 codes, basic gas installation procedures, and G3 certification preparation. Ask me about natural gas appliances up to 400,000 BTU/hr, safety protocols, or code requirements from Units 1-9."
        : "Welcome to your G2 Gas Technician Tutor! I'm here to help you with advanced CSA B149.1-25 and B149.2-25 codes, complex gas systems, and G2 certification preparation. Ask me about all gas appliances, advanced installations, commercial systems, or complex troubleshooting scenarios from Units 10-24.",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [selectedLevel]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    const newMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    try {
      // Get AI response
      const aiContent = await getAIResponse(userMessage, selectedLevel);

      const aiResponse: Message = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to get AI response:', error);

      // Add error message with connection status info
      const errorResponse: Message = {
        id: `error_${Date.now()}`,
        type: 'ai',
        role: 'assistant',
        content: `I'm having trouble connecting right now (Status: ${connectionStatus}). ${connectionStatus === 'disconnected' ? 'The AI service appears to be offline - using fallback responses.' : 'Please try again in a moment.'}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const getAIResponse = async (userMessage: string, level: CertificationLevel): Promise<string> => {
    console.log('🚀 Starting API call to /api/chat');
    console.log('Request data:', { message: userMessage, level, historyCount: messages.length });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          level: level,
          conversationHistory: messages
        }),
      });

      console.log('📡 Raw response status:', response.status, response.statusText);

      if (!response.ok) {
        console.error('❌ API Response Error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API Response received:', data);
      return data.response;
    } catch (error) {
      console.error('💥 Catch block - Error getting AI response:', error);

      // Enhanced fallback responses
      const fallbackResponses = {
        G3: [
          "That's an excellent question about G3 gas technician requirements. For residential and small commercial installations up to 400,000 BTU/hr, CSA B149.1-25 provides comprehensive guidance on installation procedures and safety protocols. Focus on Units 1-9 for fundamental competencies including safety, gas properties, codes, and basic appliance systems.",

          "According to CSA B149.1-25 standards for G3 technicians, proper clearances and installation requirements are essential. Remember to study Unit 4 (Code and Regulations) and Unit 8 (Piping Systems) for thorough understanding of residential gas systems.",

          "For G3 certification success, master the fundamentals covered in Units 1-9: Safety procedures, tools and testing, gas properties, electrical basics, and appliance installations. These modules provide the foundation for safe residential gas work."
        ],
        G2: [
          "Excellent question regarding G2 advanced gas systems. CSA B149.1-25 and B149.2-25 provide comprehensive coverage for large commercial and industrial installations. Units 10-24 cover advanced topics including pressure regulators, controls, complex appliances, and sophisticated venting systems.",

          "As a G2 technician, you'll handle unlimited BTU capacity systems and complex multi-appliance installations. Study Units 19-20 (Heating Systems) and Units 22-24 (Venting and Air Handling) for comprehensive understanding of commercial applications.",

          "For G2 certification, mastering both codes is essential. Focus on Units 10-15 for advanced systems knowledge, and Units 16-24 for specialized appliances and complex installations. This advanced training prepares you for industrial and large commercial work."
        ]
      };

      const responses = fallbackResponses[level];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-4 py-4">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-3 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
            aria-label="Go back to selection"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex items-center flex-1">
            <div className={`p-2 rounded-lg mr-3 ${
              selectedLevel === 'G3' ? 'bg-blue-500/20' : 'bg-red-500/20'
            }`}>
              <Wrench className={`h-5 w-5 ${
                selectedLevel === 'G3' ? 'text-blue-400' : 'text-red-400'
              }`} />
            </div>
            <div>
              <div className="text-white font-semibold tracking-wide">{selectedLevel} Gas Technician</div>
              <div className="text-slate-400 text-xs font-medium flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  connectionStatus === 'connected' ? 'bg-green-400' :
                  connectionStatus === 'disconnected' ? 'bg-red-400' : 'bg-yellow-400'
                }`}></div>
                AI Tutor {connectionStatus === 'connected' ? 'Connected' :
                         connectionStatus === 'disconnected' ? 'Offline' : 'Checking...'} • LARK Labs
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="16"
              viewBox="0 0 24 16"
              className="w-5 h-3"
              aria-label="Canada"
            >
              <rect width="24" height="16" fill="#FF0000"/>
              <path d="M12 8L6 4v8l6-4z" fill="#FFFFFF"/>
            </svg>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">CSA</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollable">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-4'
                  : 'bg-slate-800/50 text-slate-100 mr-4 border border-slate-700/50'
              }`}
            >
              <div className="text-sm font-normal leading-relaxed">{message.content}</div>
              <div className={`text-xs mt-2 font-medium ${
                message.type === 'user' ? 'text-blue-200' : 'text-slate-400'
              }`}>
                {message.timestamp instanceof Date ? message.timestamp.toLocaleTimeString() : message.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-800/30 border-t border-slate-700 px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about gas codes, safety, or certification..."
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-normal text-sm"
              aria-label="Ask question about gas codes and certification"
            />
          </div>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
            aria-label={isRecording ? "Stop recording" : "Start voice recording"}
          >
            <Mic className={`h-5 w-5 ${isRecording ? 'text-white' : 'text-slate-300'}`} />
          </button>
          <button
            onClick={sendMessage}
            className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105"
            aria-label="Send message"
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
        <div className="mt-2 text-center">
          <span className="text-xs text-slate-500 font-medium">CSA B149.1-25 & B149.2-25 Compliant Training</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;