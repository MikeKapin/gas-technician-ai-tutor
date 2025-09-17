'use client'

import { motion } from 'framer-motion'
import {
  X,
  BookOpen,
  Award,
  Shield,
  Home,
  Building2,
  Flame,
  CheckCircle,
  Clock,
  Users,
  Target
} from 'lucide-react'
import { useTutor } from '@/contexts/TutorContext'

interface TutorInfoPanelProps {
  onClose: () => void
}

export default function TutorInfoPanel({ onClose }: TutorInfoPanelProps) {
  const { configuration, currentSession } = useTutor()

  if (!configuration || !currentSession) {
    return null
  }

  const getProgressStats = () => {
    const totalMessages = currentSession.conversationHistory.length
    const userMessages = currentSession.conversationHistory.filter(m => m.role === 'user').length
    const aiMessages = currentSession.conversationHistory.filter(m => m.role === 'assistant').length

    return {
      totalMessages,
      userMessages,
      aiMessages,
      sessionDuration: Math.floor((new Date().getTime() - currentSession.startedAt.getTime()) / (1000 * 60))
    }
  }

  const stats = getProgressStats()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col bg-white"
    >
      {/* Header */}
      <div className={`p-6 border-b border-slate-200 ${
        configuration.level === 'G3'
          ? 'bg-gradient-to-r from-green-500 to-emerald-600'
          : 'bg-gradient-to-r from-blue-500 to-indigo-600'
      } text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              {configuration.level === 'G3' ? <Home className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
            </div>
            <div>
              <h2 className="font-bold text-lg">{configuration.name}</h2>
              <p className="text-white/80 text-sm">{configuration.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Session stats */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-xl font-bold">{stats.userMessages}</div>
            <div className="text-xs text-white/80">Questions Asked</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-xl font-bold">{stats.sessionDuration}m</div>
            <div className="text-xs text-white/80">Session Time</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Code Coverage */}
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary-500" />
            Code Coverage
          </h3>
          <div className="space-y-2">
            {configuration.coverage.codes.map((code, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
              >
                <span className="font-medium text-blue-900">{code}</span>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Learning Modules */}
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
            <Award className="h-5 w-5 mr-2 text-primary-500" />
            Learning Modules
          </h3>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-center mb-3">
              <span className="text-2xl font-bold text-primary-600">
                {configuration.coverage.modules.length}
              </span>
              <span className="text-slate-600 text-sm ml-2">modules covered</span>
            </div>
            <div className="text-sm text-slate-600 text-center">
              Modules {configuration.coverage.modules[0]}-{configuration.coverage.modules[configuration.coverage.modules.length - 1]}
            </div>
            <div className="mt-2 flex flex-wrap gap-1 justify-center">
              {configuration.coverage.modules.slice(0, 8).map((moduleNum, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded"
                >
                  {moduleNum}
                </span>
              ))}
              {configuration.coverage.modules.length > 8 && (
                <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded">
                  +{configuration.coverage.modules.length - 8} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Specialization Areas */}
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary-500" />
            Specialization Areas
          </h3>
          <div className="space-y-2">
            {configuration.coverage.specialFocus.map((focus, index) => (
              <div
                key={index}
                className="flex items-center p-2 text-sm text-slate-700"
              >
                <Flame className="h-4 w-4 mr-3 text-orange-500 flex-shrink-0" />
                <span>{focus}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Capabilities */}
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary-500" />
            Key Capabilities
          </h3>
          <div className="space-y-2">
            {configuration.capabilities.map((capability, index) => (
              <div
                key={index}
                className="flex items-start p-2 text-sm text-slate-700"
              >
                <CheckCircle className="h-4 w-4 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{capability}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Path Preview */}
        <div className="p-6">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary-500" />
            Learning Path
          </h3>
          <div className="space-y-3">
            {configuration.learningPath.slice(0, 5).map((step, index) => (
              <div
                key={index}
                className="flex items-start space-x-3"
              >
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-sm text-slate-700">{step}</span>
              </div>
            ))}
            {configuration.learningPath.length > 5 && (
              <div className="flex items-center space-x-3 text-sm text-slate-500">
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                </div>
                <span>+{configuration.learningPath.length - 5} more learning steps</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Context */}
        {currentSession.currentContext && Object.keys(currentSession.currentContext).length > 0 && (
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary-500" />
              Current Context
            </h3>
            <div className="space-y-2 text-sm">
              {currentSession.currentContext.activeModule && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Active Module:</span>
                  <span className="font-medium">Module {currentSession.currentContext.activeModule}</span>
                </div>
              )}
              {currentSession.currentContext.currentCodeSection && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Code Section:</span>
                  <span className="font-medium">{currentSession.currentContext.currentCodeSection}</span>
                </div>
              )}
              {currentSession.currentContext.learningObjective && (
                <div>
                  <span className="text-slate-600">Learning Objective:</span>
                  <p className="font-medium mt-1">{currentSession.currentContext.learningObjective}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-center text-xs text-slate-500">
          <p>Session started: {currentSession.startedAt.toLocaleString()}</p>
          <p className="mt-1">
            {configuration.level} Gas Technician AI Tutor
          </p>
        </div>
      </div>
    </motion.div>
  )
}