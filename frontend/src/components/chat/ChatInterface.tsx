'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  RotateCcw,
  Settings,
  BookOpen,
  Home,
  Building2,
  Flame,
  ArrowLeft,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  FileText,
  Mic,
  Square,
  User,
  Bot
} from 'lucide-react'
import { useTutor } from '@/contexts/TutorContext'
import { ChatMessage } from '@/types/tutor'
import ChatMessageComponent from './ChatMessage'
import TutorInfoPanel from './TutorInfoPanel'
import ConnectionStatus from './ConnectionStatus'
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
    endSession,
    updateContext
  } = useTutor()

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showTutorInfo, setShowTutorInfo] = useState(false)
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
        setInput(prev => prev + ' ' + transcript)
        setIsListening(false)
      }

      recognition.current.onerror = () => {
        setIsListening(false)
        toast.error('Speech recognition failed. Please try again.')
      }

      recognition.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  if (!currentSession || !configuration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">No active tutor session</p>
          <button
            onClick={() => router.push('/')}
            className="interactive-button"
          >
            Select Tutor
          </button>
        </div>
      </div>
    )
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage
    })

    try {
      // Get real AI response using Claude
      const aiResponse = await aiService.generateResponse(
        userMessage,
        configuration.level,
        configuration,
        currentSession.conversationHistory
      )

      addMessage({
        role: 'assistant',
        content: aiResponse.content,
        metadata: {
          confidence: aiResponse.confidence,
          sources: aiResponse.sources,
          codeReferences: aiResponse.codeReferences,
          moduleReferences: aiResponse.moduleReferences
        }
      })
    } catch (error) {
      console.error('Failed to get AI response:', error)
      toast.error('Failed to get AI response. Please check your connection and try again.')

      // Fallback to mock response if API fails
      const fallbackResponse = generateMockResponse(userMessage, configuration.level)
      addMessage({
        role: 'assistant',
        content: `⚠️ **Using offline mode** - API temporarily unavailable\n\n${fallbackResponse}`,
        metadata: {
          confidence: 0.7,
          sources: ['Offline Knowledge Base'],
        }
      })
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

  const handleVoiceInput = () => {
    if (!recognition.current) {
      toast.error('Speech recognition not supported in this browser.')
      return
    }

    if (isListening) {
      recognition.current.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      recognition.current.start()
    }
  }

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      endSession()
      router.push('/chat')
    }
  }

  const handleSwitchTutor = () => {
    if (window.confirm('Switch to a different tutor? This will end your current session.')) {
      endSession()
      router.push('/')
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${className}`}>
      {/* Connection Status */}
      <ConnectionStatus />

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  configuration.level === 'G3'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                } text-white`}>
                  {configuration.level === 'G3' ? <Home className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                </div>
                <div>
                  <h1 className="font-semibold text-slate-900">{configuration.name}</h1>
                  <p className="text-sm text-slate-500">{configuration.level} Certification Tutor</p>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTutorInfo(!showTutorInfo)}
                className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                title="Tutor Information"
              >
                <BookOpen className="h-5 w-5" />
              </button>

              <button
                onClick={handleClearChat}
                className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                title="Clear Chat"
              >
                <RotateCcw className="h-5 w-5" />
              </button>

              <button
                onClick={handleSwitchTutor}
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Switch Tutor
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <AnimatePresence mode="popLayout">
              {currentSession.conversationHistory.map((message, index) => (
                <ChatMessageComponent
                  key={message.id}
                  message={message}
                  isLast={index === currentSession.conversationHistory.length - 1}
                />
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 max-w-2xl"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-200">
                  <div className="ai-thinking">
                    <span className="text-sm text-slate-600">AI is thinking</span>
                    <div className="flex space-x-1 ml-2">
                      <div className="ai-thinking-dot"></div>
                      <div className="ai-thinking-dot"></div>
                      <div className="ai-thinking-dot"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm p-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative flex items-end space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Ask your ${configuration.level} tutor about gas codes, installation procedures, safety requirements...`}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none min-h-[48px] max-h-32"
                    rows={1}
                    disabled={isLoading}
                  />

                  {/* Voice input button */}
                  <button
                    onClick={handleVoiceInput}
                    className={`absolute right-3 top-3 p-1.5 rounded-lg transition-colors ${
                      isListening
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                    title={isListening ? 'Stop listening' : 'Voice input'}
                  >
                    {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                </div>

                {/* Send button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="interactive-button p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {getQuickSuggestions(configuration.level).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tutor Info Panel */}
        <AnimatePresence>
          {showTutorInfo && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-96 border-l border-slate-200 bg-white"
            >
              <TutorInfoPanel onClose={() => setShowTutorInfo(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Helper functions
function generateMockResponse(userMessage: string, tutorLevel: 'G3' | 'G2'): string {
  const lowerMessage = userMessage.toLowerCase()

  // G3 specific responses
  if (tutorLevel === 'G3') {
    if (lowerMessage.includes('clearance') || lowerMessage.includes('distance')) {
      return `**Clearance Requirements for G3 Installations**

According to CSA B149.1-25, residential gas appliance clearances are critical for safe operation:

**Key Points:**
• **Minimum clearances** vary by appliance type and BTU input
• **Combustible materials** require specific distances (typically 6" minimum)
• **Non-combustible surfaces** may allow reduced clearances

**Example - Residential Furnace:**
- Top clearance: 12" minimum
- Side clearances: 6" from combustible surfaces
- Front clearance: 24" for service access

**Code Reference:** CSA B149.1-25, Section 6.2.1

Always verify specific appliance manufacturer requirements as they may be more restrictive than code minimums.`
    }

    if (lowerMessage.includes('piping') || lowerMessage.includes('pipe size')) {
      return `**Gas Piping for G3 Applications**

For residential and small commercial installations under G3 scope:

**Pipe Sizing Basics:**
• Based on **gas demand** (BTU/hr input)
• **Pipe length** affects pressure drop
• **Fittings** add equivalent length

**Common Residential Sizes:**
- 1/2" pipe: Up to 75,000 BTU/hr (short runs)
- 3/4" pipe: Up to 150,000 BTU/hr
- 1" pipe: For multiple appliances or longer runs

**TSSA Requirements:**
• Use approved materials (black iron, CSST, etc.)
• Proper support and protection
• Pressure testing mandatory

**Code Reference:** CSA B149.1-25, Chapter 5`
    }
  }

  // G2 specific responses
  if (tutorLevel === 'G2') {
    if (lowerMessage.includes('propane') || lowerMessage.includes('b149.2')) {
      return `**Propane Systems - CSA B149.2-25**

As a G2 technician, you work with both natural gas (B149.1) and propane (B149.2) systems:

**Key Differences:**
• **Higher pressure** systems (up to 250 psig)
• **Different pipe sizing** calculations
• **Specialized components** required

**Propane Storage Systems:**
- Bulk tanks (120+ gallons)
- Cylinder manifolds
- Auto-changeover systems

**Safety Considerations:**
• Propane is **heavier than air** - settles in low areas
• **Higher BTU content** than natural gas
• **Different regulator** requirements

**Code References:**
- CSA B149.2-25 for propane installations
- CSA B149.1-25 for appliance connections

**G2 Scope:** Commercial/industrial propane systems up to 2,000,000 BTU/hr`
    }

    if (lowerMessage.includes('commercial') || lowerMessage.includes('large system')) {
      return `**Large Commercial Gas Systems - G2 Level**

Advanced installations requiring G2 certification:

**System Characteristics:**
• **Multiple appliances** with complex distribution
• **Higher pressures** and flow rates
• **Engineering calculations** required

**Key Components:**
- District regulators and relief valves
- Multi-stage pressure reduction
- Seismic shutoff valves
- Emergency shutoff systems

**Design Considerations:**
• **Load diversity** calculations
• **Pressure drop** analysis through entire system
• **Backup systems** and redundancy
• **Code compliance** for occupancy types

**Advanced Modules (10-24):**
- System engineering principles
- Load calculation methods
- Advanced safety systems
- Multi-fuel applications

**Code Integration:** Both CSA B149.1-25 and B149.2-25 requirements`
    }
  }

  // Generic helpful response
  return `I'm your ${tutorLevel} Gas Technician AI Tutor! I can help you with:

${tutorLevel === 'G3' ?
  `**G3 Specializations:**
  • CSA B149.1-25 code interpretation
  • Residential gas appliance installation
  • Small commercial applications
  • TSSA regulations and compliance
  • Learning modules 1-9
  • Basic piping and venting systems` :
  `**G2 Specializations:**
  • Advanced CSA B149.1-25 applications
  • Complete CSA B149.2-25 (Propane) expertise
  • Large commercial and industrial systems
  • Complex piping calculations
  • Learning modules 10-24
  • Multi-appliance system coordination`
}

Feel free to ask about specific code sections, installation procedures, safety requirements, or any gas technician topics!`
}

function getQuickSuggestions(tutorLevel: 'G3' | 'G2'): string[] {
  if (tutorLevel === 'G3') {
    return [
      'Clearance requirements for residential furnace',
      'How to size gas piping for home',
      'TSSA inspection requirements',
      'Venting requirements for water heater',
      'Module 3 competency requirements'
    ]
  } else {
    return [
      'CSA B149.2-25 propane system design',
      'Large commercial pipe sizing calculations',
      'Multi-appliance system requirements',
      'Industrial safety shutoff systems',
      'Module 15 advanced competencies'
    ]
  }
}