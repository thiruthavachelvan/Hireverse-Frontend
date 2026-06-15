import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FaBuilding, FaMapMarkerAlt, FaUsers, FaArrowLeft, FaBriefcase,
  FaDollarSign, FaGlobe, FaCheckCircle, FaUserPlus, FaUserMinus
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

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
      <div className="flex min-h-[80vh] items-center justify-center bg-brand-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-brand-dark text-white px-4 py-8 flex flex-col items-center justify-center">
        <p className="text-gray-400 mb-4">Company not found.</p>
        <button onClick={() => navigate('/companies')} className="flex items-center gap-2 text-violet-400 hover:text-white transition-colors">
          <FaArrowLeft /> Back to Companies
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white px-4 md:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back */}
        <button
          onClick={() => navigate('/companies')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <FaArrowLeft /> Back to Companies
        </button>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Company Header */}
        <div className="glassmorphism rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            <img
              src={company.profileImage || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(company.name)}`}
              alt={company.name}
              className="w-16 h-16 rounded-2xl border border-white/10 bg-brand-medium object-contain"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    {company.name}
                    {company.verificationStatus === 'verified' && (
                      <MdVerified className="text-emerald-400 w-5 h-5 shrink-0" title="Verified Company" />
                    )}
                  </h1>
                  <p className="text-brand-accent font-medium text-sm mt-1">
                    {company.companyDetails?.industry || 'Industry unspecified'}
                  </p>
                </div>
                
                {/* Follow Button (only for candidate users) */}
                {user?.accountType === 'professional' && (
                  <button
                    onClick={handleFollowClick}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                      isFollowing
                        ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
                        : 'bg-brand-purple hover:bg-opacity-90 text-white shadow-brand-purple/20'
                    }`}
                  >
                    {isFollowing ? (
                      <><FaUserMinus /> Unfollow</>
                    ) : (
                      <><FaUserPlus /> Follow</>
                    )}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5 bg-brand-medium/30 px-2.5 py-1 rounded-lg">
                  <FaMapMarkerAlt className="text-violet-400" /> {company.companyDetails?.location || 'Remote / Unknown'}
                </span>
                <span className="flex items-center gap-1.5 bg-brand-medium/30 px-2.5 py-1 rounded-lg">
                  <FaUsers className="text-blue-400" /> Size: {company.companyDetails?.size || 'Not Specified'}
                </span>
                <span className="flex items-center gap-1.5 bg-brand-medium/30 px-2.5 py-1 rounded-lg">
                  <FaGlobe className="text-emerald-400" />
                  {company.companyDetails?.website ? (
                    <a href={company.companyDetails.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Website
                    </a>
                  ) : 'No website'}
                </span>
                <span className="flex items-center gap-1.5 bg-brand-medium/30 px-2.5 py-1 rounded-lg">
                  Followers: {company.followers?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info & Content Tabs */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Bio / Description */}
            <div className="glassmorphism rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">About the Company</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {company.companyDetails?.description || company.bio || 'No details provided.'}
              </p>
            </div>

            {/* Upcoming Hiring Options */}
            <div className="glassmorphism rounded-2xl p-6 bg-gradient-to-br from-violet-900/10 to-transparent">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaBriefcase className="text-pink-400" /> Upcoming Hiring Drives
              </h2>
              {company.companyDetails?.upcomingHiring ? (
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {company.companyDetails.upcomingHiring}
                </p>
              ) : (
                <p className="text-gray-500 text-sm">
                  There are no announced future hiring drives or upcoming hiring options right now.
                </p>
              )}
            </div>
          </div>

          {/* Active Job Openings Sidebar */}
          <div className="space-y-6">
            <div className="glassmorphism rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaBriefcase className="text-violet-400" /> Active Openings
              </h2>
              {jobs.length === 0 ? (
                <p className="text-gray-500 text-sm">No jobs actively posting right now.</p>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-violet-500/30 transition-all cursor-pointer group"
                    >
                      <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                        {job.jobTitle}
                      </h3>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2">
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-violet-400 scale-90" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400">
                          <FaDollarSign className="scale-90" /> {job.salary}
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
