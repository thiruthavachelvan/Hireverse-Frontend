import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FaBriefcase, FaUser, FaHome, FaSignOutAlt, FaClipboardList,
  FaBell, FaShieldAlt, FaCheckCircle, FaClock, FaCalendarAlt,
} from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';

const VerificationBadge = ({ status }) => {
  if (status === 'verified') return (
    <span className="flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
      <FaCheckCircle className="w-2.5 h-2.5" /> Verified
    </span>
  );
  if (status === 'pending') return (
    <span className="flex items-center gap-1 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
      <FaClock className="w-2.5 h-2.5" /> Pending
    </span>
  );
  return null;
};

const Navbar = () => {
  const { user, logout, unreadCount, refreshUnreadCount, isAdmin, isCompany, isProfessional } = useAuth();
  const navigate = useNavigate();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
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
    if (!showNotifDropdown) {
      await fetchNotifications();
      // Mark all as read
      try {
        await api.put('/notifications/read-all');
        refreshUnreadCount();
      } catch { /* ignore */ }
    }
    setShowNotifDropdown(v => !v);
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

  return (
    <nav className="sticky top-0 z-50 glassmorphism shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-wider text-white">
          <span className="text-brand-purple">Hire</span>
          <span className="gradient-text">Verse</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-5">
          {!user ? (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-brand-purple hover:bg-opacity-90 text-white font-medium px-5 py-2 rounded-lg shadow-lg transition-all"
              >
                Join Now
              </Link>
            </>
          ) : (
            <>
              {/* Admin links */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors"
                >
                  <MdAdminPanelSettings className="text-violet-400 text-lg" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}

              {/* Professional links */}
              {isProfessional && (
                <>
                  <Link to="/feed" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors">
                    <FaHome className="text-brand-purple" />
                    <span className="hidden sm:inline">Feed</span>
                  </Link>
                  <Link to="/companies" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors">
                    <FaBuilding className="text-brand-purple" />
                    <span className="hidden sm:inline">Companies</span>
                  </Link>
                  <Link to="/jobs" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors">
                    <FaBriefcase className="text-brand-purple" />
                    <span className="hidden sm:inline">Jobs</span>
                  </Link>
                  <Link to="/my-applications" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors">
                    <FaClipboardList className="text-brand-purple" />
                    <span className="hidden sm:inline">Applications</span>
                  </Link>
                  <Link to="/interviews" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors">
                    <FaCalendarAlt className="text-brand-purple" />
                    <span className="hidden sm:inline">Interviews</span>
                  </Link>
                  <Link to="/profile" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors">
                    <FaUser className="text-brand-purple" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>
                </>
              )}

              {/* Company links */}
              {isCompany && (
                <>
                  <Link to="/dashboard" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors">
                    <FaBriefcase className="text-brand-purple" />
                    <span className="hidden sm:inline">Manage Jobs</span>
                  </Link>
                  <Link to="/profile" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors">
                    <FaUser className="text-brand-purple" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>
                </>
              )}

              {/* Notification Bell */}
              {!isAdmin && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={handleBellClick}
                    className="relative text-gray-300 hover:text-white transition-colors p-1"
                    title="Notifications"
                  >
                    <FaBell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                        <span className="font-semibold text-white text-sm">Notifications</span>
                        <Link
                          to="/notifications"
                          className="text-xs text-violet-400 hover:text-violet-300"
                          onClick={() => setShowNotifDropdown(false)}
                        >
                          View all
                        </Link>
                      </div>
                      {notifLoading ? (
                        <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
                      ) : notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">No notifications yet</div>
                      ) : (
                        <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                          {notifications.map(n => (
                            <div key={n._id} className={`px-4 py-3 hover:bg-white/5 transition-colors ${!n.isRead ? 'bg-violet-500/5' : ''}`}>
                              <p className="text-sm font-medium text-white">{n.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{timeAgo(n.createdAt)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* User Avatar & Logout */}
              <div className="flex items-center space-x-3 ml-1 pl-4 border-l border-brand-medium">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-brand-purple bg-brand-medium"
                  />
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-sm font-semibold text-white leading-tight">{user.name}</span>
                    {isCompany ? (
                      <VerificationBadge status={user.verificationStatus} />
                    ) : (
                      <span className="text-xs text-gray-400 capitalize">{user.accountType}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 transition-colors p-1"
                  title="Logout"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
