'use client'

import { useRouter } from 'next/navigation'
import TutorSelection from '@/components/tutor/TutorSelection'
import { TutorLevel } from '@/types/tutor'

export default function HomePage() {
  const router = useRouter()

  const handleTutorSelected = (level: TutorLevel) => {
    router.push(`/chat?tutor=${level}`)
  }

  return (
    <TutorSelection
      onTutorSelected={handleTutorSelected}
    />
  )
}