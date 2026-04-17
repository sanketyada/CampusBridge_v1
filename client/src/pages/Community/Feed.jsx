import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Share2, Send, Plus, Users, Award, TrendingUp, Loader2 } from 'lucide-react';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feed');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || posting) return;

    setPosting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/feed', 
        { content: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewPost('');
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/feed/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-20">
      <div className="container-custom pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Stats/Profile Profile */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="card-premium p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 font-bold text-xl">
                CB
              </div>
              <h3 className="font-bold text-on-surface">Community Hub</h3>
              <p className="text-xs text-on-surface-variant mt-1">Connect with 2,500+ peers</p>
              
              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant font-bold">Posts</span>
                  <span className="text-primary font-black">{posts.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant font-bold">Connections</span>
                  <span className="text-primary font-black">124</span>
                </div>
              </div>
            </div>

            <div className="card-premium p-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Trending Tags</h4>
              <div className="flex flex-wrap gap-2">
                {['#hackathon', '#placement', '#mern', '#react', '#internship'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-surface border border-outline-variant rounded-full text-[10px] font-bold text-on-surface-variant hover:border-primary hover:text-primary cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Main Feed Area */}
          <div className="lg:col-span-6 space-y-6">
            {/* Create Post */}
            <div className="card-premium p-6 border-2 border-primary/10">
              <form onSubmit={handleCreatePost}>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0">
                    U
                  </div>
                  <textarea
                    className="w-full bg-surface border-none focus:ring-0 text-sm font-medium resize-none py-2 placeholder:text-on-surface-variant/50"
                    placeholder="Share an achievement, ask a question, or start a discussion..."
                    rows="3"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
                </div>
                <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between items-center">
                  <div className="flex gap-4 text-on-surface-variant">
                    <button type="button" className="hover:text-primary transition-colors"><Plus size={20} /></button>
                    <button type="button" className="hover:text-primary transition-colors"><Award size={20} /></button>
                  </div>
                  <button 
                    disabled={!newPost.trim() || posting}
                    className="btn-primary py-2 px-6 text-sm flex items-center gap-2"
                  >
                    {posting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    Post
                  </button>
                </div>
              </form>
            </div>

            {/* Posts List */}
            {loading ? (
              <div className="space-y-6">
                {[1, 2].map(i => (
                  <div key={i} className="h-48 bg-white rounded-3xl border border-outline-variant animate-pulse shadow-card"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {posts.map((post, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={post._id}
                      className="card-premium p-6 group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${post.author?.role === 'mentor' ? 'bg-amber-500' : 'bg-primary'}`}>
                            {post.author?.name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-on-surface flex items-center gap-2">
                              {post.author?.name}
                              {post.author?.role === 'mentor' && <Award size={14} className="text-amber-500" />}
                            </h4>
                            <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
                              {post.author?.role} • {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-on-surface font-medium leading-relaxed mb-6">
                        {post.content}
                      </p>

                      <div className="flex gap-6 pt-4 border-t border-outline-variant">
                        <button 
                          onClick={() => handleLike(post._id)}
                          className={`flex items-center gap-2 text-xs font-bold transition-colors ${post.likes?.length > 0 ? 'text-red-500' : 'text-on-surface-variant hover:text-red-500'}`}
                        >
                          <Heart size={18} fill={post.likes?.length > 0 ? 'currentColor' : 'none'} />
                          {post.likes?.length || 0}
                        </button>
                        <button className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                          <MessageSquare size={18} />
                          {post.comments?.length || 0}
                        </button>
                        <button className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors ml-auto">
                          <Share2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right Sidebar - Mentors/Suggestions */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="card-premium p-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
                <TrendingUp size={14} className="text-primary" /> Active Mentors
              </h4>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface border border-outline-variant flex items-center justify-center text-[10px] font-bold">
                      M{i}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">Mentor Name {i}</p>
                      <p className="text-[10px] text-on-surface-variant">Available for chat</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 bg-surface hover:bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 rounded-lg transition-colors">
                View All Mentors
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Feed;
