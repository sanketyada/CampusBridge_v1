import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  MapPin,
  ExternalLink,
  Users,
  ChevronRight,
  Filter,
  Tag,
  Loader2,
  Plus,
  X,
  Image as ImageIcon,
  Link as LinkIcon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Info,
  ArrowUpRight,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const EventSphere = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Workshop',
    organizerLink: '',
    image: '',
    secretCode: ''
  });

  // External Devfolio Events Data
  const otherEvents = [
    {
      title: "Push to Prod Hackathon",
      date: "April 24, 2026",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      location: "Singapore (Offline)",
      link: "https://push-to-prod.devfolio.co/",
      source: "Devfolio"
    },
    {
      title: "Cepheus 2.0",
      date: "April 22 - 23, 2026",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
      location: "Bengaluru, India (Offline)",
      link: "https://cepheus-2.devfolio.co/",
      source: "Devfolio"
    },
    {
      title: "InOut2k26",
      date: "April 24 - 25, 2026",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      location: "Online",
      link: "https://inout2026.devfolio.co/",
      source: "Devfolio"
    },
    {
      title: "Susegad Sprint 2026",
      date: "April 21 - 22, 2026",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      location: "Online",
      link: "https://susegad-sprint.devfolio.co/",
      source: "Devfolio"
    },
    {
      title: "Rota-Tech X",
      date: "April 25, 2026",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
      location: "Offline",
      link: "https://rotatech-x.devfolio.co/",
      source: "Devfolio"
    },
    {
      title: "Hack&Chill 3.0",
      date: "April 23, 2026",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      location: "Offline",
      link: "https://hackandchill--3.devfolio.co/",
      source: "Devfolio"
    }
  ];

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data.data.events);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const categories = ['All', 'Hackathon', 'Workshop', 'Seminar', 'Tech Fest', 'Expert Talk'];

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'All' || event.category === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.post('/events', formData);
      setSuccess(true);
      setTimeout(() => {
        setShowCreateModal(false);
        setSuccess(false);
        setFormData({
          title: '',
          description: '',
          date: '',
          location: '',
          category: 'Workshop',
          organizerLink: '',
          image: '',
          secretCode: ''
        });
        fetchEvents();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please check your secret code.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Header Section */}
      <section className="bg-white border-b border-outline-variant pt-16 pb-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-on-surface mb-2 tracking-tight">Discovery Hub</h1>
              <p className="text-on-surface-variant text-lg">
                Explore hackathons, workshops, and tech events.
              </p>
            </div>

            {user?.role === 'mentor' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center gap-2 px-6 py-3 shadow-lg shadow-primary/20"
              >
                <Plus size={20} /> Organize Event
              </motion.button>
            )}
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search events, technologies, or keywords..."
                className="w-full pl-14 pr-6 py-4 bg-surface border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-lg shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${filter === cat
                    ? 'bg-primary border-primary text-white shadow-ambient'
                    : 'bg-white border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Internal Events Grid */}
      <div className="container-custom py-16">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Upcoming Events</h2>
            <p className="text-on-surface-variant text-sm mt-1">{filteredEvents.length} internal opportunities found</p>
          </div>
          <button className="flex items-center gap-2 text-primary font-bold hover:underline text-sm bg-primary/5 px-4 py-2 rounded-lg transition-colors">
            <Filter size={16} />
            Advanced Filters
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[400px] bg-white rounded-2xl border border-outline-variant animate-pulse shadow-card"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  key={event._id}
                  onClick={() => setSelectedEvent(event)}
                  className="card-premium flex flex-col group h-full overflow-hidden border border-outline-variant cursor-pointer"
                >
                  {/* Event Thumbnail */}
                  <div className="relative h-48 bg-surface overflow-hidden">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <Calendar className="text-primary/20" size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold border border-white/20 uppercase tracking-wider text-primary shadow-sm">
                      {event.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors flex-grow leading-tight">
                      {event.title}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <Calendar size={16} className="text-primary/60" />
                        <span className="text-sm font-medium">
                          {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <MapPin size={16} className="text-primary/60" />
                        <span className="text-sm font-medium">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <Users size={16} className="text-primary/60" />
                        <span className="text-sm font-medium">{event.attendees?.length || 0} Registered</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-outline-variant mt-auto flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {event.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-on-surface-variant bg-surface px-2 py-1 rounded-md border border-outline-variant">#{tag}</span>
                        ))}
                      </div>
                      <div className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Quick View <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Other Events (External from Devfolio) */}
        {!searchQuery && (filter === 'All' || filter === 'Hackathon') && (
          <div className="mt-24">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px bg-outline-variant flex-grow" />
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full">
                  <Globe size={50} />

                </div>
                <h2 className="text-4xl font-bold text-on-surface"  >Extro<span className="text-blue-600">Sphere</span></h2>
                <p className="text-on-surface-variant text-sm mt-1">{otherEvents.length} internal opportunities found</p>
              </div>
              <div className="h-px bg-outline-variant flex-grow" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherEvents.map((ext, i) => (
                <motion.a
                  href={ext.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-outline-variant hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img src={ext.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={ext.title} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                    <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-lg rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-on-surface mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{ext.title}</h3>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
                        <Calendar size={14} className="text-primary/40" />
                        {ext.date}
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
                        <MapPin size={14} className="text-primary/40" />
                        {ext.location}
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-xs font-black uppercase tracking-widest text-primary hover:gap-2 transition-all">
                      Visit Website <ExternalLink size={14} />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a
                href="https://devfolio.co/hackathons"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-surface border border-outline-variant rounded-2xl text-on-surface-variant font-bold hover:bg-white hover:border-primary hover:text-primary transition-all shadow-sm"
              >
                Browse all on Devfolio <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        )}

        {!loading && filteredEvents.length === 0 && !searchQuery && (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-outline-variant">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-on-surface mb-2">No internal events found</h3>
            <p className="text-on-surface-variant">Check out the Devfolio section below for external opportunities.</p>
          </div>
        )}
      </div>

      {/* Event Details Modal (Brief manner summary) */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-on-surface/50 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="relative h-64">
                <img
                  src={selectedEvent.image}
                  className="w-full h-full object-cover"
                  alt={selectedEvent.title}
                />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-6 right-6 p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-lg rounded-full text-white transition-all shadow-xl"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-6 left-8 bg-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-primary shadow-lg border border-primary/10">
                  {selectedEvent.category}
                </div>
              </div>

              <div className="p-10">
                <h2 className="text-3xl font-bold text-on-surface mb-6 leading-tight">
                  {selectedEvent.title}
                </h2>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-outline-variant/60">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Date</p>
                      <p className="text-sm font-bold text-on-surface">
                        {new Date(selectedEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-outline-variant/60">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Location</p>
                      <p className="text-sm font-bold text-on-surface truncate max-w-[120px]">
                        {selectedEvent.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-2 text-primary">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Info size={16} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest">Event Summary</h3>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed font-medium">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href={selectedEvent.organizerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow btn-primary py-4 flex items-center justify-center gap-2 text-lg shadow-xl shadow-primary/30"
                  >
                    Register Now <ExternalLink size={20} />
                  </a>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-4 bg-surface border border-outline-variant rounded-2xl text-on-surface-variant hover:bg-gray-50 transition-all font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setShowCreateModal(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-ambient overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">Organize Community Event</h2>
                </div>
                {!submitting && (
                  <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-surface rounded-full transition-colors">
                    <X size={20} />
                  </button>
                )}
              </div>

              {success ? (
                <div className="py-20 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-on-surface mb-2">Event Created!</h3>
                  <p className="text-on-surface-variant">Your event has been successfully listed in the discovery hub.</p>
                </div>
              ) : (
                <form onSubmit={handleCreateEvent} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-60 uppercase tracking-widest ml-1">Event Title</label>
                      <input
                        required
                        type="text"
                        className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                        placeholder="Ex: Web3 Hackathon 2026"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-60 uppercase tracking-widest ml-1">Category</label>
                      <select
                        className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl outline-none font-bold"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option>Hackathon</option>
                        <option>Workshop</option>
                        <option>Seminar</option>
                        <option>Tech Fest</option>
                        <option>Expert Talk</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-60 uppercase tracking-widest ml-1">Date & Time</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          required
                          type="datetime-local"
                          className="w-full pl-12 pr-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-60 uppercase tracking-widest ml-1">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          required
                          type="text"
                          className="w-full pl-12 pr-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                          placeholder="Venue or Virtual Link"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold opacity-60 uppercase tracking-widest ml-1">Description</label>
                    <textarea
                      required
                      rows="3"
                      className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold resize-none"
                      placeholder="What is this event about?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-60 uppercase tracking-widest ml-1">Registration Link</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          required
                          type="url"
                          className="w-full pl-12 pr-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                          placeholder="https://..."
                          value={formData.organizerLink}
                          onChange={(e) => setFormData({ ...formData, organizerLink: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-60 uppercase tracking-widest ml-1">Banner Image URL (Optional)</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="url"
                          className="w-full pl-12 pr-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold"
                          placeholder="Leave empty for category default"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Secret Code Section */}
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="flex-grow">
                        <label className="text-sm font-bold text-on-surface uppercase tracking-widest mb-1 block">Authentication Code</label>
                        <p className="text-xs text-on-surface-variant mb-4">Enter the organization secret code provided by CampusBridge to verify this event.</p>
                        <input
                          required
                          type="password"
                          className="w-full px-5 py-3.5 bg-white border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-bold tracking-widest"
                          placeholder="••••••••"
                          value={formData.secretCode}
                          onChange={(e) => setFormData({ ...formData, secretCode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg shadow-xl shadow-primary/20"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Validating & Creating...
                      </>
                    ) : (
                      <>
                        Publish Event <ChevronRight size={20} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventSphere;
