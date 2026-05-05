import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Share2, Send, Plus, Users, Award, TrendingUp, Loader2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [communityData, setCommunityData] = useState({
    userCount: 0,
    mentors: [],
    trendingTags: []
  });
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [showMentorsModal, setShowMentorsModal] = useState(false);
  const [allMentors, setAllMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(false);

  const fetchData = async () => {
    try {
      const [postsRes, communityRes] = await Promise.all([
        api.get('/feed'),
        api.get('/community/data')
      ]);
      setPosts(postsRes.data);
      setCommunityData(communityRes.data.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/feed');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || posting) return;

    setPosting(true);
    try {
      await api.post('/feed', { content: newPost });
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
      await api.put(`/feed/${postId}/like`);
      fetchPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim() || commenting) return;
    setCommenting(true);
    try {
      await api.post(`/feed/${postId}/comment`, { text: commentText });
      setCommentText('');
      fetchPosts();
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setCommenting(false);
    }
  };

  const handleShare = async (post) => {
    const shareData = {
      title: 'CampusBridge Post',
      text: post.content,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Post link copied to clipboard!');
    }
  };

  const handleViewAllMentors = async () => {
    setShowMentorsModal(true);
    setLoadingMentors(true);
    try {
      const res = await api.get('/community/mentors');
      setAllMentors(res.data.data);
    } catch (err) {
      console.error('Error fetching mentors:', err);
    } finally {
      setLoadingMentors(false);
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
              <p className="text-xs text-on-surface-variant mt-1">Connect with {communityData.userCount}+ peers</p>
              
              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant font-bold">Total Posts</span>
                  <span className="text-primary font-black">{posts.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant font-bold">Active Mentors</span>
                  <span className="text-primary font-black">{communityData.mentors.length}</span>
                </div>
              </div>
            </div>

            <div className="card-premium p-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Trending Tags</h4>
              <div className="flex flex-wrap gap-2">
                {communityData.trendingTags.map(tag => (
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
                    {user?.name?.charAt(0) || 'U'}
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
                          className={`flex items-center gap-2 text-xs font-bold transition-colors ${post.likes?.includes(user?._id) ? 'text-red-500' : 'text-on-surface-variant hover:text-red-500'}`}
                        >
                          <Heart size={18} fill={post.likes?.includes(user?._id) ? 'currentColor' : 'none'} />
                          {post.likes?.length || 0}
                        </button>
                        <button 
                          onClick={() => setExpandedPostId(expandedPostId === post._id ? null : post._id)}
                          className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <MessageSquare size={18} />
                          {post.comments?.length || 0}
                        </button>
                        <button 
                          onClick={() => handleShare(post)}
                          className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors ml-auto"
                        >
                          <Share2 size={18} />
                        </button>
                      </div>

                      {/* Comments Section */}
                      {expandedPostId === post._id && (
                        <div className="mt-6 pt-6 border-t border-outline-variant space-y-4">
                          <div className="space-y-4">
                            {post.comments?.map((comment, i) => (
                              <div key={i} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                                  {comment.author?.name?.charAt(0) || 'A'}
                                </div>
                                <div className="bg-surface p-3 rounded-2xl flex-grow">
                                  <div className="flex justify-between items-center mb-1">
                                    <h5 className="text-[10px] font-bold text-on-surface">{comment.author?.name}</h5>
                                    <span className="text-[8px] text-on-surface-variant uppercase">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-xs text-on-surface-variant font-medium">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex gap-3 pt-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                              {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-grow flex gap-2">
                              <input 
                                type="text"
                                placeholder="Write a comment..."
                                className="flex-grow bg-surface border-none focus:ring-1 focus:ring-primary/20 rounded-xl px-4 py-2 text-xs font-medium"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                              />
                              <button 
                                onClick={() => handleComment(post._id)}
                                disabled={!commentText.trim() || commenting}
                                className="p-2 text-primary hover:bg-primary/5 rounded-xl transition-colors disabled:opacity-50"
                              >
                                <Send size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
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
                {communityData.mentors.map(mentor => (
                  <div key={mentor._id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-700 overflow-hidden">
                      {mentor.avatar?.url ? <img src={mentor.avatar.url} alt={mentor.name} className="w-full h-full object-cover" /> : mentor.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">{mentor.name}</p>
                      <p className="text-[10px] text-on-surface-variant">Available for chat</p>
                    </div>
                  </div>
                ))}
                {communityData.mentors.length === 0 && (
                  <p className="text-[10px] text-on-surface-variant italic">No active mentors found</p>
                )}
              </div>
              <button 
                onClick={handleViewAllMentors}
                className="w-full mt-6 py-2 bg-surface hover:bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 rounded-lg transition-colors"
              >
                View All Mentors
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mentors Modal */}
      <AnimatePresence>
        {showMentorsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMentorsModal(false)}
              className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-surface rounded-3xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface">
                <div>
                  <h2 className="text-xl font-black text-on-surface">CampusBridge Mentors</h2>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Expert guidance for your career</p>
                </div>
                <button 
                  onClick={() => setShowMentorsModal(false)}
                  className="p-2 hover:bg-surface-variant rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {loadingMentors ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="animate-spin text-primary mb-4" size={40} />
                    <p className="text-sm font-bold text-on-surface-variant">Finding expert mentors...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allMentors.map(mentor => (
                      <div key={mentor._id} className="card-premium p-4 flex gap-4 hover:border-primary/30 transition-all cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-xl font-bold text-amber-700 shrink-0 overflow-hidden border border-amber-200">
                          {mentor.avatar?.url ? <img src={mentor.avatar.url} alt={mentor.name} className="w-full h-full object-cover" /> : mentor.name.charAt(0)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-on-surface">{mentor.name}</h4>
                            <Award size={14} className="text-amber-500" />
                          </div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{mentor.college || 'Verified Mentor'}</p>
                          <p className="text-xs text-on-surface-variant line-clamp-2 mb-3 leading-relaxed">{mentor.bio || 'Experienced mentor ready to help you with your career goals and technical skills.'}</p>
                          <div className="flex flex-wrap gap-1">
                            {mentor.skills?.slice(0, 3).map(skill => (
                              <span key={skill} className="px-2 py-0.5 bg-surface border border-outline-variant rounded-md text-[8px] font-bold text-on-surface-variant">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    {allMentors.length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <Users className="mx-auto text-on-surface-variant/20 mb-4" size={48} />
                        <p className="text-on-surface-variant font-bold">No mentors found at the moment.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-surface-variant/30 border-t border-outline-variant flex justify-center">
                <p className="text-[10px] text-on-surface-variant font-bold text-center">
                  Want to become a mentor? <span className="text-primary cursor-pointer hover:underline">Apply here</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Feed;
