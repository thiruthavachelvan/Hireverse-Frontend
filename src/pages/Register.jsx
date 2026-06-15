import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserAlt, FaBuilding, FaEnvelope, FaLock, FaUserPlus, FaGlobe, FaBriefcase, FaUsers, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa';

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
    <div className="min-h-[90vh] flex items-center justify-center bg-brand-dark px-4 py-12">
      <div className="w-full max-w-lg glassmorphism p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Join <span className="gradient-text">HireVerse</span></h2>
          <p className="mt-2 text-sm text-gray-400">
            Create an account to start networking or recruiting
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Account Type Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Account Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => selectAccountType('professional')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  formData.accountType === 'professional'
                    ? 'border-brand-purple bg-brand-purple/10 text-white'
                    : 'border-brand-medium bg-brand-medium/30 text-gray-400 hover:border-gray-500'
                }`}
              >
                <FaUserAlt className="mb-1 text-md" />
                <span className="text-sm font-semibold">Professional</span>
              </button>
              <button
                type="button"
                onClick={() => selectAccountType('company')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  formData.accountType === 'company'
                    ? 'border-brand-purple bg-brand-purple/10 text-white'
                    : 'border-brand-medium bg-brand-medium/30 text-gray-400 hover:border-gray-500'
                }`}
              >
                <FaBuilding className="mb-1 text-md" />
                <span className="text-sm font-semibold">Company</span>
              </button>
            </div>
          </div>

          {/* Basic Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name / Company Name */}
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-xs font-semibold text-gray-300 mb-1">
                {isCompany ? 'Company Name *' : 'Full Name *'}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FaUserPlus />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 bg-brand-medium/50 border border-brand-medium rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-purple text-sm"
                  placeholder={isCompany ? 'Acme Corp' : 'John Doe'}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-300 mb-1">
                Email Address *
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FaEnvelope />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 bg-brand-medium/50 border border-brand-medium rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-purple text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-300 mb-1">
                Password *
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FaLock />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 bg-brand-medium/50 border border-brand-medium rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-purple text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Conditional Professional Fields */}
          {!isCompany && (
            <div>
              <label htmlFor="employmentStatus" className="block text-xs font-semibold text-gray-300 mb-1">
                Current Employment Status
              </label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                className="block w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple"
              >
                <option value="unemployed">Unemployed / Open to Work</option>
                <option value="employed">Employed</option>
                <option value="recently_left">Recently Left last job</option>
              </select>
            </div>
          )}

          {/* Conditional Company Registration Form */}
          {isCompany && (
            <div className="border-t border-brand-medium/50 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-brand-accent">Company Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-xs font-semibold text-gray-400 mb-1">Website URL</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <FaGlobe />
                    </div>
                    <input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="block w-full pl-10 pr-3 py-2 bg-brand-medium/50 border border-brand-medium rounded-xl text-white placeholder-gray-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <label htmlFor="industry" className="block text-xs font-semibold text-gray-400 mb-1">Industry *</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <FaBriefcase />
                    </div>
                    <input
                      id="industry"
                      name="industry"
                      type="text"
                      required={isCompany}
                      value={formData.industry}
                      onChange={handleChange}
                      placeholder="e.g. Software, E-Commerce"
                      className="block w-full pl-10 pr-3 py-2 bg-brand-medium/50 border border-brand-medium rounded-xl text-white placeholder-gray-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Company Size */}
                <div>
                  <label htmlFor="size" className="block text-xs font-semibold text-gray-400 mb-1">Company Size</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <FaUsers />
                    </div>
                    <select
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 bg-brand-medium/50 border border-brand-medium rounded-xl text-white focus:outline-none text-xs"
                    >
                      {['1-10', '11-50', '51-200', '201-500', '500-1000', '1000-5000', '5000+'].map(val => (
                        <option key={val} value={val}>{val} employees</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-xs font-semibold text-gray-400 mb-1">Location *</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <FaMapMarkerAlt />
                    </div>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required={isCompany}
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Remote / Bangalore"
                      className="block w-full pl-10 pr-3 py-2 bg-brand-medium/50 border border-brand-medium rounded-xl text-white placeholder-gray-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-gray-400 mb-1">Short Description</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-2 pointer-events-none text-gray-500">
                    <FaFileAlt />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell candidates about your company's mission..."
                    className="block w-full pl-10 pr-3 py-2 bg-brand-medium/50 border border-brand-medium rounded-xl text-white placeholder-gray-500 focus:outline-none text-xs min-h-[70px] resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-brand-purple hover:bg-opacity-95 shadow-md shadow-brand-purple/20 transition-all focus:outline-none disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-purple hover:text-brand-accent transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
