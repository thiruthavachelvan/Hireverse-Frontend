import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { HLogo } from '../components/AppLoader';

/* ────────────────────────── animation variants ────────────────────────── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ────────────────── reusable animated input wrapper ───────────────────── */
const FormField = ({ label, children }) => {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div variants={fadeUp} onFocusCapture={() => setFocused(true)} onBlurCapture={() => setFocused(false)}>
      <motion.label
        className="block text-sm font-semibold mb-1.5 transition-colors duration-200"
        animate={{ color: focused ? '#8B5CF6' : '#1F2937' }}
      >
        {label}
      </motion.label>
      {children}
    </motion.div>
  );
};

/* ──────────────────── animated SVG illustration ───────────────────────── */
const PanelIllustration = () => {
  /* gradient palette */
  const gradients = [
    { id: 'gA', from: '#FF6B6B', to: '#FF8FA3' },
    { id: 'gB', from: '#8B5CF6', to: '#B388FF' },
    { id: 'gC', from: '#FFB86B', to: '#FF8FA3' },
    { id: 'gD', from: '#B388FF', to: '#FF6B6B' },
  ];

  return (
    <div className="relative w-full h-[340px] mt-6">
      {/* ── SVG canvas ─────────────────────────── */}
      <svg viewBox="0 0 500 340" fill="none" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {gradients.map((g) => (
            <linearGradient key={g.id} id={g.id} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={g.from} />
              <stop offset="100%" stopColor={g.to} />
            </linearGradient>
          ))}
        </defs>

        {/* dashed connection lines */}
        <motion.line x1="120" y1="90" x2="320" y2="170" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="6 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: 'easeOut' }} />
        <motion.line x1="380" y1="80" x2="320" y2="170" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="6 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.3, ease: 'easeOut' }} />
        <motion.line x1="100" y1="260" x2="250" y2="200" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="6 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.6, ease: 'easeOut' }} />
        <motion.line x1="420" y1="270" x2="320" y2="170" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="6 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }} />

        {/* ── floating circle ── */}
        <motion.circle cx="120" cy="90" r="28" fill="url(#gA)" opacity="0.7"
          animate={{ y: [0, -12, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />

        {/* ── floating rounded rect ── */}
        <motion.rect x="365" y="55" width="50" height="50" rx="12" fill="url(#gB)" opacity="0.65"
          animate={{ y: [0, 10, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />

        {/* ── hexagon ── */}
        <motion.polygon points="100,260 118,248 136,260 136,280 118,292 100,280" fill="url(#gC)" opacity="0.6"
          animate={{ y: [0, -8, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />

        {/* ── small diamond ── */}
        <motion.rect x="430" y="260" width="22" height="22" rx="4" fill="url(#gD)" opacity="0.55"
          animate={{ y: [0, 8, 0], rotate: [45, 52, 45] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} />

        {/* ── small circle accent ── */}
        <motion.circle cx="260" cy="60" r="10" fill="#FFB86B" opacity="0.5"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />

        {/* ── tiny dots ── */}
        <motion.circle cx="200" cy="290" r="5" fill="#8B5CF6" opacity="0.35"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.circle cx="460" cy="160" r="6" fill="#FF6B6B" opacity="0.3"
          animate={{ scale: [1, 1.3, 1], y: [0, -4, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} />

        {/* ── briefcase icon (floating) ── */}
        <motion.g
          animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '310px', originY: '80px' }}
        >
          <circle cx="310" cy="80" r="20" fill="white" opacity="0.9" />
          <rect x="300" y="76" width="20" height="14" rx="2" stroke="#8B5CF6" strokeWidth="1.6" fill="none" />
          <path d="M306 76v-3a2 2 0 012-2h4a2 2 0 012 2v3" stroke="#8B5CF6" strokeWidth="1.4" fill="none" />
        </motion.g>

        {/* ── code brackets icon (floating) ── */}
        <motion.g
          animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ originX: '70px', originY: '175px' }}
        >
          <circle cx="70" cy="175" r="18" fill="white" opacity="0.9" />
          <path d="M66 168l-5 7 5 7" stroke="#FF6B6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M74 168l5 7-5 7" stroke="#FF6B6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </motion.g>

        {/* ── shield icon (floating) ── */}
        <motion.g
          animate={{ y: [0, -7, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{ originX: '450px', originY: '120px' }}
        >
          <circle cx="450" cy="120" r="16" fill="white" opacity="0.9" />
          <path d="M450 109c-4 2-8 3-8 3v8c0 5 4 8 8 10 4-2 8-5 8-10v-8s-4-1-8-3z" stroke="#B388FF" strokeWidth="1.5" fill="none" />
          <path d="M446 121l3 3 5-5" stroke="#B388FF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </motion.g>

        {/* ── large central circle ring ── */}
        <motion.circle cx="290" cy="180" r="55" stroke="url(#gB)" strokeWidth="1.5" fill="none" opacity="0.25"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.circle cx="290" cy="180" r="75" stroke="url(#gA)" strokeWidth="1" fill="none" opacity="0.12" strokeDasharray="4 6"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} />
      </svg>

      {/* ── floating job card mockup ────────────────── */}
      <motion.div
        className="absolute rounded-2xl p-4 shadow-lg border border-white/60"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 220,
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(12px)',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{ opacity: { duration: 0.8, delay: 0.8 }, scale: { duration: 0.8, delay: 0.8 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 } }}
      >
        {/* company avatar */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #B388FF)' }}>T</div>
          <div>
            <p className="text-[11px] font-bold text-hv-text leading-none">TechCorp</p>
            <p className="text-[9px] text-hv-subtle mt-0.5">Bengaluru, India</p>
          </div>
        </div>
        <p className="text-[13px] font-extrabold text-hv-text leading-snug">Senior Developer</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(179,136,255,0.12))', color: '#8B5CF6' }}>
            ₹12-18 LPA
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,107,107,0.10)', color: '#FF6B6B' }}>
            Remote
          </span>
        </div>
        {/* fake progress bar */}
        <div className="mt-3 h-1 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #8B5CF6, #FF6B6B)' }}
            initial={{ width: 0 }}
            animate={{ width: '65%' }}
            transition={{ duration: 1.4, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="text-[9px] text-hv-subtle mt-1.5">120 applicants</p>
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════ */
/*                              LOGIN PAGE                                  */
/* ══════════════════════════════════════════════════════════════════════════ */
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError('Please enter your email and password.');
      setLoading(false);
      return;
    }

    const res = await login(email, password);
    setLoading(false);
    if (res.success) navigate('/dashboard');
    else setError(res.message);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #F8F8FC 0%, #F0EEFF 60%, #FFF0F5 100%)' }}>
      {/* ─── Left: Branding panel (hidden on mobile) ──── */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden">
        <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
        <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '0' }} />

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="flex items-center gap-2.5 relative z-10">
            <HLogo size={40} />
            <span className="font-black text-xl gradient-text">HireVerse</span>
          </Link>
        </motion.div>

        <div className="relative z-10">
          <motion.h2
            className="font-black text-4xl text-hv-text leading-tight mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Your career starts<br />
            <span className="gradient-text">right here.</span>
          </motion.h2>
          <motion.p
            className="text-hv-muted text-lg leading-relaxed max-w-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            One platform for finding jobs, building connections, and proving your talent to the world.
          </motion.p>

          {/* checkmark features */}
          <motion.div
            className="mt-8 space-y-3.5"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.45 } } }}
          >
            {[
              'Proctored assessments inside HireVerse',
              'Real-time application tracking',
              'Follow companies & professionals',
            ].map((item) => (
              <motion.div
                key={item}
                variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                className="flex items-center gap-3 text-sm font-medium text-hv-muted"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #FF6B6B, #8B5CF6)' }}>
                  <svg viewBox="0 0 10 8" fill="none" className="w-3 h-3">
                    <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {item}
              </motion.div>
            ))}
          </motion.div>

          {/* ── animated illustration scene ── */}
          <PanelIllustration />
        </div>

        <motion.p
          className="text-xs text-hv-subtle relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          © 2026 HireVerse Inc.
        </motion.p>
      </div>

      {/* ─── Right: Login form ───────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <motion.div
            className="flex items-center gap-2.5 mb-8 lg:hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <HLogo size={36} />
            <span className="font-black text-lg gradient-text">HireVerse</span>
          </motion.div>

          <div className="mb-8">
            <motion.h1
              className="text-3xl font-black text-hv-text mb-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              Welcome back 👋
            </motion.h1>

            {/* animated gradient underline */}
            <motion.div
              className="h-[3px] rounded-full mb-3"
              style={{ background: 'linear-gradient(90deg, #FF6B6B, #8B5CF6, #B388FF)' }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 80, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.p
              className="text-hv-muted"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              Sign in to continue your career journey
            </motion.p>
          </div>

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

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Email */}
            <FormField label="Email address">
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field pl-11"
                  placeholder="you@example.com"
                />
              </div>
            </FormField>

            {/* Password */}
            <FormField label="Password">
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
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
            </FormField>

            {/* Submit */}
            <motion.div variants={fadeUp}>
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.01, boxShadow: '0 8px 30px rgba(139, 92, 246, 0.25)' }}
                className="btn-primary w-full py-3.5 mt-2 text-base"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white"
                  />
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.p
            className="mt-6 text-center text-sm text-hv-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-hv-violet hover:opacity-80 transition-opacity">
              Create one free
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
