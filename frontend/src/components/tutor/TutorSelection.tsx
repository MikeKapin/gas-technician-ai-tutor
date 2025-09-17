'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Building2,
  BookOpen,
  Shield,
  Wrench,
  CheckCircle,
  ArrowRight,
  Flame,
  Factory,
  Gauge,
  Settings,
  AlertTriangle,
  Award
} from 'lucide-react'
import { TutorLevel, TUTOR_CONFIGURATIONS, TutorSelectionProps } from '@/types/tutor'

const TutorCard = ({
  level,
  isSelected,
  onSelect
}: {
  level: TutorLevel
  isSelected: boolean
  onSelect: () => void
}) => {
  const config = TUTOR_CONFIGURATIONS[level]
  const [isExpanded, setIsExpanded] = useState(false)

  const cardVariants = {
    idle: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    },
    selected: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
      borderColor: "#3b82f6"
    }
  }

  const getIconForLevel = (level: TutorLevel) => {
    return level === 'G3' ? Home : Building2
  }

  const IconComponent = getIconForLevel(level)

  return (
    <motion.div
      variants={cardVariants}
      initial="idle"
      whileHover="hover"
      animate={isSelected ? "selected" : "idle"}
      className={`bg-white rounded-2xl p-8 border-2 cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-primary-500 bg-gradient-to-br from-blue-50 to-indigo-50'
          : 'border-slate-200 hover:border-primary-300'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
            level === 'G3'
              ? 'bg-gradient-to-br from-green-500 to-emerald-600'
              : 'bg-gradient-to-br from-blue-500 to-indigo-600'
          } text-white`}>
            <IconComponent className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{config.name}</h3>
            <p className="text-slate-600 mt-1">{config.description}</p>
          </div>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="h-5 w-5 text-white" />
          </motion.div>
        )}
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-slate-900">{config.coverage.modules.length}</div>
          <div className="text-sm text-slate-600">Modules</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-slate-900">{config.coverage.codes.length}</div>
          <div className="text-sm text-slate-600">Code{config.coverage.codes.length > 1 ? 's' : ''}</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-slate-900">{config.capabilities.length}</div>
          <div className="text-sm text-slate-600">Features</div>
        </div>
      </div>

      {/* Coverage Overview */}
      <div className="space-y-4 mb-6">
        <div>
          <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-primary-500" />
            Code Coverage
          </h4>
          <div className="flex flex-wrap gap-2">
            {config.coverage.codes.map((code, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
              >
                {code}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
            <Award className="h-4 w-4 mr-2 text-primary-500" />
            Learning Modules
          </h4>
          <div className="text-sm text-slate-600">
            Modules {config.coverage.modules[0]}-{config.coverage.modules[config.coverage.modules.length - 1]}
            {level === 'G3' && ' (Foundation Level)'}
            {level === 'G2' && ' (Advanced Level)'}
          </div>
        </div>
      </div>

      {/* Expand/Collapse for Details */}
      <div className="border-t border-slate-200 pt-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
          className="flex items-center justify-between w-full text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-4"
            >
              {/* Special Focus Areas */}
              <div>
                <h5 className="font-medium text-slate-900 mb-2 flex items-center">
                  <Flame className="h-4 w-4 mr-2 text-orange-500" />
                  Specialization Areas
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {config.coverage.specialFocus.map((focus, index) => (
                    <div
                      key={index}
                      className="text-sm text-slate-600 flex items-center"
                    >
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2" />
                      {focus}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Capabilities */}
              <div>
                <h5 className="font-medium text-slate-900 mb-2 flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-green-500" />
                  Key Capabilities
                </h5>
                <div className="space-y-1">
                  {config.capabilities.slice(0, 4).map((capability, index) => (
                    <div
                      key={index}
                      className="text-sm text-slate-600 flex items-center"
                    >
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      {capability}
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Path Preview */}
              <div>
                <h5 className="font-medium text-slate-900 mb-2 flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-500" />
                  Learning Path (First 3 Steps)
                </h5>
                <div className="space-y-1">
                  {config.learningPath.slice(0, 3).map((step, index) => (
                    <div
                      key={index}
                      className="text-sm text-slate-600 flex items-center"
                    >
                      <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded text-xs flex items-center justify-center mr-2 font-medium">
                        {index + 1}
                      </div>
                      {step}
                    </div>
                  ))}
                  {config.learningPath.length > 3 && (
                    <div className="text-xs text-slate-500 ml-7">
                      +{config.learningPath.length - 3} more steps...
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function TutorSelection({ onTutorSelected, selectedLevel }: TutorSelectionProps) {
  const [selected, setSelected] = useState<TutorLevel | null>(selectedLevel || null)

  const handleSelection = (level: TutorLevel) => {
    setSelected(level)
  }

  const handleConfirm = () => {
    if (selected) {
      onTutorSelected(selected)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Choose Your AI Tutor Level
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Select the certification level that matches your learning goals. Each tutor is specialized
              for specific code coverage and competency requirements.
            </p>
          </motion.div>
        </div>

        {/* Comparison Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 mb-12 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Quick Comparison
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Home className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">G3 Level</h3>
                  <p className="text-sm text-slate-600">Residential & Small Commercial</p>
                </div>
              </div>
              <ul className="space-y-2 ml-11">
                <li className="text-sm text-slate-600 flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                  CSA B149.1-25 Code
                </li>
                <li className="text-sm text-slate-600 flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                  TSSA Act & Regulations
                </li>
                <li className="text-sm text-slate-600 flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                  Modules 1-9
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">G2 Level</h3>
                  <p className="text-sm text-slate-600">Commercial & Industrial</p>
                </div>
              </div>
              <ul className="space-y-2 ml-11">
                <li className="text-sm text-slate-600 flex items-center">
                  <CheckCircle className="h-3 w-3 text-blue-500 mr-2" />
                  CSA B149.1-25 & B149.2-25
                </li>
                <li className="text-sm text-slate-600 flex items-center">
                  <CheckCircle className="h-3 w-3 text-blue-500 mr-2" />
                  Advanced Regulations
                </li>
                <li className="text-sm text-slate-600 flex items-center">
                  <CheckCircle className="h-3 w-3 text-blue-500 mr-2" />
                  Modules 10-24
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Tutor Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <TutorCard
              level="G3"
              isSelected={selected === 'G3'}
              onSelect={() => handleSelection('G3')}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <TutorCard
              level="G2"
              isSelected={selected === 'G2'}
              onSelect={() => handleSelection('G2')}
            />
          </motion.div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <AnimatePresence>
            {selected && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={handleConfirm}
                className="interactive-button text-lg px-12 py-4 shadow-lg hover:shadow-xl"
              >
                Start Learning with {selected} Tutor
                <ArrowRight className="ml-3 h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {!selected && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-500 mt-4"
            >
              Select a tutor level above to get started
            </motion.p>
          )}
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8 border border-amber-200"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                Not sure which level to choose?
              </h3>
              <p className="text-amber-800 leading-relaxed">
                <strong>Choose G3</strong> if you're starting your gas technician journey, working with residential
                installations, or need to master the fundamentals of CSA B149.1-25.
              </p>
              <p className="text-amber-800 leading-relaxed mt-2">
                <strong>Choose G2</strong> if you already have G3 experience, work with large commercial systems,
                or need advanced training including propane systems (CSA B149.2-25).
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}