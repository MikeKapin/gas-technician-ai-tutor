'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Mic, ArrowLeft, Wrench } from 'lucide-react'
import { useTutor } from '@/contexts/TutorContext'
import { ChatMessage } from '@/types/tutor'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { aiService } from '@/services/ai/aiService'

interface ChatInterfaceProps {
  className?: string
}

export default function ChatInterface({ className }: ChatInterfaceProps) {
  const router = useRouter()
  const {
    currentSession,
    configuration,
    addMessage,
    endSession
  } = useTutor()

  const [inputMessage, setInputMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognition = useRef<any>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSession?.conversationHistory])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognition.current = new SpeechRecognition()
      recognition.current.continuous = false
      recognition.current.interimResults = false
      recognition.current.lang = 'en-CA'

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsRecording(false)
      }

      recognition.current.onerror = () => {
        setIsRecording(false)
        toast.error('Voice recognition failed. Please try again.')
      }

      recognition.current.onend = () => {
        setIsRecording(false)
      }
    }
  }, [])

  // Add welcome message when chat starts
  useEffect(() => {
    if (currentSession && configuration && currentSession.conversationHistory.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `Welcome to your ${configuration.level} Gas Technician Tutor! I'm here to help you with CSA B149.1-25 and B149.2-25 codes, safety protocols, and certification preparation. How can I assist you today?`,
        timestamp: new Date()
      }
      addMessage(welcomeMessage)
    }
  }, [currentSession, configuration, addMessage])

  if (!currentSession || !configuration) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #1e3a8a 50%, #1e293b 100%)'
        }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Active Session</h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl text-white font-bold"
            style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)'
            }}
          >
            Select Tutor Level
          </button>
        </div>
      </div>
    )
  }

  const sendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
      const newMessage: ChatMessage = {
        id: (currentSession.conversationHistory.length + 1).toString(),
        role: 'user',
        content: inputMessage,
        timestamp: new Date()
      }

      addMessage(newMessage)
      const messageContent = inputMessage
      setInputMessage('')
      setIsLoading(true)

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (currentSession.conversationHistory.length + 2).toString(),
          role: 'assistant',
          content: `That's a great question about ${configuration.level} gas technician requirements. Let me help you understand the CSA code requirements and safety protocols...`,
          timestamp: new Date()
        }
        addMessage(aiResponse)
        setIsLoading(false)
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const toggleRecording = () => {
    if (!isRecording && recognition.current) {
      setIsRecording(true)
      recognition.current.start()
    } else if (isRecording && recognition.current) {
      recognition.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #1e3a8a 50%, #1e293b 100%)'
      }}
    >
      {/* Header */}
      <div className="px-4 py-4" style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(71, 85, 105, 0.5)' }}>
        <div className="flex items-center">
          <button
            onClick={() => router.push('/')}
            className="mr-3 p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'rgba(71, 85, 105, 0.5)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(71, 85, 105, 0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(71, 85, 105, 0.5)'}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <div className="flex items-center flex-1">
            <div
              className="p-2 rounded-lg mr-3"
              style={{
                backgroundColor: configuration.level === 'G3' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)'
              }}
            >
              <Wrench className={`h-5 w-5 ${configuration.level === 'G3' ? 'text-blue-400' : 'text-red-400'}`} />
            </div>
            <div>
              <div className="text-white font-semibold">{configuration.level} Gas Technician</div>
              <div className="text-gray-400 text-xs">AI Tutor Online • LARK Labs</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-5 h-3 bg-red-600 relative rounded-sm">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-1 h-1 border-l border-r border-white"></div>
              </div>
            </div>
            <span className="text-gray-400 text-xs uppercase tracking-wider">CSA</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {currentSession.conversationHistory.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user' ? 'ml-4' : 'mr-4'}`}
              style={{
                background: message.role === 'user'
                  ? 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)'
                  : 'rgba(30, 41, 59, 0.5)',
                color: 'white',
                border: message.role === 'assistant' ? '1px solid rgba(71, 85, 105, 0.5)' : 'none'
              }}
            >
              <div className="text-sm leading-relaxed">{message.content}</div>
              <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className="mr-4 rounded-2xl px-4 py-3"
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                color: 'white'
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-400">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 py-4" style={{ backgroundColor: 'rgba(30, 41, 59, 0.3)', borderTop: '1px solid rgba(71, 85, 105, 0.5)' }}>
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about gas codes, safety, or certification..."
              className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              style={{
                backgroundColor: 'rgba(71, 85, 105, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.3)'
              }}
            />
          </div>
          <button
            onClick={toggleRecording}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isRecording ? 'animate-pulse' : ''
            }`}
            style={{
              backgroundColor: isRecording ? '#dc2626' : 'rgba(71, 85, 105, 0.8)'
            }}
            onMouseEnter={(e) => {
              if (!isRecording) e.currentTarget.style.backgroundColor = 'rgba(100, 116, 139, 0.8)'
            }}
            onMouseLeave={(e) => {
              if (!isRecording) e.currentTarget.style.backgroundColor = 'rgba(71, 85, 105, 0.8)'
            }}
          >
            <Mic className={`h-5 w-5 ${isRecording ? 'text-white' : 'text-gray-300'}`} />
          </button>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)'
            }}
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">CSA B149.1-25 & B149.2-25 Compliant Training</span>
        </div>
      </div>
    </div>
  )
}