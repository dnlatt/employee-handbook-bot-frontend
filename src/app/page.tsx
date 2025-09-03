// src/app/page.tsx
"use client";
import { ModeToggle } from "@/components/ModeToggle";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { HandbookMessage } from "@/types";


export default function Page() {
  const [messages, setMessages] = useState<HandbookMessage[]>(() => [
    {
      id: "1",
      role: "assistant",
      content: "👋 Hello! I'm your Employee Handbook Assistant. I can help you find information about company policies, benefits, procedures, and more. What would you like to know?",
      timestamp: Date.now() - 10000,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  async function sendMessage(content: string) {
    if (!content.trim()) return;
    
    const userMsg: HandbookMessage = {
      id: String(Date.now()),
      role: "user",
      content,
      timestamp: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);

    // Call your API
    setIsTyping(true);
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: content }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMsg: HandbookMessage = {
          id: String(Date.now() + 1),
          role: "assistant",
          content: data.answer,
          timestamp: Date.now() + 1,
          sources: data.sources,
          confidence: data.confidence,
        };
        setMessages((m) => [...m, assistantMsg]);
      } else {
        // Error handling
        const errorMsg: HandbookMessage = {
          id: String(Date.now() + 1),
          role: "assistant",
          content: `❌ Sorry, I encountered an error: ${data.error}. Please try rephrasing your question.`,
          timestamp: Date.now() + 1,
        };
        setMessages((m) => [...m, errorMsg]);
      }
    } catch (error) {
      const errorMsg: HandbookMessage = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: "❌ Sorry, I'm having trouble connecting to the handbook database. Please try again in a moment.",
        timestamp: Date.now() + 1,
      };
      setMessages((m) => [...m, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  const sampleQuestions = [
    "What is the vacation policy?",
    "What are the working hours?",
    "What is the dress code?",
    "What is the sick leave policy?",
    "What benefits do employees get?",
    "What is the remote work policy?"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-4xl mx-auto py-8 px-4 h-screen flex flex-col">
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold">Employee Handbook Bot</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered handbook assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </header>

        {/* Sample Questions (only show when no messages) */}
        {messages.length === 1 && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Try asking about:
            </h2>
            <div className="grid gap-2 md:grid-cols-2">
              {sampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(question)}
                  className="text-left p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-blue-200 dark:border-blue-800 text-sm"
                >
                  &quot;{question}&quot;
                </button>
              ))}
            </div>
          </div>
        )}

        <main className="flex-1 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
          <div className="h-full flex flex-col">
            <div id="messages" className="flex-1 overflow-auto p-4 space-y-4">
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
              {isTyping && (
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="animate-pulse">Searching handbook...</div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <ChatInput onSend={sendMessage} />
            </div>
          </div>
        </main>

        <footer className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          Powered by D Naung Latt • 🤖 Google Gemini • 🗂️ Pinecone Vector Search • ⚡ Next.js
        </footer>
      </div>
    </div>
  );
}