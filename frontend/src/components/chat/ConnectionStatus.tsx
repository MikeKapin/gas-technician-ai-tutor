'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react'
import { aiService } from '@/services/ai/aiService'

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isTesting, setIsTesting] = useState(false)
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setIsTesting(true)
    setShowStatus(true)

    try {
      const connected = await aiService.testConnection()
      setIsConnected(connected)

      // Auto-hide status after 3 seconds if connected
      if (connected) {
        setTimeout(() => setShowStatus(false), 3000)
      }
    } catch (error) {
      setIsConnected(false)
    } finally {
      setIsTesting(false)
    }
  }

  if (!showStatus) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 z-50"
      >
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg ${
          isConnected === null || isTesting
            ? 'bg-blue-100 text-blue-800 border border-blue-200'
            : isConnected
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {isConnected === null || isTesting ? (
            <div className="animate-spin">
              <Wifi className="h-4 w-4" />
            </div>
          ) : isConnected ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}

          <span className="text-sm font-medium">
            {isConnected === null || isTesting ?
              'Testing AI connection...' :
              isConnected ?
                'AI Connected (Claude)' :
                'AI Offline - Using fallback mode'
            }
          </span>

          {!isConnected && !isTesting && (
            <button
              onClick={testConnection}
              className="ml-2 text-xs underline hover:no-underline"
            >
              Retry
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}