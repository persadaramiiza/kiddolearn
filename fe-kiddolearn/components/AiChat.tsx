'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, User, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { aiService, ChatMessage as AiChatMessage } from '@/lib/ai';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Halo! ✨ Aku Peri Pintar, teman belajarmu! Ada yang bisa aku bantu? Kamu bisa tanya apa saja tentang pelajaran! 📚',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Check AI status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await aiService.getStatus();
        setIsAvailable(status.available);
        if (!status.available) {
          setMessages(prev => [
            ...prev,
            {
              id: 'status-warning',
              role: 'model',
              content: '⚠️ Maaf, fitur AI sedang tidak tersedia. Coba lagi nanti ya!',
              timestamp: new Date(),
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to check AI status:', err);
      }
    };
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build history for context (exclude welcome message)
      const history: AiChatMessage[] = messages
        .filter(m => m.id !== 'welcome' && m.id !== 'status-warning')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await aiService.chat(userMessage.content, history);

      const aiMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsAvailable(response.available);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        content: 'Maaf, terjadi kesalahan. Coba lagi ya! 🙏',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    '🌍 Apa itu tata surya?',
    '🔢 Bantu aku belajar perkalian',
    '🦁 Ceritakan tentang singa',
    '🎨 Cara mencampur warna',
  ];

  return (
    <>
      {/* Floating AI Button - Fairy Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-[#FF7A00] to-[#FFB347] rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center group border-4 border-white"
          aria-label="Buka AI Chat"
        >
          <Image 
            src="/images/new-fairy.png" 
            alt="Fairy Assistant" 
            width={48} 
            height={48}
            className="object-contain"
          />
          <span className="absolute -top-10 right-0 bg-[#4A4A4A] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
            Tanya Peri Pintar ✨
          </span>
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border-4 border-[#FFE0B2]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FF7A00] to-[#FFB347] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center p-1">
                  <Image 
                    src="/images/new-fairy.png" 
                    alt="Peri Pintar" 
                    width={40} 
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-black text-xl">Peri Pintar</h2>
                  <p className="text-xs opacity-90">Teman belajarmu! ✨</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FFF9F0]">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-[#8B7355] text-white'
                        : 'bg-gradient-to-r from-[#FF7A00] to-[#FFB347] p-1'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Image 
                        src="/images/new-fairy.png" 
                        alt="Peri" 
                        width={32} 
                        height={32}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-[#8B7355] text-white rounded-br-md'
                        : 'bg-white shadow-md rounded-bl-md border border-[#FFE0B2]'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FFB347] flex items-center justify-center p-1">
                    <Image 
                      src="/images/new-fairy.png" 
                      alt="Peri" 
                      width={32} 
                      height={32}
                      className="object-contain animate-bounce"
                    />
                  </div>
                  <div className="bg-white shadow-md rounded-2xl rounded-bl-md px-4 py-3 border border-[#FFE0B2]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#FF7A00]" />
                      <span className="text-sm text-[#8B7355]">Peri sedang berpikir...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions (show only at start) */}
            {messages.length <= 2 && (
              <div className="px-5 py-3 bg-[#FFF5E5] border-t border-[#FFE0B2]">
                <p className="text-xs text-[#8B7355] mb-2 font-medium">✨ Coba tanya:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputValue(q);
                        inputRef.current?.focus();
                      }}
                      className="text-xs bg-white border border-[#FFE0B2] rounded-full px-3 py-1.5 hover:bg-[#FF7A00] hover:text-white hover:border-[#FF7A00] transition-colors text-[#4A4A4A] font-medium"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-[#FFE0B2] bg-white">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isAvailable ? 'Tanya apa saja...' : 'Peri sedang istirahat'}
                  disabled={isLoading || !isAvailable}
                  className="flex-1 px-4 py-3 border-2 border-[#FFE0B2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim() || !isAvailable}
                  className="w-12 h-12 bg-gradient-to-r from-[#FF7A00] to-[#FFB347] text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
