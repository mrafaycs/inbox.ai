'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import axios from 'axios';
import Navbar from './Navbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = { sender: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    axios.post("/api/agent", { prompt: trimmed })
      .then((res) => {
        const aiMessage: Message = {
          sender: 'ai',
          text: res.data.response,
        };
        setMessages((prev) => [...prev, aiMessage]);
      });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    axios.get("/api/gmail/session")
      .then(res => {
        if (!res.data.connected) {
          window.location.href = "/";
        }
      })
      .catch(err => {
        console.error("Session check failed:", err);
      });

  }, [messages]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen bg-white text-black font-sans">
        {/* Chat Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 pt-[80px] pb-[180px] bg-[#F8F9FA]"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`w-fit max-w-[70%] px-5 py-3 rounded-2xl text-sm break-words transition-all duration-200 ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-[#2F2F2F] text-white shadow-md'
                    : 'mr-auto bg-white text-black border border-gray-200 shadow-sm'
                }`}
              >
                {msg.sender === 'ai' ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4">
          <div className="flex items-end bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-md focus-within:ring-2 focus-within:ring-gray-300">
            <textarea
              rows={3}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-sm text-black placeholder-gray-500 resize-none focus:outline-none scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              className="ml-4 bg-black hover:bg-gray-800 text-white p-3 rounded-full transition-all shadow cursor-pointer"
              onClick={sendMessage}
              aria-label="Send message"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
