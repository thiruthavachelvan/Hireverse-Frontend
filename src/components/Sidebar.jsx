import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Home, Briefcase, FileText, Calendar, Building2,
  User, Settings, Shield, ChevronLeft, ChevronRight,
  LayoutDashboard, Sparkles, LogOut
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

/* ─── Floating tooltip when sidebar is collapsed ────────────────── */
const NavTooltip = ({ label, show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, x: -6, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -6, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
      >
        <div className="px-3 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #FF6B6B)',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
          }}>
          {label}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Sidebar = () => {
  const { user, isAdmin, isCompany, isProfessional, logout } = useAuth();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) return null;

  const navItems = isAdmin ? navItemsAdmin : isCompany ? navItemsCompany : navItemsProfessional;

  const isActive = (to) => location.pathname === to ||
    (to !== '/' && location.pathname.startsWith(to));

  const sidebarWidth = expanded ? 230 : 72;

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: sidebarWidth }}
      transition={{ 
        x: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        opacity: { duration: 0.4 },
        width: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
      }}
      className="fixed left-3 top-1/2 -translate-y-1/2 z-40 flex flex-col overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(139, 92, 246, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        height: 'auto',
        maxHeight: 'calc(100vh - 40px)',
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => { setExpanded(false); setHoveredItem(null); }}
    >
      {/* ─── Logo ────────────────────────────────── */}
      <div className="flex items-center px-4 pt-5 pb-3">
        <Link to={isProfessional ? '/feed' : isCompany ? '/dashboard' : '/admin'}
          className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <HLogo size={36} />
          </motion.div>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="font-black text-base whitespace-nowrap gradient-text overflow-hidden"
              >
                HireVerse
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* ─── Gradient Divider ────────────────────── */}
      <div className="mx-4 mb-2">
        <div className="h-px w-full" style={{ 
          background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), rgba(255, 107, 107, 0.2), transparent)' 
        }} />
      </div>

      {/* ─── Navigation Items ────────────────────── */}
      <nav className="flex flex-col gap-0.5 px-2.5 flex-1 py-1">
        {navItems.map(({ icon: Icon, label, to }, i) => {
          const active = isActive(to);
          return (
            <Link key={to} to={to}>
              <motion.div
                initial={mounted ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: mounted ? 0 : i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.96 }}
                onMouseEnter={() => setHoveredItem(to)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 cursor-pointer group ${
                  active ? '' : 'hover:bg-gray-50/80'
                }`}
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(139, 92, 246, 0.12))',
                } : {}}
              >
                {/* Active indicator pill */}
                {active && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                    style={{ 
                      background: 'linear-gradient(180deg, #FF6B6B, #8B5CF6)',
                      boxShadow: '0 0 8px rgba(139, 92, 246, 0.4)'
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Icon container */}
                <motion.div
                  className={`flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0 transition-all duration-300 ${
                    active ? '' : 'group-hover:bg-violet-50/60'
                  }`}
                  style={active ? {
                    background: 'linear-gradient(135deg, #FF6B6B, #8B5CF6)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
                  } : {}}
                  whileHover={active ? {} : { scale: 1.08 }}
                >
                  <Icon
                    size={17}
                    strokeWidth={active ? 2.5 : 2}
                    className="transition-colors duration-200"
                    style={{ color: active ? '#FFFFFF' : '#6B7280' }}
                  />
                </motion.div>

                {/* Label */}
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="text-[13px] font-bold whitespace-nowrap overflow-hidden"
                      style={{ color: active ? '#8B5CF6' : '#4B5563' }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                {!expanded && <NavTooltip label={label} show={hoveredItem === to} />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* ─── Bottom section ──────────────────────── */}
      <div className="px-2.5 pb-4 pt-2 space-y-1">
        {/* Gradient Divider */}
        <div className="mx-1.5 mb-2">
          <div className="h-px w-full" style={{ 
            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.15), transparent)' 
          }} />
        </div>

        {/* Settings */}
        <Link to="/profile">
          <motion.div
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.96 }}
            onMouseEnter={() => setHoveredItem('settings')}
            onMouseLeave={() => setHoveredItem(null)}
            className="relative flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-gray-50/80 cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0 group-hover:bg-violet-50/60 transition-all">
              <Settings size={16} strokeWidth={2} className="text-hv-subtle group-hover:text-hv-violet transition-colors duration-200" />
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-[13px] font-semibold text-hv-subtle whitespace-nowrap"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
            {!expanded && <NavTooltip label="Settings" show={hoveredItem === 'settings'} />}
          </motion.div>
        </Link>

        {/* Toggle expand button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpanded(v => !v)}
          className="flex items-center justify-center w-full py-1.5 rounded-xl hover:bg-gray-50/80 cursor-pointer transition-all"
        >
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight size={14} className="text-hv-subtle" />
          </motion.div>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
