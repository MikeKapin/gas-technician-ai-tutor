'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { TutorLevel, TutorSession, TutorConfiguration, TUTOR_CONFIGURATIONS, ChatMessage } from '@/types/tutor'

interface TutorContextType {
  currentSession: TutorSession | null
  tutorLevel: TutorLevel | null
  configuration: TutorConfiguration | null
  isSessionActive: boolean

  // Actions
  initializeTutor: (level: TutorLevel) => void
  endSession: () => void
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  updateContext: (context: Partial<TutorSession['currentContext']>) => void

  // Session management
  saveSession: () => void
  loadSession: (sessionId: string) => Promise<void>
  getSavedSessions: () => TutorSession[]
}

const TutorContext = createContext<TutorContextType | undefined>(undefined)

export const useTutor = () => {
  const context = useContext(TutorContext)
  if (context === undefined) {
    throw new Error('useTutor must be used within a TutorProvider')
  }
  return context
}

interface TutorProviderProps {
  children: ReactNode
}

export const TutorProvider = ({ children }: TutorProviderProps) => {
  const [currentSession, setCurrentSession] = useState<TutorSession | null>(null)
  const [savedSessions, setSavedSessions] = useState<TutorSession[]>([])

  // Load saved sessions on mount
  useEffect(() => {
    const saved = localStorage.getItem('gasTutorSessions')
    if (saved) {
      try {
        const sessions = JSON.parse(saved) as TutorSession[]
        setSavedSessions(sessions.map(session => ({
          ...session,
          startedAt: new Date(session.startedAt),
          conversationHistory: session.conversationHistory.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })))
      } catch (error) {
        console.error('Failed to load saved sessions:', error)
      }
    }

    // Load active session
    const activeSession = localStorage.getItem('gasTutorActiveSession')
    if (activeSession) {
      try {
        const session = JSON.parse(activeSession) as TutorSession
        setCurrentSession({
          ...session,
          startedAt: new Date(session.startedAt),
          conversationHistory: session.conversationHistory.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })
      } catch (error) {
        console.error('Failed to load active session:', error)
      }
    }
  }, [])

  const initializeTutor = (level: TutorLevel) => {
    const configuration = TUTOR_CONFIGURATIONS[level]

    const newSession: TutorSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      tutorLevel: level,
      startedAt: new Date(),
      configuration,
      conversationHistory: [
        {
          id: `msg_${Date.now()}`,
          role: 'system',
          content: `Welcome to your ${configuration.name}! I'm your AI assistant specialized in ${configuration.description}.

I can help you with:
${configuration.capabilities.map(cap => `• ${cap}`).join('\n')}

What would you like to learn about today?`,
          timestamp: new Date(),
          metadata: {
            sources: ['System initialization'],
            confidence: 1.0
          }
        }
      ],
      currentContext: {}
    }

    setCurrentSession(newSession)
    localStorage.setItem('gasTutorActiveSession', JSON.stringify(newSession))
  }

  const endSession = () => {
    if (currentSession) {
      // Save to session history
      const updatedSessions = [...savedSessions, currentSession]
      setSavedSessions(updatedSessions)
      localStorage.setItem('gasTutorSessions', JSON.stringify(updatedSessions))
    }

    setCurrentSession(null)
    localStorage.removeItem('gasTutorActiveSession')
  }

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (!currentSession) return

    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      timestamp: new Date()
    }

    const updatedSession = {
      ...currentSession,
      conversationHistory: [...currentSession.conversationHistory, newMessage]
    }

    setCurrentSession(updatedSession)
    localStorage.setItem('gasTutorActiveSession', JSON.stringify(updatedSession))
  }

  const updateContext = (context: Partial<TutorSession['currentContext']>) => {
    if (!currentSession) return

    const updatedSession = {
      ...currentSession,
      currentContext: {
        ...currentSession.currentContext,
        ...context
      }
    }

    setCurrentSession(updatedSession)
    localStorage.setItem('gasTutorActiveSession', JSON.stringify(updatedSession))
  }

  const saveSession = () => {
    if (!currentSession) return

    const updatedSessions = savedSessions.filter(s => s.id !== currentSession.id)
    updatedSessions.push(currentSession)

    setSavedSessions(updatedSessions)
    localStorage.setItem('gasTutorSessions', JSON.stringify(updatedSessions))
  }

  const loadSession = async (sessionId: string) => {
    const session = savedSessions.find(s => s.id === sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    setCurrentSession(session)
    localStorage.setItem('gasTutorActiveSession', JSON.stringify(session))
  }

  const getSavedSessions = () => {
    return savedSessions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
  }

  const value: TutorContextType = {
    currentSession,
    tutorLevel: currentSession?.tutorLevel || null,
    configuration: currentSession?.configuration || null,
    isSessionActive: currentSession !== null,

    initializeTutor,
    endSession,
    addMessage,
    updateContext,
    saveSession,
    loadSession,
    getSavedSessions
  }

  return (
    <TutorContext.Provider value={value}>
      {children}
    </TutorContext.Provider>
  )
}

// Hook for accessing tutor configuration without full context
export const useTutorConfiguration = (level?: TutorLevel) => {
  const { configuration, tutorLevel } = useTutor()

  if (level) {
    return TUTOR_CONFIGURATIONS[level]
  }

  if (tutorLevel) {
    return configuration || TUTOR_CONFIGURATIONS[tutorLevel]
  }

  return null
}

// Hook for checking if specific modules are covered
export const useModuleCoverage = (moduleNumber: number) => {
  const { configuration } = useTutor()

  if (!configuration) {
    return {
      isCovered: false,
      tutorLevel: null,
      recommendation: 'Please select a tutor level first'
    }
  }

  const isCovered = configuration.coverage.modules.includes(moduleNumber)

  if (!isCovered) {
    const alternativeLevel: TutorLevel = configuration.level === 'G3' ? 'G2' : 'G3'
    const alternativeConfig = TUTOR_CONFIGURATIONS[alternativeLevel]

    if (alternativeConfig.coverage.modules.includes(moduleNumber)) {
      return {
        isCovered: false,
        tutorLevel: configuration.level,
        recommendation: `Module ${moduleNumber} is covered by the ${alternativeLevel} tutor. Consider switching tutors for comprehensive coverage.`
      }
    }
  }

  return {
    isCovered,
    tutorLevel: configuration.level,
    recommendation: isCovered
      ? `Module ${moduleNumber} is covered by your current ${configuration.level} tutor.`
      : `Module ${moduleNumber} is not available in either tutor configuration.`
  }
}

// Hook for getting code coverage information
export const useCodeCoverage = (codeType: string) => {
  const { configuration } = useTutor()

  if (!configuration) {
    return {
      isCovered: false,
      tutorLevel: null,
      recommendation: 'Please select a tutor level first'
    }
  }

  const isCovered = configuration.coverage.codes.includes(codeType)

  return {
    isCovered,
    tutorLevel: configuration.level,
    supportedCodes: configuration.coverage.codes,
    recommendation: isCovered
      ? `${codeType} is supported by your ${configuration.level} tutor.`
      : `${codeType} is not covered by the ${configuration.level} tutor. Consider the ${configuration.level === 'G3' ? 'G2' : 'G3'} tutor for different code coverage.`
  }
}