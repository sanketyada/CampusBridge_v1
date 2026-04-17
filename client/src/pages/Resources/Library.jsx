import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Filter, Book, FileText, Video, Link as LinkIcon, Download, Plus, X, Upload, Loader2, FileUp, Sparkles, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const Library = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Upload Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    type: 'PDF',
    file: null
  });

  const fetchResources = async () => {
    try {
      const res = await api.get(`/resources?category=${filter !== 'All' ? filter : ''}&search=${search}`);
      setResources(res.data);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [filter, search]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('type', formData.type);
    if (formData.file) data.append('file', formData.file);
    if (formData.url) data.append('url', formData.url);

    try {
      await api.post('/resources', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowUpload(false);
      fetchResources();
    } catch (err) {
      console.error('Upload Error:', err);
    } finally {
      setUploading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'PDF': return <FileText size={20} />;
      case 'Video': return <Video size={20} />;
      case 'Link': return <LinkIcon size={20} />;
      default: return <Book size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-20">
      <section className="bg-white border-b border-outline-variant pt-16 pb-12">
        <div className="container-custom flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-on-surface mb-2">Resource Library</h1>
            <p className="text-on-surface-variant text-lg">Curated materials to accelerate your technical skills.</p>
          </div>
          <button 
            onClick={() => setShowUpload(true)}
            className="btn-primary flex items-center gap-2 self-start"
          >
            <Plus size={20} /> Upload Resource
          </button>
        </div>
      </section>

      <div className="container-custom py-12">
        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold" size={20} />
            <input
              type="text"
              placeholder="Search resources by title or technology..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-outline-variant w-fit shrink-0">
            {['All', 'Development', 'Design', 'CS Fundamentals', 'Career'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === cat ? 'bg-primary text-white shadow-ambient' : 'text-on-surface-variant hover:bg-surface'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-white rounded-2xl border border-outline-variant animate-pulse shadow-card"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {resources.map((res, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={res._id}
                  className="card-premium h-full flex flex-col border border-outline-variant group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                    res.type === 'PDF' ? 'bg-red-50 text-red-600' :
                    res.type === 'Video' ? 'bg-blue-50 text-blue-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {getIcon(res.type)}
                  </div>
                  
                  <h3 className="text-lg font-bold text-on-surface mb-2 line-clamp-2 leading-tight flex-grow">
                    {res.title}
                  </h3>
                  
                  <p className="text-xs text-on-surface-variant mb-6 line-clamp-2 opacity-70">
                    {res.description}
                  </p>

                  <div className="pt-6 border-t border-outline-variant flex items-center justify-between mt-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                       {res.category}
                    </span>
                    <div className="flex items-center gap-2">
                      {res.aiSummary && (
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center" title="AI Summary Available">
                          <Sparkles size={14} fill="currentColor" />
                        </div>
                      )}
                      <Link 
                        to={`/resources/${res._id}`}
                        className="w-9 h-9 bg-surface rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpload(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-ambient overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Upload Resource</h2>
                <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-surface rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-60 uppercase tracking-widest">Resource Title</label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                    placeholder="Enter resource title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-60 uppercase tracking-widest">Description</label>
                  <textarea
                    required
                    rows="3"
                    className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold resize-none"
                    placeholder="Enter a brief description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-60 uppercase tracking-widest">Type</label>
                    <select
                      className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl outline-none font-bold"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option>PDF</option>
                      <option>Video</option>
                      <option>Link</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-60 uppercase tracking-widest">Category</label>
                    <select
                      className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl outline-none font-bold"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option>Development</option>
                      <option>Design</option>
                      <option>CS Fundamentals</option>
                      <option>Career</option>
                    </select>
                  </div>
                </div>

                {formData.type === 'Link' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-60 uppercase tracking-widest">Resource URL</label>
                    <input
                      required
                      type="url"
                      className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                      placeholder="https://example.com/resource"
                      value={formData.url || ''}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-60 uppercase tracking-widest">File / Attachment</label>
                    <label className="group h-32 w-full flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-2xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                      />
                      <FileUp className="text-gray-400 group-hover:text-primary transition-colors mb-2" size={32} />
                      <span className="text-xs font-bold text-on-surface-variant">
                        {formData.file ? formData.file.name : 'Click to select PDF/Video'}
                      </span>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2"
                >
                  {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                  {uploading ? 'Uploading...' : 'Publish Resource'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Library;
