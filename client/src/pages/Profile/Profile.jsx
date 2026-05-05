import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { 
  User, 
  Mail, 
  School, 
  Building, 
  Calendar, 
  BadgeCheck, 
  Edit3, 
  BookOpen, 
  Award,
  ChevronRight,
  ExternalLink,
  FileText,
  X,
  Save,
  Loader2,
  Globe,
  Plus
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Profile = () => {
  const { user, loading, login } = useAuth(); // We'll use login to update the user context after edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    college: user?.college || '',
    department: user?.department || '',
    year: user?.year || '1st Year',
    skills: user?.skills?.join(', ') || '',
    socialLinks: {
      github: user?.socialLinks?.github || '',
      linkedIn: user?.socialLinks?.linkedIn || '',
      portfolio: user?.socialLinks?.portfolio || ''
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-on-surface mb-2">Profile Not Found</h2>
          <p className="text-on-surface-variant mb-6">Please login to view your profile details and activity.</p>
          <a href="/login" className="btn-primary py-3 px-8">Sign In</a>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
      const res = await api.patch('/auth/update-profile', {
        ...formData,
        skills: skillsArray
      });
      
      // Update local storage and context if needed
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...storedUser, ...res.data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setShowEditModal(false);
      window.location.reload(); // Quickest way to refresh all components with new data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSubmitting(true);
    try {
      const uploadData = new FormData();
      uploadData.append('avatar', file);
      const res = await api.post('/auth/upload-avatar', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update local storage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...storedUser, ...res.data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      window.location.reload();
    } catch (err) {
      setError('Avatar upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  }) : 'Recently Joined';

  return (
    <div className="min-h-screen bg-surface pb-20">
      <div className="container-custom pt-24">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-card border border-outline-variant overflow-hidden mb-8"
        >
          <div className="h-64 relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="College Campus" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>

          <div className="px-10 pb-10 flex flex-col md:flex-row items-end gap-6 -mt-16 relative z-10">
            <div className="w-32 h-32 rounded-3xl bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-primary text-5xl font-bold">
              {user.avatar?.url ? (
                <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            
            <div className="flex-grow pb-2">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-on-surface">{user.name}</h1>
                {user.role === 'mentor' && <BadgeCheck size={24} className="text-primary" />}
              </div>
              <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest">
                {user.role} • {user.department || 'Student'}
              </p>
              {user.bio && <p className="mt-3 text-sm text-on-surface-variant max-w-2xl leading-relaxed">{user.bio}</p>}
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="btn-primary py-3 px-6 rounded-2xl flex items-center gap-2 mb-2 shadow-xl shadow-primary/20"
            >
              <Edit3 size={18} /> Edit Profile
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Details & Skills */}
          <div className="space-y-6">
            <div className="card-premium p-8">
              <h2 className="text-lg font-black text-on-surface mb-6 flex items-center gap-2 uppercase tracking-widest opacity-60">
                <User size={20} className="text-primary" /> Profile Info
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-0.5">Email Address</p>
                    <p className="text-sm font-bold text-on-surface">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                    <School size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-0.5">College / Institution</p>
                    <p className="text-sm font-bold text-on-surface">{user.college || 'Not Specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-0.5">Member Since</p>
                    <p className="text-sm font-bold text-on-surface">{joinDate}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-outline-variant grid grid-cols-3 gap-4">
                <a href={user.socialLinks?.github || '#'} className={`p-3 rounded-2xl flex items-center justify-center transition-all ${user.socialLinks?.github ? 'bg-black text-white hover:scale-105' : 'bg-surface border border-outline-variant text-on-surface-variant opacity-40'}`}>
                  <FaGithub size={20} />
                </a>
                <a href={user.socialLinks?.linkedIn || '#'} className={`p-3 rounded-2xl flex items-center justify-center transition-all ${user.socialLinks?.linkedIn ? 'bg-blue-600 text-white hover:scale-105' : 'bg-surface border border-outline-variant text-on-surface-variant opacity-40'}`}>
                  <FaLinkedin size={20} />
                </a>
                <a href={user.socialLinks?.portfolio || '#'} className={`p-3 rounded-2xl flex items-center justify-center transition-all ${user.socialLinks?.portfolio ? 'bg-primary text-white hover:scale-105' : 'bg-surface border border-outline-variant text-on-surface-variant opacity-40'}`}>
                  <Globe size={20} />
                </a>
              </div>
            </div>

            <div className="card-premium p-8">
              <h3 className="text-xs font-black text-on-surface-variant mb-6 uppercase tracking-widest">Expertise & Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills?.length > 0 ? user.skills.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-primary/5 text-primary text-xs font-black rounded-xl border border-primary/10">
                    {skill}
                  </span>
                )) : (
                  <p className="text-xs text-on-surface-variant italic">No skills added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Activity Placeholder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="card-premium p-6 text-center">
                <p className="text-2xl font-black text-primary mb-1">{user.savedEvents?.length || 0}</p>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">Events</p>
              </div>
              <div className="card-premium p-6 text-center">
                <p className="text-2xl font-black text-primary mb-1">0</p>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">Resources</p>
              </div>
              <div className="card-premium p-6 text-center">
                <p className="text-2xl font-black text-primary mb-1">0</p>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">Courses</p>
              </div>
            </div>

            <div className="card-premium p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-black text-on-surface flex items-center gap-2 uppercase tracking-widest opacity-60">
                  <BookOpen size={20} className="text-primary" /> Learning Progress
                </h2>
              </div>
              <div className="py-12 text-center">
                <BookOpen className="mx-auto text-on-surface-variant/20 mb-4" size={48} />
                <p className="text-sm font-bold text-on-surface-variant">No recent activity found.</p>
                <p className="text-xs text-on-surface-variant mt-1 opacity-60">Start exploring events and roadmaps to build your profile.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="fixed inset-0 bg-on-surface/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface rounded-[2rem] shadow-2xl overflow-hidden my-auto"
            >
              <div className="p-8 border-b border-outline-variant flex justify-between items-center">
                <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight">Edit Profile</h2>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-surface-variant rounded-full transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{error}</div>}
                
                {/* Avatar Upload Section */}
                <div className="flex flex-col items-center justify-center pb-6 border-b border-outline-variant">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold overflow-hidden border-4 border-surface shadow-lg">
                      {user.avatar?.url ? (
                        <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
                      <Plus className="text-white" size={32} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={submitting} />
                    </label>
                  </div>
                  <p className="mt-2 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Change Profile Picture</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text"
                      className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1">College</label>
                    <input 
                      type="text"
                      className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1">Department</label>
                    <input 
                      type="text"
                      className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1">Year</label>
                    <select 
                      className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Graduate</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1">Bio</label>
                  <textarea 
                    rows="3"
                    className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold resize-none"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1">Skills (comma separated)</label>
                  <input 
                    type="text"
                    className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                    placeholder="React, Node.js, Python..."
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1">GitHub</label>
                    <input 
                      type="url"
                      className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                      value={formData.socialLinks.github}
                      onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1">LinkedIn</label>
                    <input 
                      type="url"
                      className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                      value={formData.socialLinks.linkedIn}
                      onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedIn: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1">Portfolio</label>
                    <input 
                      type="url"
                      className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                      value={formData.socialLinks.portfolio}
                      onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, portfolio: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-4 px-6 bg-surface border border-outline-variant rounded-2xl font-black uppercase tracking-widest hover:bg-surface-variant transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-4 px-6 btn-primary rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
