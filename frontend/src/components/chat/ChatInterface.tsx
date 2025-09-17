'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Mic, Square, ArrowLeft, Home, Building2, RotateCcw } from 'lucide-react'
import { useTutor } from '@/contexts/TutorContext'
import { ChatMessage } from '@/types/tutor'
import ChatMessageComponent from './ChatMessage'
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

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
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
        setInput(transcript)
        setIsListening(false)
      }

      recognition.current.onerror = () => {
        setIsListening(false)
        toast.error('Voice recognition failed. Please try again.')
      }

      recognition.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  if (!currentSession || !configuration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">No Active Session</h2>
          <button
            onClick={() => router.push('/')}
            className="btn-large btn-primary"
          >
            Select Tutor Level
          </button>
        </div>
      </div>
    )
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    addMessage(userMessage)
    setInput('')
    setIsLoading(true)

    try {
      const response = await aiService.generateResponse(
        input.trim(),
        configuration.level,
        configuration,
        currentSession.conversationHistory
      )

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        metadata: {
          codeReferences: response.codeReferences,
          moduleReferences: response.moduleReferences,
          confidence: response.confidence,
          sources: response.sources
        }
      }

      addMessage(aiMessage)
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.')
      console.error('AI response error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const startListening = () => {
    if (recognition.current && !isListening) {
      setIsListening(true)
      recognition.current.start()
    }
  }

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop()
      setIsListening(false)
    }
  }

  const handleNewChat = () => {
    if (confirm('Start a new conversation? This will clear your chat history.')) {
      endSession()
      router.push('/')
    }
  }

  const TutorIcon = configuration?.level === 'G3' ? Home : Building2

  return (
    <div className={`flex flex-col h-screen bg-background ${className}`}>

      {/* Simple Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              configuration.level === 'G3'
                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}>
              <TutorIcon className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="font-bold text-foreground">
                {configuration.level} Gas Technician AI
              </h1>
              <p className="text-sm text-muted-foreground">
                Canadian Gas Code Assistant
              </p>
            </div>
          </div>

          <button
            onClick={handleNewChat}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
            title="New Chat"
          >
            <RotateCcw className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Welcome Message */}
          {currentSession.conversationHistory.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                configuration.level === 'G3'
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600'
              }`}>
                <TutorIcon className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome to {configuration.level} Tutor
              </h2>

              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Ask me anything about Canadian Gas Code, installations, regulations, or technical questions.
              </p>

              <div className="text-sm text-muted-foreground">
                Try asking: "What are clearance requirements for a water heater?"
              </div>
            </motion.div>
          )}

          {/* Chat Messages */}
          {currentSession.conversationHistory.map((message) => (
            <ChatMessageComponent
              key={message.id}
              message={message}
            />
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 p-4"
            >
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask your ${configuration.level} tutor about Canadian Gas Code...`}
                className="w-full p-4 pr-16 bg-background border border-border rounded-2xl resize-none text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent min-h-[60px] max-h-32"
                rows={1}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = `${Math.min(target.scrollHeight, 128)}px`
                }}
              />

              {/* Voice Input Button */}
              <button
                onClick={isListening ? stopListening : startListening}
                className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-muted hover:bg-accent text-muted-foreground hover:text-foreground'
                }`}
                title={isListening ? "Stop recording" : "Voice input"}
              >
                {isListening ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className={`p-4 rounded-2xl transition-all ${
                input.trim() && !isLoading
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              <Send className="h-6 w-6" />
            </button>
          </div>

          {/* Status indicators */}
          <div className="flex justify-between items-center mt-2 px-1">
            <div className="text-xs text-muted-foreground">
              {isListening && "🎤 Listening..."}
            </div>
            <div className="text-xs text-muted-foreground">
              {input.length}/2000
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}