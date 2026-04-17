import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Settings, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Events', path: '/events' },
    { title: 'Roadmaps', path: '/roadmaps' },
    { title: 'AI Bot', path: '/ai-bot' },
    { title: 'Resources', path: '/resources' },
    { title: 'Community', path: '/community' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm'
          : 'h-20 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
          Campus<span className="text-blue-600">Bridge</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">

          {/* Links */}
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.path}
                className={`relative text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {link.title}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 ml-6">
            {!user ? (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-200"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 hover:bg-gray-50 transition shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0) || <User size={18} />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2"
                    >
                      <div className="px-4 py-3 border-b border-gray-50 mb-2">
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-full uppercase tracking-wider">
                          {user.role}
                        </span>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <User size={16} className="text-gray-400" />
                        My Profile
                      </Link>
                      
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-50 mt-1"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200 shadow-xl overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-semibold ${
                    isActive(link.path)
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  {link.title}
                </Link>
              ))}

              <div className="pt-4 border-t flex flex-col gap-3">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-center py-2 text-gray-600 font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="bg-blue-600 text-white text-center py-3 rounded-lg font-bold shadow-lg"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                      className="w-full bg-white text-red-600 py-3 rounded-lg font-bold border border-red-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;