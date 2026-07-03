import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { HLogo } from '../components/AppLoader';

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
    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      setLoading(false);
      return;
    }
    const res = await login(formData.email, formData.password);
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

        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <HLogo size={40} />
          <span className="font-black text-xl gradient-text">HireVerse</span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-black text-4xl text-hv-text leading-tight mb-4">
            Your career starts<br />
            <span className="gradient-text">right here.</span>
          </h2>
          <p className="text-hv-muted text-lg leading-relaxed max-w-sm">
            One platform for finding jobs, building connections, and proving your talent to the world.
          </p>

          <div className="mt-10 space-y-4">
            {[
              'Proctored assessments inside HireVerse',
              'Real-time application tracking',
              'Follow companies & professionals',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-medium text-hv-muted">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #FF6B6B, #8B5CF6)' }}>
                  <svg viewBox="0 0 10 8" fill="none" className="w-3 h-3">
                    <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-hv-subtle relative z-10">© 2026 HireVerse Inc.</p>
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
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <HLogo size={36} />
            <span className="font-black text-lg gradient-text">HireVerse</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-hv-text mb-2">Welcome back 👋</h1>
            <p className="text-hv-muted">Sign in to continue your career journey</p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-hv-text mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-hv-text mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-field pl-10 pr-10"
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

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
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
          </form>

          <p className="mt-6 text-center text-sm text-hv-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-hv-violet hover:opacity-80 transition-opacity">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
