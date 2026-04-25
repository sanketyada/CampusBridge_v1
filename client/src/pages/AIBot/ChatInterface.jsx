import React, { useState, useRef, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles, Zap, Brain, MessageSquare, Loader2, ChevronDown } from 'lucide-react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

const MarkdownContent = ({ content, role }) => (
  <div className={`markdown-content ${role === 'user' ? 'text-white' : 'text-on-surface'}`}>
    <Markdown 
      rehypePlugins={[rehypeHighlight]}
      components={{
        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
        li: ({node, ...props}) => <li className="text-sm font-medium" {...props} />,
        code: ({node, inline, ...props}) => (
          inline 
            ? <code className="bg-surface-variant/50 px-1 rounded text-xs" {...props} />
            : <div className="rounded-lg overflow-hidden my-3 shadow-sm border border-outline-variant/30">
                <code className="text-[13px] block p-4 font-mono leading-relaxed" {...props} />
              </div>
        ),
        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary/30 pl-4 italic my-2" {...props} />,
        h1: ({node, ...props}) => <h1 className="text-lg font-black mb-2" {...props} />,
        h2: ({node, ...props}) => <h2 className="text-base font-black mb-2" {...props} />,
        h3: ({node, ...props}) => <h3 className="text-sm font-black mb-1" {...props} />,
      }}
    >
      {content}
    </Markdown>
  </div>
);

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hello! I'm your AI Career Mentor. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState('beginner');
  const [provider, setProvider] = useState('groq'); // groq is default for speed
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const personas = [
    { id: 'beginner', name: 'Beginner Mentor', icon: <Zap size={16} />, desc: 'Simple explanations' },
    { id: 'professional', name: 'Career Pro', icon: <Brain size={16} />, desc: 'Industry & Job prep' },
    { id: 'project', name: 'Project Architect', icon: <Sparkles size={16} />, desc: 'Build real apps' },
  ];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post(`/chat/${provider}`, 
        { prompt: input, persona }
      );

      setMessages(prev => [...prev, { role: 'bot', content: res.data.response }]);
    } catch (err) {
      console.error('Chat Error:', err);
      setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex bg-surface">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-80 flex-col border-r border-outline-variant bg-white p-6">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-on-surface mb-2">AI Mentorship</h2>
          <p className="text-on-surface-variant text-sm text-balance">Choose your mentor's persona and focus area.</p>
        </div>

        <div className="space-y-4 mb-auto">
          {personas.map(p => (
            <button
              key={p.id}
              onClick={() => setPersona(p.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                persona === p.id 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-transparent hover:border-outline-variant text-on-surface-variant'
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className={persona === p.id ? 'text-primary' : 'text-on-surface-variant'}>{p.icon}</span>
                <span className="font-bold text-sm">{p.name}</span>
              </div>
              <p className="text-xs opacity-70 ml-7">{p.desc}</p>
            </button>
          ))}
        </div>

        <div className="pt-6 border-t border-outline-variant mt-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-3">AI Model Provider</p>
          <div className="flex gap-2">
            <button 
              onClick={() => setProvider('groq')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${provider === 'groq' ? 'bg-on-surface text-white' : 'bg-surface text-on-surface-variant'}`}
            >
              Groq (Fast)
            </button>
            <button 
              onClick={() => setProvider('gemini')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${provider === 'gemini' ? 'bg-primary text-white' : 'bg-surface text-on-surface-variant'}`}
            >
              Gemini
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col relative max-w-5xl mx-auto w-full">
        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-6 md:p-10 space-y-6 scrollbar-hide">
          {messages.map((m, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-primary text-white' : 'bg-on-surface text-white'}`}>
                  {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-primary text-white' : 'bg-white shadow-card border border-outline-variant text-on-surface'}`}>
                  <MarkdownContent content={m.content} role={m.role} />
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-on-surface text-white flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div className="bg-white p-4 rounded-2xl border border-outline-variant flex items-center gap-2">
                  <Loader2 className="animate-spin text-primary" size={16} />
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-10 bg-surface/80 backdrop-blur-md">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
            <input
              type="text"
              className="w-full bg-white border-2 border-outline-variant focus:border-primary rounded-2xl px-6 py-5 pr-16 text-sm font-bold shadow-ambient transition-all outline-none"
              placeholder="Ask me anything about your career path..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
          <p className="text-center mt-4 text-[10px] text-on-surface-variant font-medium uppercase tracking-widest opacity-60">
            Powered by {provider === 'groq' ? 'Llama 3' : 'Gemini 1.5'} • {persona} persona active
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
