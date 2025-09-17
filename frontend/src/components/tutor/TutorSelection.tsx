'use client'

import { useState } from 'react'
import { BookOpen, Wrench } from 'lucide-react'
import { TutorLevel, TutorSelectionProps } from '@/types/tutor'

export default function TutorSelection({ onTutorSelected }: TutorSelectionProps) {
  const [selectedLevel, setSelectedLevel] = useState('')

  const handleTutorSelection = (level: TutorLevel) => {
    setSelectedLevel(level)
    // Auto-proceed after selection
    setTimeout(() => {
      onTutorSelected(level)
    }, 500)
  }

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #1e3a8a 50%, #1e293b 100%)'
      }}
    >
      {/* Header */}
      <div className="px-4 py-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Wrench className="h-8 w-8 text-red-500 mr-3" />
          <h1 className="text-3xl font-bold text-white">Gas Technician Tutor</h1>
        </div>
        <p className="text-gray-300 text-base mb-4">CSA B149.1-25 & B149.2-25 Certified Training</p>

        {/* Canadian Flag */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-red-600 px-3 py-1 rounded flex items-center">
            <div className="w-6 h-4 bg-red-600 relative mr-2 rounded-sm">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-2 h-2 border-l-2 border-r-2 border-white"></div>
              </div>
            </div>
            <span className="text-white text-sm font-medium uppercase tracking-wider">CANADIAN STANDARDS</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-16">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-white mb-3">Select Your Certification Level</h2>
            <p className="text-gray-400 text-base">Choose your gas technician certification path</p>
          </div>

          <div className="space-y-6">
            {/* G3 Button */}
            <button
              onClick={() => handleTutorSelection('G3')}
              className="w-full p-6 rounded-2xl text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 border border-blue-400/30"
              style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-white/20 p-3 rounded-lg mr-4">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-bold">G3 Technician</div>
                    <div className="text-blue-100 text-sm font-medium">Basic Gas Installation</div>
                  </div>
                </div>
                <div className="text-4xl font-bold text-blue-100">G3</div>
              </div>
              <div className="border-t border-white/20 pt-3 text-sm text-blue-100">
                Natural gas appliances up to 400,000 BTU/hr
              </div>
            </button>

            {/* G2 Button */}
            <button
              onClick={() => handleTutorSelection('G2')}
              className="w-full p-6 rounded-2xl text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 border border-red-400/30"
              style={{
                background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-white/20 p-3 rounded-lg mr-4">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-bold">G2 Technician</div>
                    <div className="text-red-100 text-sm font-medium">Advanced Gas Systems</div>
                  </div>
                </div>
                <div className="text-4xl font-bold text-red-100">G2</div>
              </div>
              <div className="border-t border-white/20 pt-3 text-sm text-red-100">
                All gas appliances & complex installations
              </div>
            </button>
          </div>

          {/* LARK Labs Branding */}
          <div className="text-center mt-12">
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">POWERED BY</div>
            <div className="text-gray-200 text-xl font-bold">LARK Labs</div>
            <div className="text-gray-400 text-sm">Educational Excellence in HVAC Technology</div>
          </div>
        </div>
      </div>
    </div>
  )
}