import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building2, MapPin, Users, ArrowLeft, Briefcase,
  DollarSign, Globe, CheckCircle, UserPlus, UserMinus,
  Megaphone, ExternalLink, Sparkles
} from 'lucide-react';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, handleFollowToggle } = useAuth();
  
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch company profile details
        const companyRes = await api.get(`/auth/profile/${id}`);
        setCompany(companyRes.data);

        // Check follow status
        if (user) {
          setIsFollowing(user.following?.includes(id));
        }

        // Fetch jobs and filter for this company
        const jobsRes = await api.get('/jobs');
        const activeJobs = jobsRes.data.filter(
          (j) => (j.companyId?._id === id || j.companyId === id) && j.isActive
        );
        setJobs(activeJobs);
      } catch (err) {
        setError('Failed to load company details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleFollowClick = async () => {
    try {
      if (isFollowing) {
        const { data } = await api.post(`/auth/unfollow/${id}`);
        handleFollowToggle(data.following);
        setIsFollowing(false);
      } else {
        const { data } = await api.post(`/auth/follow/${id}`);
        handleFollowToggle(data.following);
        setIsFollowing(true);
      }
      
      // Update local follower count
      setCompany(prev => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter(fId => fId !== user._id && fId?._id !== user._id)
          : [...prev.followers, user._id]
      }));
    } catch {
      setError('Connection update failed.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-hv-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#8B5CF6', borderRightColor: '#FF6B6B' }}
        />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-[80vh] px-4 py-8 flex flex-col items-center justify-center space-y-4">
        <Building2 className="w-16 h-16 text-hv-subtle animate-float" />
        <div>
          <p className="text-lg font-bold text-hv-text">Company not found</p>
          <p className="text-sm text-hv-muted mt-1">This organization may have deactivated their profile.</p>
        </div>
        <button onClick={() => navigate('/companies')} className="btn-ghost flex items-center gap-2 py-2">
          <ArrowLeft size={16} /> Back to Companies
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 relative">
      <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* Back */}
        <button
          onClick={() => navigate('/companies')}
          className="flex items-center gap-1.5 text-hv-muted hover:text-hv-text transition-colors text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft size={15} /> Back to Companies
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Company Header Card */}
        <div className="card-static overflow-hidden">
          {/* Cover strip */}
          <div className="h-32 bg-gradient-primary w-full opacity-90 relative" />

          {/* Details block */}
          <div className="p-6 -mt-10 relative">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Floating logo */}
              <img
                src={company.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(company.name)}`}
                alt={company.name}
                className="w-20 h-20 rounded-2xl border-4 border-white bg-white shadow-md object-contain flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0 mt-3 md:mt-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-black text-hv-text flex items-center gap-1.5">
                      {company.name}
                      <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                    </h1>
                    <p className="text-hv-violet font-bold text-sm mt-1">
                      {company.companyDetails?.industry || 'Industry unspecified'}
                    </p>
                  </div>
                  
                  {/* Follow Button (only for candidate users) */}
                  {user?.accountType === 'professional' && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleFollowClick}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isFollowing
                          ? 'btn-ghost text-red-500 border-red-100 hover:bg-red-50'
                          : 'btn-primary'
                      }`}
                    >
                      {isFollowing ? (
                        <><UserMinus size={14} /> Unfollow</>
                      ) : (
                        <><UserPlus size={14} /> Follow Company</>
                      )}
                    </motion.button>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mt-4 text-xs">
                  <span className="chip chip-gray">
                    <MapPin size={11} className="text-hv-subtle" /> {company.companyDetails?.location || 'Remote / Unknown'}
                  </span>
                  <span className="chip chip-gray">
                    <Users size={11} className="text-hv-subtle" /> Size: {company.companyDetails?.size || 'Not Specified'}
                  </span>
                  {company.companyDetails?.website && (
                    <a
                      href={company.companyDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chip chip-violet font-semibold hover:opacity-85 transition-opacity"
                    >
                      <Globe size={11} /> Website <ExternalLink size={9} />
                    </a>
                  )}
                  <span className="chip chip-violet font-bold">
                    {company.followers?.length || 0} followers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info & Content Tabs (split) */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Bio / Description */}
            <div className="card-static p-6 space-y-4">
              <h2 className="text-lg font-bold text-hv-text">About the Company</h2>
              <p className="text-hv-muted text-sm leading-relaxed whitespace-pre-wrap">
                {company.companyDetails?.description || company.bio || 'No details provided.'}
              </p>
            </div>

            {/* Upcoming Hiring Options */}
            <div className="card-static p-6 bg-gradient-to-br from-violet-50/50 to-pink-50/30 border border-violet-100/50">
              <h2 className="text-lg font-bold text-hv-text mb-4 flex items-center gap-2">
                <Megaphone size={18} className="text-hv-coral" /> Upcoming Hiring Drives
              </h2>
              {company.companyDetails?.upcomingHiring ? (
                <p className="text-hv-muted text-sm leading-relaxed whitespace-pre-wrap">
                  {company.companyDetails.upcomingHiring}
                </p>
              ) : (
                <p className="text-hv-subtle text-xs font-semibold">
                  There are no announced future hiring drives right now.
                </p>
              )}
            </div>
          </div>

          {/* Active Job Openings Sidebar */}
          <div className="space-y-6">
            <div className="card-static p-6">
              <h2 className="text-lg font-bold text-hv-text mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-hv-violet" /> Active Openings
              </h2>
              {jobs.length === 0 ? (
                <p className="text-hv-subtle text-xs font-semibold">No open roles actively recruiting.</p>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="p-4 border border-gray-100 rounded-xl hover:border-violet-100 hover:bg-violet-50/10 transition-all cursor-pointer group"
                    >
                      <h3 className="text-sm font-bold text-hv-text group-hover:text-hv-violet transition-colors line-clamp-1">
                        {job.jobTitle}
                      </h3>
                      <div className="flex items-center justify-between text-[10px] text-hv-muted mt-2 font-bold uppercase">
                        <span className="flex items-center gap-1">
                          <MapPin size={10} className="text-hv-subtle" /> {job.location}
                        </span>
                        <span className="text-emerald-600 font-extrabold">
                          {job.salary}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
