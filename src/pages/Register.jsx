import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  UserRound, Building2, Mail, Lock, Globe, MapPin,
  Briefcase, Users, FileText, Eye, EyeOff, ArrowRight
} from 'lucide-react';
import { HLogo } from '../components/AppLoader';

/* ─── Animated SVG Illustration ─────────────────────────── */
const NetworkIllustration = () => (
  <svg viewBox="0 0 480 380" fill="none" className="w-full max-w-md" style={{ filter: 'drop-shadow(0 4px 24px rgba(139,92,246,0.10))' }}>
    <defs>
      <linearGradient id="rGrad1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="100%" stopColor="#FF8FA3" />
      </linearGradient>
      <linearGradient id="rGrad2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#B388FF" />
      </linearGradient>
      <linearGradient id="rGrad3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFB86B" />
        <stop offset="100%" stopColor="#FF8FA3" />
      </linearGradient>
      <linearGradient id="rGrad4" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#B388FF" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <linearGradient id="rCardGrad" x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#F8F5FF" />
      </linearGradient>
      <filter id="rCardShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#8B5CF6" floodOpacity="0.12" />
      </filter>
      <filter id="rGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* ── Dashed Connection Lines ── */}
    <motion.line x1="120" y1="100" x2="240" y2="170" stroke="#B388FF" strokeWidth="1.5" strokeDasharray="6 4"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }}
      transition={{ duration: 1.5, delay: 0.5 }} />
    <motion.line x1="240" y1="170" x2="370" y2="110" stroke="#FF8FA3" strokeWidth="1.5" strokeDasharray="6 4"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }}
      transition={{ duration: 1.5, delay: 0.7 }} />
    <motion.line x1="240" y1="170" x2="160" y2="280" stroke="#FFB86B" strokeWidth="1.5" strokeDasharray="6 4"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }}
      transition={{ duration: 1.5, delay: 0.9 }} />
    <motion.line x1="240" y1="170" x2="350" y2="270" stroke="#B388FF" strokeWidth="1.5" strokeDasharray="6 4"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }}
      transition={{ duration: 1.5, delay: 1.1 }} />
    <motion.line x1="120" y1="100" x2="80" y2="220" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="4 4"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.3 }}
      transition={{ duration: 1.5, delay: 1.3 }} />
    <motion.line x1="370" y1="110" x2="420" y2="210" stroke="#FF6B6B" strokeWidth="1" strokeDasharray="4 4"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.3 }}
      transition={{ duration: 1.5, delay: 1.4 }} />

    {/* ── Profile Node 1 (top-left) ── */}
    <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 0.3, duration: 0.8 }}>
      <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <circle cx="120" cy="100" r="26" fill="url(#rGrad1)" opacity="0.15" />
        <circle cx="120" cy="100" r="18" fill="url(#rGrad1)" />
        {/* user icon */}
        <circle cx="120" cy="95" r="5" fill="white" opacity="0.9" />
        <ellipse cx="120" cy="108" rx="8" ry="5" fill="white" opacity="0.7" />
      </motion.g>
    </motion.g>

    {/* ── Profile Node 2 (center) — main hub ── */}
    <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 0.5, duration: 0.8 }}>
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <circle cx="240" cy="170" r="32" fill="url(#rGrad2)" opacity="0.15" />
        <circle cx="240" cy="170" r="22" fill="url(#rGrad2)" />
        <circle cx="240" cy="164" r="6" fill="white" opacity="0.9" />
        <ellipse cx="240" cy="179" rx="9" ry="5.5" fill="white" opacity="0.7" />
        {/* pulsing ring */}
        <motion.circle cx="240" cy="170" r="22" fill="none" stroke="#B388FF" strokeWidth="2"
          animate={{ r: [22, 38, 38], opacity: [0.6, 0, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} />
      </motion.g>
    </motion.g>

    {/* ── Profile Node 3 (top-right) ── */}
    <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 0.7, duration: 0.8 }}>
      <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
        <circle cx="370" cy="110" r="22" fill="url(#rGrad3)" opacity="0.15" />
        <circle cx="370" cy="110" r="15" fill="url(#rGrad3)" />
        <circle cx="370" cy="106" r="4.5" fill="white" opacity="0.9" />
        <ellipse cx="370" cy="117" rx="7" ry="4" fill="white" opacity="0.7" />
      </motion.g>
    </motion.g>

    {/* ── Profile Node 4 (bottom-left) ── */}
    <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 0.9, duration: 0.8 }}>
      <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
        <circle cx="160" cy="280" r="20" fill="url(#rGrad4)" opacity="0.15" />
        <circle cx="160" cy="280" r="14" fill="url(#rGrad4)" />
        <circle cx="160" cy="276" r="4" fill="white" opacity="0.9" />
        <ellipse cx="160" cy="287" rx="6" ry="3.5" fill="white" opacity="0.7" />
      </motion.g>
    </motion.g>

    {/* ── Small floating node (far left) ── */}
    <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 1.2, duration: 0.6 }}>
      <motion.g animate={{ y: [0, -10, 0], x: [0, 3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <circle cx="80" cy="220" r="10" fill="url(#rGrad1)" opacity="0.5" />
        <circle cx="80" cy="218" r="3" fill="white" opacity="0.8" />
      </motion.g>
    </motion.g>

    {/* ── Small floating node (far right) ── */}
    <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 1.3, duration: 0.6 }}>
      <motion.g animate={{ y: [0, -7, 0], x: [0, -3, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}>
        <circle cx="420" cy="210" r="10" fill="url(#rGrad3)" opacity="0.5" />
        <circle cx="420" cy="208" r="3" fill="white" opacity="0.8" />
      </motion.g>
    </motion.g>

    {/* ── Company Card 1 (floating right) ── */}
    <motion.g initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.0, duration: 0.8, ease: 'easeOut' }}>
      <motion.g animate={{ y: [0, -6, 0], rotate: [0, 1, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <g filter="url(#rCardShadow)">
          <rect x="332" y="240" width="100" height="60" rx="12" fill="url(#rCardGrad)" stroke="#E9E5F5" strokeWidth="1" />
          {/* building icon */}
          <rect x="349" y="254" width="16" height="14" rx="2" fill="url(#rGrad2)" opacity="0.7" />
          <rect x="352" y="257" width="3" height="3" rx="0.5" fill="white" opacity="0.8" />
          <rect x="357" y="257" width="3" height="3" rx="0.5" fill="white" opacity="0.8" />
          <rect x="352" y="262" width="3" height="3" rx="0.5" fill="white" opacity="0.8" />
          <rect x="357" y="262" width="3" height="3" rx="0.5" fill="white" opacity="0.8" />
          {/* text lines */}
          <rect x="372" y="256" width="46" height="4" rx="2" fill="#8B5CF6" opacity="0.25" />
          <rect x="372" y="264" width="32" height="3" rx="1.5" fill="#B388FF" opacity="0.18" />
          {/* badge */}
          <rect x="348" y="276" width="36" height="12" rx="6" fill="#8B5CF6" opacity="0.12" />
          <rect x="354" y="280" width="24" height="4" rx="2" fill="#8B5CF6" opacity="0.35" />
        </g>
      </motion.g>
    </motion.g>

    {/* ── Company Card 2 (floating far-right bottom) ── */}
    <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.3, duration: 0.8, ease: 'easeOut' }}>
      <motion.g animate={{ y: [0, -4, 0], rotate: [0, -0.5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
        <g filter="url(#rCardShadow)">
          <rect x="380" y="310" width="80" height="45" rx="10" fill="url(#rCardGrad)" stroke="#E9E5F5" strokeWidth="1" />
          <circle cx="404" cy="326" r="8" fill="url(#rGrad3)" opacity="0.6" />
          <text x="404" y="329" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">★</text>
          <rect x="418" y="322" width="30" height="3.5" rx="1.75" fill="#FFB86B" opacity="0.3" />
          <rect x="418" y="328" width="20" height="3" rx="1.5" fill="#FFB86B" opacity="0.2" />
          <rect x="394" y="342" width="26" height="8" rx="4" fill="#FFB86B" opacity="0.12" />
          <rect x="398" y="344.5" width="18" height="3" rx="1.5" fill="#FFB86B" opacity="0.3" />
        </g>
      </motion.g>
    </motion.g>

    {/* ── Floating Profile Card (Alex Chen) ── */}
    <motion.g initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.9, type: 'spring' }}>
      <motion.g animate={{ y: [0, -8, 0], rotate: [0, -1, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <g filter="url(#rCardShadow)">
          {/* Card body */}
          <rect x="28" y="270" width="120" height="90" rx="14" fill="url(#rCardGrad)" stroke="#E9E5F5" strokeWidth="1" />
          {/* Avatar circle */}
          <circle cx="60" cy="296" r="14" fill="url(#rGrad1)" />
          <circle cx="60" cy="292" r="4.5" fill="white" opacity="0.9" />
          <ellipse cx="60" cy="301" rx="6.5" ry="4" fill="white" opacity="0.7" />
          {/* Name */}
          <text x="80" y="293" fontSize="9" fontWeight="700" fill="#2D2B55">Alex Chen</text>
          {/* Role */}
          <text x="80" y="304" fontSize="6.5" fill="#8B8DA3">Full-Stack Developer</text>
          {/* "Open to Work" badge */}
          <rect x="42" y="320" width="92" height="18" rx="9" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="0.8" />
          <circle cx="56" cy="329" r="3" fill="#34D399" />
          <motion.circle cx="56" cy="329" r="3" fill="#34D399"
            animate={{ r: [3, 5, 3], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
          <text x="64" y="332" fontSize="7" fontWeight="600" fill="#059669">Open to Work</text>
        </g>
      </motion.g>
    </motion.g>

    {/* ── Floating small icons (users, buildings, stars) ── */}
    {/* Star icon top */}
    <motion.g animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
      <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.6, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}>
        <text x="300" y="58" fontSize="16" fill="#FFB86B">✦</text>
      </motion.g>
    </motion.g>

    {/* Star icon bottom-left */}
    <motion.g animate={{ y: [0, -6, 0], rotate: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
      <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.5, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}>
        <text x="42" y="180" fontSize="12" fill="#B388FF">✦</text>
      </motion.g>
    </motion.g>

    {/* Star icon right */}
    <motion.g animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
      <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.4, scale: 1 }}
        transition={{ delay: 2.0, duration: 0.5 }}>
        <text x="440" y="160" fontSize="14" fill="#FF8FA3">✦</text>
      </motion.g>
    </motion.g>

    {/* Tiny dot decorations */}
    <motion.circle cx="190" cy="50" r="3" fill="#FF6B6B" opacity="0.3"
      animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
    <motion.circle cx="400" cy="170" r="2.5" fill="#B388FF" opacity="0.35"
      animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
    <motion.circle cx="280" cy="330" r="2" fill="#FFB86B" opacity="0.3"
      animate={{ y: [0, -4, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
    <motion.circle cx="50" cy="140" r="2" fill="#FF8FA3" opacity="0.35"
      animate={{ y: [0, -7, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }} />
    <motion.circle cx="460" cy="280" r="2.5" fill="#8B5CF6" opacity="0.25"
      animate={{ y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }} />
  </svg>
);

/* ─── Animated Gradient Line ────────────────────────────── */
const GradientLine = () => (
  <div className="relative h-1 w-24 rounded-full overflow-hidden mt-3">
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{
        background: 'linear-gradient(90deg, #FF6B6B, #8B5CF6, #FFB86B, #FF8FA3, #B388FF, #FF6B6B)',
        backgroundSize: '200% 100%',
      }}
      animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

/* ─── Stagger wrapper ───────────────────────────────────── */
const StaggerItem = ({ children, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.15 + index * 0.08, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

/* ─── Register Component ────────────────────────────────── */
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    accountType: 'professional',
    employmentStatus: 'unemployed',
    website: '',
    industry: '',
    size: '11-25',
    location: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectAccountType = (type) => {
    setFormData({ ...formData, accountType: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { name, email, password, accountType, employmentStatus, website, industry, size, location, description } = formData;
    if (!name || !email || !password || !accountType) {
      setError('Please fill in all basic fields.');
      setLoading(false);
      return;
    }

    if (accountType === 'company' && size === 'Above 500') {
      setError('HireVerse currently supports startup companies only.');
      setLoading(false);
      return;
    }

    let res;
    if (accountType === 'company') {
      if (!industry || !location) {
        setError('Please fill in the Industry and Location for your company.');
        setLoading(false);
        return;
      }
      const companyDetails = { website, industry, size, location, description };
      res = await register(name, email, password, accountType, companyDetails);
    } else {
      res = await register(name, email, password, accountType, null, employmentStatus);
    }

    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  const isCompany = formData.accountType === 'company';

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #F8F8FC 0%, #F0EEFF 60%, #FFF0F5 100%)' }}>
      
      {/* ─── Left: Branding panel (hidden on mobile) ──── */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden">
        <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
        <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '0' }} />

        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <HLogo size={40} />
          <span className="font-black text-xl gradient-text">HireVerse</span>
        </Link>

        <div className="relative z-10 flex flex-col items-start">
          <h2 className="font-black text-4xl text-hv-text leading-tight mb-4">
            Build the Next<br />
            Unicorn.<br />
            <span className="gradient-text">Where Startups Meet Builders.</span>
          </h2>
          <p className="text-hv-muted text-lg leading-relaxed max-w-sm mb-8">
            Discover ambitious startups. Show your skills. Build products that matter.
          </p>

          {/* Animated SVG Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full"
          >
            <NetworkIllustration />
          </motion.div>
        </div>

        <p className="text-xs text-hv-subtle relative z-10">© 2026 HireVerse Inc.</p>
      </div>

      {/* ─── Right: Registration form ───────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg py-8"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-6 lg:hidden">
            <HLogo size={36} />
            <span className="font-black text-lg gradient-text">HireVerse</span>
          </div>

          <StaggerItem index={0}>
            <div className="mb-6">
              <h1 className="text-3xl font-black text-hv-text mb-1">Create your account 🚀</h1>
              <GradientLine />
              <p className="text-hv-muted mt-3">Select your account type to get started</p>
            </div>
          </StaggerItem>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Account Type Selector */}
            <StaggerItem index={1}>
              <div>
                <label className="block text-sm font-semibold text-hv-text mb-2">I want to join as a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => selectAccountType('professional')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                      formData.accountType === 'professional'
                        ? 'border-hv-violet bg-gradient-to-br from-violet-50 to-pink-50 text-hv-violet shadow-sm'
                        : 'border-gray-200 bg-white text-hv-muted hover:border-gray-300'
                    }`}
                  >
                    <UserRound size={24} className="mb-2" />
                    <span className="text-sm font-bold">Professional</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectAccountType('company')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                      formData.accountType === 'company'
                        ? 'border-hv-violet bg-gradient-to-br from-violet-50 to-pink-50 text-hv-violet shadow-sm'
                        : 'border-gray-200 bg-white text-hv-muted hover:border-gray-300'
                    }`}
                  >
                    <Building2 size={24} className="mb-2" />
                    <span className="text-sm font-bold">Company</span>
                  </button>
                </div>
              </div>
            </StaggerItem>

            {/* Basic Info Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StaggerItem index={2}>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-hv-text mb-1.5">
                    {isCompany ? 'Company Name' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <UserRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle" />
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field pl-11"
                      placeholder={isCompany ? 'Acme Corp' : 'John Doe'}
                    />
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem index={3}>
                <div>
                  <label className="block text-sm font-semibold text-hv-text mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-11"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem index={4}>
                <div>
                  <label className="block text-sm font-semibold text-hv-text mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle" />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pl-11 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-hv-subtle hover:text-hv-muted transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </StaggerItem>
            </div>

            {/* Dynamic parts based on role selection */}
            <AnimatePresence mode="wait">
              {!isCompany ? (
                <motion.div
                  key="professional-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="block text-sm font-semibold text-hv-text mb-1.5">Employment Status</label>
                    <select
                      name="employmentStatus"
                      value={formData.employmentStatus}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="unemployed">Unemployed / Open to Work</option>
                      <option value="employed">Employed</option>
                      <option value="recently_left">Recently Left last job</option>
                    </select>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="company-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-100 pt-4 space-y-4 overflow-hidden"
                >
                  <h3 className="text-sm font-bold gradient-text">Company Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-hv-muted mb-1">Website URL</label>
                      <div className="relative">
                        <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle" />
                        <input
                          name="website"
                          type="url"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://example.com"
                          className="input-field pl-11 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-hv-muted mb-1">Industry *</label>
                      <div className="relative">
                        <Briefcase size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle" />
                        <input
                          name="industry"
                          type="text"
                          required={isCompany}
                          value={formData.industry}
                          onChange={handleChange}
                          placeholder="Software, E-Commerce"
                          className="input-field pl-11 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-hv-muted mb-1">Company Size</label>
                      <div className="relative">
                        <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle" />
                        <select
                          name="size"
                          value={formData.size}
                          onChange={handleChange}
                          className="input-field pl-11 text-sm"
                        >
                          {['1-10', '11-25', '26-50', '51-100', '101-250', '251-500', 'Above 500'].map(val => (
                            <option key={val} value={val}>
                              {val === 'Above 500' ? 'Above 500 (Not supported)' : `${val} employees`}
                            </option>
                          ))}
                        </select>
                      </div>
                      {formData.size === 'Above 500' && (
                        <p className="text-red-500 font-semibold text-[11px] mt-1.5 animate-pulse">
                          HireVerse currently supports startup companies only.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-hv-muted mb-1">Location *</label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle" />
                        <input
                          name="location"
                          type="text"
                          required={isCompany}
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. Remote / Bangalore"
                          className="input-field pl-11 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-hv-muted mb-1">Company Description</label>
                    <div className="relative">
                      <FileText size={14} className="absolute left-3.5 top-3 text-hv-subtle" />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Tell candidates about your company's mission..."
                        className="input-field pl-11 min-h-[80px] text-sm resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <StaggerItem index={5}>
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full py-3.5 text-base mt-2"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white"
                  />
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
              </motion.button>
            </StaggerItem>
          </form>

          <StaggerItem index={6}>
            <p className="mt-6 text-center text-sm text-hv-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-hv-violet hover:opacity-80 transition-opacity">
                Sign In
              </Link>
            </p>
          </StaggerItem>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
