import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  FaBell, FaCheckDouble, FaCheckCircle, FaBriefcase,
  FaCalendarAlt, FaTrophy, FaTimesCircle, FaInbox,
} from 'react-icons/fa';
import { MdMarkEmailRead } from 'react-icons/md';

const typeConfig = {
  application_received: { icon: FaBriefcase, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  application_accepted: { icon: FaCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  application_rejected: { icon: FaTimesCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  round_scheduled: { icon: FaCalendarAlt, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  round_advanced: { icon: FaCheckDouble, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  hired: { icon: FaTrophy, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
};

const Notifications = () => {
  const { refreshUnreadCount } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndMark = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data);
        await api.put('/notifications/read-all');
        refreshUnreadCount();
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchAndMark();
  }, []);

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m} minute${m > 1 ? 's' : ''} ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
    const d = Math.floor(h / 24);
    return `${d} day${d > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen bg-brand-dark px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-500/20 rounded-2xl">
              <FaBell className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              <p className="text-gray-400 text-sm">{notifications.length} total</p>
            </div>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={async () => {
                await api.put('/notifications/read-all');
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                refreshUnreadCount();
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/10 hover:bg-white/5 rounded-xl transition-all"
            >
              <MdMarkEmailRead className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glassmorphism rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="glassmorphism rounded-2xl p-16 text-center">
            <FaInbox className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-300 font-medium">No notifications yet</p>
            <p className="text-gray-500 text-sm mt-1">You'll be notified when there are updates to your applications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => {
              const cfg = typeConfig[n.type] || typeConfig['application_received'];
              const Icon = cfg.icon;
              return (
                <div
                  key={n._id}
                  className={`rounded-2xl p-5 border flex gap-4 transition-all ${!n.isRead ? 'bg-violet-500/5 border-violet-500/20' : 'bg-white/3 border-white/5'}`}
                >
                  <div className={`p-2.5 rounded-xl border ${cfg.bg} flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-white font-semibold text-sm">{n.title}</p>
                      {!n.isRead && (
                        <span className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">{n.message}</p>
                    {n.scheduledAt && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-lg w-fit">
                        <FaCalendarAlt className="w-3 h-3" />
                        {new Date(n.scheduledAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
                      </div>
                    )}
                    <p className="text-gray-600 text-xs mt-2">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
