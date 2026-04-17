import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  Sparkles, 
  Lightbulb, 
  MessageSquare, 
  Download, 
  Clock, 
  User,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  Loader2
} from 'lucide-react';
import api from '../../services/api';

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [refreshingAI, setRefreshingAI] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await api.get(`/resources/${id}`);
        setResource(res.data);
        if (res.data.aiSummary) {
          setChatHistory([{ 
            role: 'ai', 
            content: `Hello! I've analyzed **${res.data.title}** using Groq Llama 3.3. You can ask me any questions about this document.` 
          }]);
        } else {
          setChatHistory([{ 
            role: 'ai', 
            content: `Hello! This document doesn't have an AI summary yet. Click the "Generate AI Summary" button above to analyze it!` 
          }]);
        }
      } catch (err) {
        console.error('Error fetching resource details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const handleRefreshAI = async () => {
    setRefreshingAI(true);
    try {
      const res = await api.post(`/resources/${id}/refresh-ai`);
      
      setResource(prev => ({
        ...prev,
        aiSummary: res.data.aiSummary,
        keyInsights: res.data.keyInsights
      }));

      setChatHistory([{ 
        role: 'ai', 
        content: `I've successfully analyzed the document! You can now see the summary and insights, or ask me questions below.` 
      }]);
    } catch (err) {
      console.error('Error refreshing AI:', err);
      // alert('Failed to generate summary. Please try again.'); // Interceptor handles 401
    } finally {
      setRefreshingAI(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = { role: 'user', content: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');
    setLoading(true);

    try {
      const res = await api.post(`/resources/${id}/chat`, { message: chatMessage });
      setChatHistory(prev => [...prev, { role: 'ai', content: res.data.response }]);
    } catch (err) {
      console.error('Chat Error:', err);
      setChatHistory(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting to the knowledge base right now." }]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  if (!resource) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-4">
      <h2 className="text-2xl font-bold">Resource Not Found</h2>
      <button onClick={() => navigate('/resources')} className="btn-primary">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <nav className="bg-white border-b border-outline-variant sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/resources')}
              className="p-2 hover:bg-surface rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2 text-on-surface-variant text-sm font-bold">
              <span>Resources</span>
              <ChevronRight size={14} />
              <span className="text-on-surface truncate max-w-[200px]">{resource.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href={resource.fileUrl} 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2 bg-surface text-on-surface text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-outline-variant transition-all border border-outline-variant"
            >
              <ExternalLink size={16} /> Original
            </a>
            <a 
              href={resource.fileUrl} 
              download
              className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:shadow-ambient transition-all"
            >
              <Download size={16} /> Download
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-80px)]">
        
        {/* Left Section: Document Preview */}
        <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6 h-full overflow-hidden">
          <div className="bg-white rounded-3xl border border-outline-variant flex-grow overflow-hidden relative shadow-sm">
            {resource.type === 'PDF' ? (
              <iframe 
                src={`${resource.fileUrl}#toolbar=0`} 
                title={resource.title} 
                className="w-full h-full border-none"
              />
            ) : resource.type === 'Video' ? (
              <video 
                src={resource.fileUrl} 
                controls 
                className="w-full h-full bg-black"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6">
                  <FileText size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2">{resource.title}</h2>
                <p className="text-on-surface-variant max-w-md mb-8">{resource.description}</p>
                <a href={resource.fileUrl} target="_blank" rel="noreferrer" className="btn-primary flex items-center gap-2">
                   Open Resource <ExternalLink size={18} />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Notebook LM Insights */}
        <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pr-2">
          
          {/* AI Summary Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-primary/5 border border-primary/20 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles size={20} fill="currentColor" />
                <h3 className="font-black uppercase tracking-widest text-xs">AI Research Summary</h3>
              </div>
              {!resource.aiSummary && !refreshingAI && (
                <button 
                  onClick={handleRefreshAI}
                  className="text-[10px] font-black bg-primary text-white px-3 py-1 rounded-full hover:shadow-ambient transition-all"
                >
                  Generate Summary
                </button>
              )}
            </div>
            
            {refreshingAI ? (
              <div className="flex items-center gap-3 text-primary text-sm font-bold">
                <Loader2 className="animate-spin" size={16} />
                Analyzing document with Groq...
              </div>
            ) : (
              <p className="text-on-surface text-sm leading-relaxed mb-4">
                {resource.aiSummary || "This resource hasn't been analyzed yet. Use the button above to generate a summary and key insights."}
              </p>
            )}
          </motion.div>

          {/* Key Insights */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 text-amber-600 mb-6">
              <Lightbulb size={20} fill="currentColor" />
              <h3 className="font-black uppercase tracking-widest text-xs">Key Insights</h3>
            </div>
            <div className="space-y-4">
              {resource.keyInsights?.length > 0 ? resource.keyInsights.map((insight, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-[10px] font-black shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm text-on-surface-variant leading-snug group-hover:text-amber-800 transition-colors">
                    {insight}
                  </p>
                </div>
              )) : (
                <p className="text-sm text-on-surface-variant italic">No insights available for this resource.</p>
              )}
            </div>
          </motion.div>

          {/* Knowledge Chat */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-outline-variant rounded-3xl flex-grow shadow-sm flex flex-col overflow-hidden min-h-[400px]"
          >
            <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface/30">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-primary" />
                <span className="text-sm font-bold">Knowledge Chat</span>
              </div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded-full">Active</span>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {chatHistory.map((chat, i) => (
                <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    chat.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-surface border border-outline-variant rounded-tl-none text-on-surface-variant'
                  }`}>
                    {chat.content}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-surface/30 border-t border-outline-variant">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask a question about this..."
                  className="w-full pl-4 pr-12 py-3 bg-white border border-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:shadow-ambient transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </form>
          </motion.div>

          {/* Meta Info */}
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <User size={14} />
              <span className="text-xs font-bold">{resource.uploadedBy?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Clock size={14} />
              <span className="text-xs font-bold">{new Date(resource.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourceDetails;
