import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Calendar, MapPin, Loader2, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/events/pending');
      setPendingEvents(res.data.data.events);
      setError(null);
    } catch (err) {
      console.error('Error fetching pending events:', err);
      setError('Failed to load pending events.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      await api.put(`/admin/events/${eventId}/approve`);
      setPendingEvents(pendingEvents.filter(event => event._id !== eventId));
    } catch (err) {
      console.error('Error approving event:', err);
      alert('Failed to approve event.');
    }
  };

  const handleReject = async (event) => {
    const isUpdate = !!event.pendingUpdate;
    const confirmMessage = isUpdate 
      ? 'Are you sure you want to reject these changes? The original event will remain unchanged.'
      : 'Are you sure you want to reject and delete this event?';
      
    if (window.confirm(confirmMessage)) {
      try {
        await api.delete(`/admin/events/${event._id}/reject`);
        setPendingEvents(pendingEvents.filter(e => e._id !== event._id));
      } catch (err) {
        console.error('Error rejecting event:', err);
        alert('Failed to reject event.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-b border-outline-variant pb-6">
        <h1 className="text-3xl font-bold text-on-surface">Admin Dashboard</h1>
        <p className="text-on-surface-variant mt-2">Manage unverified events pending approval.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {pendingEvents.length === 0 ? (
        <div className="bg-surface border border-outline-variant rounded-xl p-12 text-center">
          <Check size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-bold text-on-surface mb-2">All Caught Up!</h3>
          <p className="text-on-surface-variant">There are no pending events waiting for approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {pendingEvents.map(event => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
                className="bg-white rounded-xl shadow-ambient border border-outline-variant overflow-hidden flex flex-col"
              >
                <img 
                  src={event.image || 'https://images.unsplash.com/photo-1540575861501-7ad0582371f3?auto=format&fit=crop&w=800'} 
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {event.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      event.pendingDelete 
                        ? 'text-red-600 bg-red-50' 
                        : event.pendingUpdate 
                          ? 'text-amber-600 bg-amber-50' 
                          : 'text-on-surface-variant bg-surface'
                    }`}>
                      {event.pendingDelete ? 'Delete Request' : event.pendingUpdate ? 'Update Request' : 'New Event'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-sm text-on-surface-variant line-clamp-3 mb-4 flex-grow">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4 mt-auto">
                    {event.pendingDelete ? (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-4">
                        <h4 className="text-red-700 font-bold text-xs uppercase mb-1 flex items-center gap-1">
                          <AlertCircle size={12} /> Mentor Requested Deletion
                        </h4>
                        <p className="text-xs text-red-600">The organizer wants to permanently remove this event.</p>
                      </div>
                    ) : event.pendingUpdate ? (
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-4">
                        <h4 className="text-amber-700 font-bold text-xs uppercase mb-2 flex items-center gap-1">
                          <AlertCircle size={12} /> Update Request
                        </h4>
                        <div className="space-y-2 text-xs">
                          {Object.keys(event.pendingUpdate).map(key => {
                            const original = event[key];
                            const updated = event.pendingUpdate[key];
                            
                            // Only show if different
                            if (JSON.stringify(original) !== JSON.stringify(updated)) {
                              return (
                                <div key={key} className="border-b border-amber-200/50 pb-1">
                                  <span className="text-amber-800 font-bold capitalize">{key}: </span>
                                  <span className="text-gray-400 line-through mr-2">
                                    {key === 'date' ? new Date(original).toLocaleDateString() : original}
                                  </span>
                                  <span className="text-emerald-600 font-bold">
                                    {key === 'date' ? new Date(updated).toLocaleDateString() : updated}
                                  </span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center text-sm text-on-surface-variant">
                          <Calendar size={16} className="mr-2 text-primary" />
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center text-sm text-on-surface-variant">
                          <MapPin size={16} className="mr-2 text-primary" />
                          {event.location}
                        </div>
                      </>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      Organized by: {event.organizer?.name || event.organizer?.username || 'Unknown'} ({event.organizer?.email || 'No email'})
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4 border-t border-outline-variant pt-4">
                    <button 
                      onClick={() => handleApprove(event._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 rounded-lg font-bold transition-colors"
                    >
                      <Check size={18} /> {event.pendingDelete ? 'Approve Deletion' : event.pendingUpdate ? 'Approve Changes' : 'Approve Event'}
                    </button>
                    <button 
                      onClick={() => handleReject(event)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg font-bold transition-colors"
                    >
                      <X size={18} /> {event.pendingDelete ? 'Keep Event' : event.pendingUpdate ? 'Reject Update' : 'Reject Event'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
