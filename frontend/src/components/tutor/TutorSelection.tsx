'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, Building2, ArrowRight } from 'lucide-react'
import { TutorLevel, TutorSelectionProps } from '@/types/tutor'

export default function TutorSelection({ onTutorSelected }: TutorSelectionProps) {
  const [selected, setSelected] = useState<TutorLevel | null>(null)

  const handleSelection = (level: TutorLevel) => {
    setSelected(level)
    // Auto-proceed after selection
    setTimeout(() => {
      onTutorSelected(level)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Gas Technician AI Tutor
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose your certification level
            </p>
          </motion.div>
        </div>

        {/* Tutor Options */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">

          {/* G3 Option */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => handleSelection('G3')}
            className={`p-8 rounded-3xl border-2 transition-all duration-300 shadow-xl hover:shadow-2xl ${
              selected === 'G3'
                ? 'border-green-500 bg-green-500/10 scale-105'
                : 'border-border bg-card hover:border-green-500/50 hover:bg-green-500/5'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Home className="h-10 w-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">G3 Level</h3>
              <p className="text-muted-foreground mb-4">Residential & Small Commercial</p>

              <div className="text-sm text-muted-foreground space-y-1">
                <div>• CSA B149.1-25</div>
                <div>• TSSA Regulations</div>
                <div>• Modules 1-9</div>
              </div>

              {selected === 'G3' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-4 flex items-center text-green-600 font-semibold"
                >
                  Selected <ArrowRight className="ml-2 h-4 w-4" />
                </motion.div>
              )}
            </div>
          </motion.button>

          {/* G2 Option */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => handleSelection('G2')}
            className={`p-8 rounded-3xl border-2 transition-all duration-300 shadow-xl hover:shadow-2xl ${
              selected === 'G2'
                ? 'border-blue-500 bg-blue-500/10 scale-105'
                : 'border-border bg-card hover:border-blue-500/50 hover:bg-blue-500/5'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="h-10 w-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">G2 Level</h3>
              <p className="text-muted-foreground mb-4">Commercial & Industrial</p>

              <div className="text-sm text-muted-foreground space-y-1">
                <div>• CSA B149.1-25 & B149.2-25</div>
                <div>• Advanced Systems</div>
                <div>• Modules 10-24</div>
              </div>

              {selected === 'G2' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-4 flex items-center text-blue-600 font-semibold"
                >
                  Selected <ArrowRight className="ml-2 h-4 w-4" />
                </motion.div>
              )}
            </div>
          </motion.button>
        </div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-muted-foreground"
        >
          <p className="text-sm">
            <strong>G3:</strong> Start here for residential systems and CSA B149.1-25 basics<br/>
            <strong>G2:</strong> Advanced level for commercial systems and propane (B149.2-25)
          </p>
        </motion.div>
      </div>
    </div>
  )
}