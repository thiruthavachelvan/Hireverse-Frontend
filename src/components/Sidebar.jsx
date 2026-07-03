import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Home, Briefcase, FileText, Calendar, Building2,
  User, Settings, Shield, ChevronRight, ChevronLeft,
  LayoutDashboard
} from 'lucide-react';
import { HLogo } from './AppLoader';

const navItemsProfessional = [
  { icon: Home,         label: 'Feed',         to: '/feed' },
  { icon: Briefcase,    label: 'Jobs',          to: '/jobs' },
  { icon: FileText,     label: 'Applications',  to: '/my-applications' },
  { icon: Calendar,     label: 'Interviews',    to: '/interviews' },
  { icon: Building2,    label: 'Companies',     to: '/companies' },
  { icon: User,         label: 'Profile',       to: '/profile' },
];

const navItemsCompany = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: User,            label: 'Profile',   to: '/profile' },
];

const navItemsAdmin = [
  { icon: Shield, label: 'Admin', to: '/admin' },
  { icon: User,   label: 'Profile', to: '/profile' },
];

const Sidebar = () => {
  const { user, isAdmin, isCompany, isProfessional } = useAuth();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  if (!user) return null;

  const navItems = isAdmin ? navItemsAdmin : isCompany ? navItemsCompany : navItemsProfessional;

  const isActive = (to) => location.pathname === to ||
    (to !== '/' && location.pathname.startsWith(to));

  return (
    <motion.aside
      animate={{ width: expanded ? 220 : 72 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed left-3 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center py-4 overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        height: 'auto',
        maxHeight: 'calc(100vh - 40px)',
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="flex items-center justify-center w-full px-3 mb-4">
        <Link to={isProfessional ? '/feed' : isCompany ? '/dashboard' : '/admin'}>
          <HLogo size={40} />
        </Link>
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="ml-2.5 font-black text-base whitespace-nowrap gradient-text"
            >
              HireVerse
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-gray-100 mb-3" />

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 w-full px-2 flex-1">
        {navItems.map(({ icon: Icon, label, to }) => {
          const active = isActive(to);
          return (
            <Link key={to} to={to}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer relative ${
                  active
                    ? 'shadow-sm'
                    : 'hover:bg-gray-50 text-hv-muted'
                }`}
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(255,107,107,0.12), rgba(139,92,246,0.12))',
                  color: '#8B5CF6',
                } : {}}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #FF6B6B, #8B5CF6)' }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <Icon
                  size={18}
                  className="flex-shrink-0"
                  style={{ color: active ? '#8B5CF6' : undefined }}
                />
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-semibold whitespace-nowrap"
                      style={{ color: active ? '#8B5CF6' : '#6B7280' }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="w-full px-2 mt-2 pt-2 border-t border-gray-100">
        <Link to="/profile">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer"
          >
            <Settings size={16} className="text-hv-subtle flex-shrink-0" />
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-medium text-hv-subtle whitespace-nowrap"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
