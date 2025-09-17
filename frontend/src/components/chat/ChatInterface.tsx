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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Active Session</h2>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-4 py-4">
        <div className="flex items-center">
          <button
            onClick={() => router.push('/')}
            className="mr-3 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex items-center flex-1">
            <div className={`p-2 rounded-lg mr-3 ${configuration.level === 'G3' ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
              <Wrench className={`h-5 w-5 ${configuration.level === 'G3' ? 'text-blue-400' : 'text-red-400'}`} />
            </div>
            <div>
              <div className="text-white font-semibold tracking-wide">{configuration.level} Gas Technician</div>
              <div className="text-slate-400 text-xs font-medium">AI Tutor Online • LARK Labs</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' fill='%23FF0000'/%3E%3Cpath d='M12 8L6 4v8l6-4z' fill='%23FFFFFF'/%3E%3C/svg%3E"
              alt="Canada"
              className="w-5 h-3"
            />
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">CSA</span>
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
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-4'
                  : 'bg-slate-800/50 text-slate-100 mr-4 border border-slate-700/50'
              }`}
            >
              <div className="text-sm font-normal leading-relaxed">{message.content}</div>
              <div className={`text-xs mt-2 font-medium ${message.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 text-slate-100 mr-4 border border-slate-700/50 rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-slate-400">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

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
            />
          </div>
          <button
            onClick={toggleRecording}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Mic className={`h-5 w-5 ${isRecording ? 'text-white' : 'text-slate-300'}`} />
          </button>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
        <div className="mt-2 text-center">
          <span className="text-xs text-slate-500 font-medium">CSA B149.1-25 & B149.2-25 Compliant Training</span>
        </div>
      </div>
    </div>
  )
}