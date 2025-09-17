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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message when component mounts
    const welcomeMessage: Message = {
      id: 1,
      type: 'ai',
      content: selectedLevel === 'G3'
        ? "Welcome to your G3 Gas Technician Tutor! I'm here to help you with CSA B149.1-25 and B149.2-25 codes, basic gas installation procedures, and G3 certification preparation. Ask me about natural gas appliances up to 400,000 BTU/hr, safety protocols, or code requirements."
        : "Welcome to your G2 Gas Technician Tutor! I'm here to help you with advanced CSA B149.1-25 and B149.2-25 codes, complex gas systems, and G2 certification preparation. Ask me about all gas appliances, advanced installations, commercial systems, or complex troubleshooting scenarios.",
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([welcomeMessage]);
  }, [selectedLevel]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: getAIResponse(inputMessage, selectedLevel),
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userMessage: string, level: CertificationLevel): string => {
    const responses = {
      G3: [
        "That's a great question about G3 gas technician requirements. For natural gas appliances up to 400,000 BTU/hr, CSA B149.1-25 requires specific installation procedures and safety protocols...",
        "According to CSA B149.1-25 standards for G3 technicians, proper ventilation and clearance requirements are essential for safe gas appliance installation...",
        "For G3 certification preparation, understanding the BTU capacity limits and basic gas installation procedures is crucial for your exam success..."
      ],
      G2: [
        "Excellent question regarding G2 advanced gas systems. CSA B149.1-25 and B149.2-25 outline comprehensive requirements for complex installations and commercial systems...",
        "As a G2 technician, you'll work with all gas appliances including complex commercial systems. Understanding advanced troubleshooting and system design is essential...",
        "For G2 certification, mastering both residential and commercial gas systems, including proper testing procedures and safety protocols, is required..."
      ]
    };

    const levelResponses = responses[level];
    return levelResponses[Math.floor(Math.random() * levelResponses.length)];
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
              <div className="text-slate-400 text-xs font-medium">AI Tutor Online • LARK Labs</div>
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
                {message.timestamp}
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