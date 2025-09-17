'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TutorProvider, useTutor } from '@/contexts/TutorContext'
import TutorSelection from '@/components/tutor/TutorSelection'
import ChatInterface from '@/components/chat/ChatInterface'
import { TutorLevel } from '@/types/tutor'

function ChatPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentSession, initializeTutor } = useTutor()
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    const tutorParam = searchParams.get('tutor') as TutorLevel | null

    if (tutorParam && (tutorParam === 'G3' || tutorParam === 'G2')) {
      if (!currentSession || currentSession.tutorLevel !== tutorParam) {
        setIsInitializing(true)
        initializeTutor(tutorParam)
        // Remove the URL parameter after initialization
        const url = new URL(window.location.href)
        url.searchParams.delete('tutor')
        router.replace(url.pathname, { scroll: false })
        setIsInitializing(false)
      }
    }
  }, [searchParams, currentSession, initializeTutor, router])

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Initializing your AI tutor...</p>
        </div>
      </div>
    )
  }

  if (!currentSession) {
    return (
      <TutorSelection
        onTutorSelected={(level: TutorLevel) => {
          initializeTutor(level)
        }}
        selectedLevel={undefined}
      />
    )
  }

  return <ChatInterface />
}

export default function ChatPage() {
  return (
    <TutorProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      }>
        <ChatPageContent />
      </Suspense>
    </TutorProvider>
  )
}