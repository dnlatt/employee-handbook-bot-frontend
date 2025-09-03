'use client'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { ChevronDown, ChevronUp, FileText, Bot, User } from 'lucide-react' 
import { Message } from '@/types'

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const [time, setTime] = useState<string>('')
  const [showSources, setShowSources] = useState(false)

  useEffect(() => {
    setTime(new Date(message.timestamp).toLocaleTimeString())
  }, [message.timestamp])

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400'
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* User icon */}
      {isUser && (
        <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center ml-3 flex-shrink-0 order-2">
          <User className="w-5 h-5 text-white animate-pulse" />
        </div>
      )}

      {/* Assistant icon */}
      {!isUser && (
        <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <Bot className="w-5 h-5 text-white animate-pulse" />
        </div>
      )}

      {/* Message bubble */}
      <div className="max-w-[85%] space-y-2">
        <div
          className={`${
            isUser
              ? 'bg-blue-600 text-white ml-auto'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
          } p-4 rounded-lg`}
          role="article"
          aria-label={`${message.role} message`}
        >
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => (
                <p className="text-sm leading-relaxed mb-2" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-5 space-y-1 marker:text-blue-600 dark:marker:text-blue-400 mb-2" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-5 space-y-1 marker:text-blue-600 dark:marker:text-blue-400 mb-2" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-sm leading-relaxed" {...props} />
              ),
              h1: ({ node, ...props }) => (
                <h1 className="text-lg font-semibold mt-3 mb-2" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-base font-semibold mt-3 mb-1" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-semibold" {...props} />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>

          {!isUser && message.confidence !== undefined && (
            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                <span className={`font-medium ${getConfidenceColor(message.confidence)}`}>
                  {message.confidence}%
                </span>
              </div>
            </div>
          )}

          {time && (
            <div className={`text-xs mt-2 opacity-70 ${isUser ? 'text-right' : 'text-left'}`}>
              {time}
            </div>
          )}
        </div>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowSources(!showSources)}
              className="w-full flex items-center justify-between p-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Sources ({message.sources.length} handbook sections found)</span>
              </div>
              {showSources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSources && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-3">
                {message.sources.map((source) => (
                  <div
                    key={source.id}
                    className="bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Handbook Section
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          source.relevance >= 80
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : source.relevance >= 60
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {source.relevance}% relevant
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {source.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add spacing when assistant */}
      {isUser && <div className="w-3" />}
    </div>
  )
}
