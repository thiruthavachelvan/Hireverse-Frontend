import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building2, MapPin, Users, ArrowLeft, Briefcase,
  Globe, CheckCircle, UserPlus, UserMinus,
  Megaphone, ExternalLink, Sparkles, Calendar, Rocket,
  Video, Eye, Heart, Camera
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
  const [activeVideo, setActiveVideo] = useState(null);

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
        setError('Failed to load startup details.');
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
          <p className="text-lg font-bold text-hv-text">Startup not found</p>
          <p className="text-sm text-hv-muted mt-1">This organization may have deactivated their profile.</p>
        </div>
        <button onClick={() => navigate('/companies')} className="btn-ghost flex items-center gap-2 py-2">
          <ArrowLeft size={16} /> Back to Startups
        </button>
      </div>
    );
  }

  const details = company.companyDetails || {};

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 relative">
      <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />

      {/* ─── Video Overlay Modal ────────────────────────────────────── */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <div className="bg-black rounded-3xl overflow-hidden aspect-video w-full max-w-4xl relative" onClick={e => e.stopPropagation()}>
            <iframe
              src={activeVideo}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        
        {/* Back */}
        <button
          onClick={() => navigate('/companies')}
          className="flex items-center gap-1.5 text-hv-muted hover:text-hv-text transition-colors text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft size={15} /> Back to Startups
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Company Header Card */}
        <div className="card-static overflow-hidden">
          {/* Cover strip */}
          <div className="h-36 bg-gradient-primary w-full opacity-90 relative" />

          {/* Details block */}
          <div className="p-6 -mt-10 relative">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Floating logo */}
              <img
                src={company.profileImage || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(company.name)}`}
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
                    <div className="flex gap-2 items-center mt-1 flex-wrap">
                      <span className="chip chip-violet font-bold text-[10px]">
                        {details.industry || 'Tech Startup'}
                      </span>
                      {details.startupStage && (
                        <span className="chip chip-warning font-bold text-[10px]">
                          {details.startupStage} Stage
                        </span>
                      )}
                    </div>
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
                        <><UserPlus size={14} /> Follow Startup</>
                      )}
                    </motion.button>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mt-4 text-xs font-semibold">
                  <span className="chip chip-gray">
                    <MapPin size={11} className="text-hv-subtle" /> {details.location || 'Remote'}
                  </span>
                  <span className="chip chip-gray">
                    <Users size={11} className="text-hv-subtle" /> {details.size || '1-10'} builders
                  </span>
                  {details.foundedYear && (
                    <span className="chip chip-gray">
                      <Calendar size={11} className="text-hv-subtle" /> Founded {details.foundedYear}
                    </span>
                  )}
                  {details.website && (
                    <a
                      href={details.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chip chip-violet hover:opacity-85 transition-opacity"
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
            
            {/* Mission & Founders Info */}
            <div className="card-static p-6 space-y-4">
              <h2 className="text-lg font-bold text-hv-text">Startup Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details.founders && (
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <p className="text-[10px] uppercase tracking-wider font-extrabold text-hv-subtle">Founders</p>
                    <p className="text-sm font-bold text-hv-text mt-0.5">{details.founders}</p>
                  </div>
                )}
                {details.startupStage && (
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <p className="text-[10px] uppercase tracking-wider font-extrabold text-hv-subtle">Funding Stage</p>
                    <p className="text-sm font-bold text-hv-text mt-0.5">{details.startupStage}</p>
                  </div>
                )}
              </div>

              {details.vision && (
                <div className="pt-2">
                  <p className="text-xs font-bold text-hv-muted uppercase tracking-wider">Vision</p>
                  <p className="text-sm text-hv-text mt-1 leading-relaxed italic">"{details.vision}"</p>
                </div>
              )}

              <div className="pt-2">
                <p className="text-xs font-bold text-hv-muted uppercase tracking-wider">Mission & Description</p>
                <p className="text-sm text-hv-muted mt-1.5 leading-relaxed whitespace-pre-wrap">
                  {details.description || company.bio || 'Ambitious builder building tech startup solutions.'}
                </p>
              </div>

              {details.startupCulture && (
                <div className="pt-2 border-t border-gray-50">
                  <p className="text-xs font-bold text-hv-muted uppercase tracking-wider">Startup Culture</p>
                  <p className="text-sm text-hv-muted mt-1.5 leading-relaxed whitespace-pre-wrap">
                    {details.startupCulture}
                  </p>
                </div>
              )}
            </div>

            {/* Videos Showcase Section */}
            {details.videos && details.videos.length > 0 && (
              <div className="card-static p-6 space-y-4">
                <h2 className="text-lg font-bold text-hv-text flex items-center gap-2">
                  <Video size={18} className="text-hv-violet" /> Startup & Founder Videos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {details.videos.map((vidUrl, index) => {
                    const label = index === 0 ? 'Founder Introduction' : 'Office & Tech Culture';
                    return (
                      <div
                        key={vidUrl}
                        onClick={() => setActiveVideo(vidUrl)}
                        className="border border-gray-100 hover:border-violet-100 rounded-2xl overflow-hidden cursor-pointer group bg-gray-50/50"
                      >
                        <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-hv-violet z-10"
                          >
                            <Play size={16} className="fill-current ml-0.5" />
                          </motion.div>
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                        </div>
                        <div className="p-3.5">
                          <p className="text-xs font-bold text-hv-text group-hover:text-hv-violet transition-colors">
                            {label}
                          </p>
                          <p className="text-[10px] text-hv-muted mt-1 font-semibold">Click to play video</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Office Photos Section */}
            {details.officePhotos && details.officePhotos.length > 0 && (
              <div className="card-static p-6 space-y-4">
                <h2 className="text-lg font-bold text-hv-text flex items-center gap-2">
                  <Camera size={18} className="text-hv-coral" /> Office & Life Photos
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {details.officePhotos.map((photoUrl, idx) => (
                    <div key={idx} className="aspect-square bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden group relative">
                      <img
                        src={photoUrl}
                        alt="Office workspace"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Hiring Drives */}
            <div className="card-static p-6 bg-gradient-to-br from-violet-50/50 to-pink-50/30 border border-violet-100/50">
              <h2 className="text-lg font-bold text-hv-text mb-4 flex items-center gap-2">
                <Megaphone size={18} className="text-hv-coral" /> Upcoming Hiring Drives
              </h2>
              {details.upcomingHiring ? (
                <p className="text-hv-muted text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {details.upcomingHiring}
                </p>
              ) : (
                <p className="text-hv-subtle text-xs font-semibold">
                  There are no announced future hiring drives right now.
                </p>
              )}
            </div>
          </div>

          {/* Active Opportunities Sidebar */}
          <div className="space-y-6">
            <div className="card-static p-6">
              <h2 className="text-lg font-bold text-hv-text mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-hv-violet" /> Open Opportunities
              </h2>
              {jobs.length === 0 ? (
                <p className="text-hv-subtle text-xs font-semibold">No active startup roles recruiting.</p>
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
