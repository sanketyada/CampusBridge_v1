import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
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
  FileText
} from 'lucide-react';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Please login to view your profile details and activity.</p>
          <a href="/login" className="btn-primary py-3 px-8">Sign In</a>
        </div>
      </div>
    );
  }

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  }) : 'Recently Joined';

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8"
        >
          {/* Banner */}
          <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <button className="absolute bottom-4 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
              <Edit3 size={16} /> Edit Banner
            </button>
          </div>

          {/* Profile Basic Info */}
          <div className="px-10 pb-10 flex flex-col md:flex-row items-end gap-6 -mt-12">
            <div className="w-32 h-32 rounded-3xl bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-blue-600 text-5xl font-bold">
              {user.avatar?.url ? (
                <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            
            <div className="flex-grow pb-2">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <BadgeCheck size={24} className="text-blue-500" />
              </div>
              <p className="text-gray-500 font-medium">{user.role.charAt(0).toUpperCase() + user.role.slice(1)} • CampusBridge Community</p>
            </div>

            <button className="btn-primary py-2.5 px-6 rounded-xl flex items-center gap-2 mb-2">
              <Edit3 size={18} /> Edit Profile
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User size={20} className="text-blue-600" /> Details
              </h2>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium text-gray-700">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <School size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">College</p>
                    <p className="text-sm font-medium text-gray-700">{user.college || 'Not Specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <Building size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Department</p>
                    <p className="text-sm font-medium text-gray-700">{user.department || 'Not Specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</p>
                    <p className="text-sm font-medium text-gray-700">{joinDate}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50">
                <div className="flex items-center justify-between group cursor-pointer">
                  <span className="text-sm font-bold text-gray-900">Portfolio</span>
                  <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600 transition" />
                </div>
              </div>
            </div>

            {/* Skills/Tags Placeholder */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Top Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'System Design', 'UI/UX'].map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Activity / Activity Feed */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-bold text-gray-900 mb-1">12</p>
                <p className="text-xs font-bold text-gray-400 uppercase">Resources</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-bold text-gray-900 mb-1">45</p>
                <p className="text-xs font-bold text-gray-400 uppercase">AI Chats</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-bold text-gray-900 mb-1">8</p>
                <p className="text-xs font-bold text-gray-400 uppercase">Saved Events</p>
              </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen size={20} className="text-blue-600" /> Recent Activity
                </h2>
                <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
              </div>

              <div className="space-y-6">
                {[
                  { title: "Advanced React Context Patterns", type: "PDF", date: "2 days ago" },
                  { title: "MERN Stack Roadmap 2024", type: "Article", date: "1 week ago" }
                ].map((act, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                      <FileText size={20} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition">{act.title}</p>
                      <p className="text-xs text-gray-500">{act.type} • Published {act.date}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Placeholder */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award size={20} className="text-blue-600" /> Professional Badges
              </h2>
              <div className="flex items-center gap-6">
                <div className="text-center opacity-40">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Award size={24} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider">Top Contributor</p>
                </div>
                <div className="text-center opacity-40">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <BadgeCheck size={24} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider">AI Explorer</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
