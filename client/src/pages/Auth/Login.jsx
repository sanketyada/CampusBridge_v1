import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token } = res.data;
      const { user } = res.data.data;
      login(user, token);
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 bg-surface">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white p-10 rounded-xl shadow-ambient border border-outline-variant"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-on-surface mb-2">Welcome Back</h1>
          <p className="text-on-surface-variant">Continue your career journey with CampusBridge</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface">Email Address</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                required
                className="w-full pl-11 pr-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                placeholder="name@college.edu"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface">Password</label>
              <Link to="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
            </div>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="password"
                required
                className="w-full pl-11 pr-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Authenticating...
              </>
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-outline-variant text-center">
          <p className="text-on-surface-variant text-sm font-medium">
            New to CampusBridge?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline ml-1">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
