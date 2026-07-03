import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  UserRound, Building2, Mail, Lock, Globe, MapPin,
  Briefcase, Users, FileText, Eye, EyeOff, ArrowRight
} from 'lucide-react';
import { HLogo } from '../components/AppLoader';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    accountType: 'professional',
    employmentStatus: 'unemployed',
    website: '',
    industry: '',
    size: '11-50',
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

        <div className="relative z-10">
          <h2 className="font-black text-4xl text-hv-text leading-tight mb-4">
            Build your profile,<br />
            prove your skills,<br />
            <span className="gradient-text">belong anywhere.</span>
          </h2>
          <p className="text-hv-muted text-lg leading-relaxed max-w-sm">
            Join the community of modern professionals and forward-thinking companies.
          </p>
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

          <div className="mb-6">
            <h1 className="text-3xl font-black text-hv-text mb-2">Create your account 🚀</h1>
            <p className="text-hv-muted">Select your account type to get started</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Account Type Selector */}
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

            {/* Basic Info Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="input-field pl-10"
                    placeholder={isCompany ? 'Acme Corp' : 'John Doe'}
                  />
                </div>
              </div>

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
                    className="input-field pl-10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

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
                          className="input-field pl-10 text-sm"
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
                          className="input-field pl-10 text-sm"
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
                          className="input-field pl-10 text-sm"
                        >
                          {['1-10', '11-50', '51-200', '201-500', '500-1000', '1000-5000', '5000+'].map(val => (
                            <option key={val} value={val}>{val} employees</option>
                          ))}
                        </select>
                      </div>
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
                          className="input-field pl-10 text-sm"
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
                        className="input-field pl-10 min-h-[80px] text-sm resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
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
          </form>

          <p className="mt-6 text-center text-sm text-hv-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-hv-violet hover:opacity-80 transition-opacity">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
