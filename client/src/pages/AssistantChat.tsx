import React, { useState } from 'react';
import { askAssistantApi } from '../services/api';
import { Sparkles, Send, Bot, User, HelpCircle } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  text: string;
  time: string;
}

export const AssistantChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! I am EVA (EVision AI Assistant). How can I assist you today? You can ask me how to locate fast chargers, explain our Infrastructure Gap Score formula, or calculate charging costs.',
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const presets = [
    'How is the Infrastructure Gap Score calculated?',
    'How do I book a charging slot with UPI?',
    'Which states currently have critical charger deficits?',
    'How fast does a 60kW DC charger charge a Nexon EV?'
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputVal;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      role: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    const answer = await askAssistantApi(textToSend);

    const botMsg: Message = {
      role: 'assistant',
      text: answer,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Natural Language Assistant Knowledge Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          EVA: EVision Intelligent Assistant
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ask questions about charging stations, mathematical gap formulations, or battery economics.
        </p>
      </div>

      {/* Preset Prompt Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => handleSend(p)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-teal-500 hover:text-teal-600 font-bold transition-all shadow-sm"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Thread Container */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl flex flex-col h-[520px] overflow-hidden">
        {/* Messages scrollable area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs ${
                  m.role === 'assistant'
                    ? 'bg-gradient-to-tr from-teal-600 to-emerald-500'
                    : 'bg-blue-600'
                }`}
              >
                {m.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'assistant'
                    ? 'bg-gray-50 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                    : 'bg-teal-600 text-white shadow-sm'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 text-right ${
                    m.role === 'assistant' ? 'text-gray-400' : 'text-teal-100'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Bot className="w-4 h-4 animate-spin text-teal-600" />
              <span>EVA is analyzing knowledge base...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask EVA anything about Indian EV infrastructure or slot reservations..."
              className="flex-1 py-3 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-2xl shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

