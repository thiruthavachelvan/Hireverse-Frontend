import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Bell, CheckCircle, Briefcase, Calendar, Trophy,
  XCircle, ArrowRight, Eye, Inbox
} from 'lucide-react';

const typeConfig = {
  application_received: { icon: Briefcase, color: 'text-violet-500', bg: 'bg-violet-50 border-violet-100' },
  application_accepted: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
  application_rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-50 border-red-100' },
  round_scheduled:      { icon: Calendar, color: 'text-violet-500', bg: 'bg-violet-50 border-violet-100' },
  round_advanced:       { icon: CheckCircle, color: 'text-sky-500', bg: 'bg-sky-50 border-sky-100' },
  hired:                { icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
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
  }, [refreshUnreadCount]);

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      refreshUnreadCount();
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-[85vh] px-4 py-8 relative">
      <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />

      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-100 rounded-2xl">
              <Bell className="w-6 h-6 text-hv-violet animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-hv-text">Notifications</h1>
              <p className="text-hv-muted text-xs font-semibold uppercase tracking-wider">{notifications.length} total</p>
            </div>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={handleMarkAllRead}
              className="btn-ghost flex items-center gap-2 px-4 py-2 text-xs"
            >
              <Eye size={14} /> Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-2xl" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-16 text-center space-y-4"
          >
            <Inbox className="w-16 h-16 text-hv-subtle mx-auto animate-float" />
            <div>
              <h3 className="text-lg font-bold text-hv-text">All caught up!</h3>
              <p className="text-sm text-hv-muted mt-1 max-w-xs mx-auto">
                You will receive alerts here when companies schedule rounds or update your status.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } }
            }}
            className="space-y-3"
          >
            <AnimatePresence>
              {notifications.map(n => {
                const cfg = typeConfig[n.type] || typeConfig.application_received;
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={n._id}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      show: { opacity: 1, y: 0 }
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`card p-5 border flex gap-4 transition-all relative overflow-hidden ${
                      !n.isRead
                        ? 'border-l-4 border-l-hv-violet bg-violet-50/20'
                        : 'bg-white'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border flex-shrink-0 w-11 h-11 flex items-center justify-center ${cfg.bg}`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-hv-text font-bold text-sm leading-tight">{n.title}</p>
                        {!n.isRead && (
                          <span className="w-2.5 h-2.5 bg-hv-violet rounded-full flex-shrink-0 animate-pulse mt-0.5" />
                        )}
                      </div>
                      <p className="text-hv-muted text-sm mt-1 leading-relaxed">{n.message}</p>
                      
                      {n.scheduledAt && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-hv-violet bg-violet-100/50 border border-violet-100 px-3 py-1.5 rounded-xl w-fit font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(n.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                      )}
                      
                      <p className="text-hv-subtle text-[11px] font-bold uppercase mt-3">{timeAgo(n.createdAt)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
