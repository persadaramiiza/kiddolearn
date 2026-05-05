'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Halo! Ada yang bisa dibantu?' }]);
  const [input, setInput] = useState('');
  
  // 1. Tambahkan state untuk mendeteksi status loading
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    // Jangan izinkan kirim kalau input kosong atau masih loading
    if (!input.trim() || isLoading) return; 
    
    const userMessage = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput(''); 
    
    // 2. Set loading jadi true sebelum tembak API
    setIsLoading(true); 
    
    try {
      const response = await fetch(`${API_URL.replace(/\/api\/?$/, '')}/chat`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.message || 'Waduh, sistem KiddoBot lagi error nih!' }]);
        return; 
      }
      
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
      
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Maaf, gagal nyambung ke server KiddoBot 😔' }]);
    } finally {
      // 3. Set loading jadi false setelah selesai (berhasil maupun error)
      setIsLoading(false); 
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="bg-white border rounded-lg shadow-lg w-80 h-96 flex flex-col mb-4 overflow-hidden">
          <div className="bg-orange-500 text-white p-3 font-bold text-center">
            KiddoBot 🤖
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2 bg-orange-50">
            {/* Render Pesan */}
            {messages.map((msg, i) => (
              <div key={i} className={`p-2 rounded-lg max-w-[80%] text-sm ${msg.sender === 'user' ? 'bg-orange-200 self-end' : 'bg-white border self-start'}`}>
                {msg.text}
              </div>
            ))}
            
            {/* 4. Tampilkan Animasi Loading kalau isLoading bernilai true */}
            {isLoading && (
              <div className="p-3 rounded-lg bg-white border self-start flex gap-1 items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              </div>
            )}
          </div>

          <div className="p-3 border-t bg-white flex gap-2">
            <input 
              type="text" 
              className="flex-1 border rounded-md px-2 py-1 text-sm focus:outline-orange-500 disabled:bg-gray-100 disabled:text-gray-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isLoading ? "KiddoBot sedang mengetik..." : "Ketik pesan..."}
              disabled={isLoading} // 5. Matikan input saat loading
            />
            <button 
              onClick={handleSend}
              disabled={isLoading} // 6. Matikan tombol saat loading
              className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm hover:bg-orange-600 transition disabled:bg-orange-300 disabled:cursor-not-allowed"
            >
              Kirim
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-orange-600 transition ml-auto"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}
