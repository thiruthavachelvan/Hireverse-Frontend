import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Bell, LogOut, CheckCircle, Clock, Search, X,
  Briefcase, Calendar, Handshake, Trophy, ChevronRight
} from 'lucide-react';
import { HLogo } from './AppLoader';

const notifIcons = {
  application_received: <Briefcase size={14} className="text-violet-500" />,
  application_accepted: <CheckCircle size={14} className="text-emerald-500" />,
  application_rejected: <X size={14} className="text-red-400" />,
  round_scheduled:      <Calendar size={14} className="text-violet-500" />,
  round_advanced:       <Handshake size={14} className="text-sky-500" />,
  hired:                <Trophy size={14} className="text-amber-500" />,
  job_posted:           <Briefcase size={14} className="text-coral-500" />,
};

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const Navbar = () => {
  const { user, logout, unreadCount, refreshUnreadCount, isAdmin, isCompany } = useAuth();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Track scroll for navbar appearance change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchNotifications = async () => {
    if (!user) return;
    setNotifLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.slice(0, 6));
    } catch { /* ignore */ }
    setNotifLoading(false);
  };

  const handleBellClick = async () => {
    if (!showNotif) {
      await fetchNotifications();
      try {
        await api.put('/notifications/read-all');
        refreshUnreadCount();
      } catch { /* ignore */ }
    }
    setShowNotif(v => !v);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      animate={{
        boxShadow: scrolled
          ? '0 4px 24px rgba(0,0,0,0.08)'
          : '0 1px 3px rgba(0,0,0,0.04)',
      }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full"
      style={{
        background: scrolled
          ? 'rgba(255,255,255,0.95)'
          : 'rgba(248,248,252,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Left: Logo (shown only on public pages or when sidebar is not visible) */}
        <Link
          to={user ? (isCompany ? '/dashboard' : isAdmin ? '/admin' : '/feed') : '/'}
          className="flex items-center gap-2.5 flex-shrink-0"
        >
          <HLogo size={36} />
          <span className="font-black text-lg gradient-text hidden sm:block">HireVerse</span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto">

          {!user ? (
            /* Unauthenticated */
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-hv-muted hover:text-hv-text px-4 py-2 rounded-xl transition-colors"
              >
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm px-5 py-2.5">
                Join Now
              </Link>
            </>
          ) : (
            <>
              {/* Notification Bell */}
              {!isAdmin && (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleBellClick}
                    className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                    title="Notifications"
                  >
                    <Bell size={18} className="text-hv-muted" />
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold animate-pulse-glow"
                        style={{ background: 'linear-gradient(135deg, #FF6B6B, #8B5CF6)' }}
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </motion.span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {showNotif && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-2 w-80 card-static overflow-hidden z-50"
                        style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
                      >
                        <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                          <span className="font-bold text-hv-text text-sm">Notifications</span>
                          <Link
                            to="/notifications"
                            onClick={() => setShowNotif(false)}
                            className="text-xs font-semibold text-hv-violet hover:opacity-75 flex items-center gap-1"
                          >
                            View all <ChevronRight size={12} />
                          </Link>
                        </div>
                        {notifLoading ? (
                          <div className="p-4 space-y-3">
                            {[1,2,3].map(i => <div key={i} className="skeleton h-10 rounded-lg" />)}
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell size={28} className="text-gray-200 mx-auto mb-2" />
                            <p className="text-sm text-hv-muted">No notifications yet</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                            {notifications.map(n => (
                              <motion.div
                                key={n._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                                  !n.isRead ? 'bg-violet-50/50' : ''
                                }`}
                              >
                                <div className="flex items-start gap-2.5">
                                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {notifIcons[n.type] || <Bell size={12} className="text-gray-400" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-hv-text truncate">{n.title}</p>
                                    <p className="text-xs text-hv-muted mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                                    <p className="text-xs text-hv-subtle mt-1">{timeAgo(n.createdAt)}</p>
                                  </div>
                                  {!n.isRead && (
                                    <div className="w-2 h-2 rounded-full bg-hv-violet flex-shrink-0 mt-1.5" />
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Profile pill */}
              <Link
                to="/profile"
                className="flex items-center gap-2.5 pl-3 pr-4 py-1.5 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"
              >
                <img
                  src={
                    user.profileImage ||
                    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name || 'user')}`
                  }
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover"
                  style={{ border: '1.5px solid rgba(139,92,246,0.3)' }}
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-hv-text leading-tight max-w-24 truncate">{user.name}</p>
                  <p className="text-[10px] text-hv-muted capitalize">{user.accountType}</p>
                </div>
              </Link>

              {/* Logout */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 text-hv-subtle hover:text-red-400 transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
