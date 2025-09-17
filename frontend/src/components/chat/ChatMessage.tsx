'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  User,
  Bot,
  Copy,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { ChatMessage } from '@/types/tutor'
import toast from 'react-hot-toast'

interface ChatMessageProps {
  message: ChatMessage
  isLast?: boolean
}

export default function ChatMessageComponent({ message, isLast = false }: ChatMessageProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setIsCopied(true)
      toast.success('Message copied to clipboard')
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy message')
    }
  }

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type)
    toast.success(`Thank you for your feedback!`)
  }

  const getMessageIcon = () => {
    switch (message.role) {
      case 'user':
        return <User className="h-4 w-4" />
      case 'assistant':
        return <Bot className="h-4 w-4" />
      case 'system':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  const getMessageBubbleClasses = () => {
    const baseClasses = "max-w-4xl rounded-2xl px-6 py-4 shadow-sm"

    switch (message.role) {
      case 'user':
        return `${baseClasses} ml-auto bg-primary-500 text-white`
      case 'assistant':
        return `${baseClasses} mr-auto bg-white border border-slate-200`
      case 'system':
        return `${baseClasses} mx-auto bg-amber-50 border border-amber-200 text-amber-900 text-sm`
      default:
        return `${baseClasses} mr-auto bg-white border border-slate-200`
    }
  }

  const messageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <motion.div
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${
        message.role === 'system' ? 'justify-center' : ''
      }`}
    >
      {/* Avatar */}
      {message.role !== 'user' && (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.role === 'assistant'
            ? 'bg-gradient-to-br from-primary-500 to-blue-600 text-white'
            : 'bg-amber-500 text-white'
        }`}>
          {getMessageIcon()}
        </div>
      )}

      <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
        {/* Message bubble */}
        <div className={getMessageBubbleClasses()}>
          {/* Message header for assistant messages */}
          {message.role === 'assistant' && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700">AI Tutor</span>
                {message.metadata?.confidence && (
                  <div className="flex items-center space-x-1 text-xs text-slate-500">
                    <CheckCircle className="h-3 w-3" />
                    <span>{Math.round(message.metadata.confidence * 100)}% confident</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          )}

          {/* Message content */}
          <div className={`prose prose-sm max-w-none ${
            message.role === 'user'
              ? 'text-white prose-headings:text-white prose-strong:text-white prose-code:text-blue-100 prose-code:bg-blue-800/30'
              : 'text-slate-800'
          }`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom components for code references
                strong: ({ children }) => (
                  <strong className={message.role === 'user' ? 'text-blue-100' : 'text-slate-900'}>
                    {children}
                  </strong>
                ),
                code: ({ children, className }) => {
                  const isInline = !className
                  return isInline ? (
                    <code className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      message.role === 'user'
                        ? 'bg-blue-800/30 text-blue-100'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto">
                      <code>{children}</code>
                    </pre>
                  )
                },
                h3: ({ children }) => (
                  <h3 className={`text-lg font-semibold mb-2 ${
                    message.role === 'user' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-1 my-3">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className={`flex items-start ${
                    message.role === 'user' ? 'text-blue-100' : 'text-slate-700'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-3 mt-2 flex-shrink-0 ${
                      message.role === 'user' ? 'bg-blue-200' : 'bg-primary-500'
                    }`} />
                    <span>{children}</span>
                  </li>
                )
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Code references */}
          {message.metadata?.codeReferences && message.metadata.codeReferences.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200">
              <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                Code References
              </h4>
              <div className="space-y-2">
                {message.metadata.codeReferences.map((ref, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      ref.relevance === 'direct'
                        ? 'bg-blue-50 border-blue-200'
                        : ref.relevance === 'related'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-900">
                            {ref.code} - Section {ref.section}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            ref.relevance === 'direct'
                              ? 'bg-blue-100 text-blue-800'
                              : ref.relevance === 'related'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ref.relevance}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{ref.title}</p>
                        {ref.excerpt && (
                          <p className="text-xs text-slate-500 mt-2 italic">"{ref.excerpt}"</p>
                        )}
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module references */}
          {message.metadata?.moduleReferences && message.metadata.moduleReferences.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200">
              <h4 className="text-sm font-medium text-slate-700 mb-2">
                Related Learning Modules
              </h4>
              <div className="flex flex-wrap gap-2">
                {message.metadata.moduleReferences.map((module, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                  >
                    Module {module.moduleNumber}: {module.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {message.metadata?.sources && message.metadata.sources.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span>Sources:</span>
                <div className="flex flex-wrap gap-1">
                  {message.metadata.sources.map((source, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message actions for assistant messages */}
        {message.role === 'assistant' && (
          <div className="flex items-center space-x-2 mt-2 ml-2">
            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Copy message"
            >
              {isCopied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>

            <button
              onClick={() => handleFeedback('up')}
              className={`p-1.5 rounded-lg transition-colors ${
                feedback === 'up'
                  ? 'text-green-600 bg-green-100'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="Helpful"
            >
              <ThumbsUp className="h-4 w-4" />
            </button>

            <button
              onClick={() => handleFeedback('down')}
              className={`p-1.5 rounded-lg transition-colors ${
                feedback === 'down'
                  ? 'text-red-600 bg-red-100'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* User avatar */}
      {message.role === 'user' && (
        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </motion.div>
  )
}