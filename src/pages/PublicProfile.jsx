import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  UserPlus, Mail, List, Briefcase, GraduationCap, 
  CheckCircle, ArrowLeft, Send, Users, BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  
  const isSelf = currentUser?._id === userId;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/auth/profile/${userId}`);
        setProfile(data);
        
        if (data.accountType === 'professional') {
          const postsRes = await api.get(`/posts/user/${userId}`);
          setPosts(postsRes.data);
        }
      } catch {
        setError('Failed to load profile.');
      }
      setLoading(false);
    };
    
    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    try {
      await api.post(`/auth/follow/${userId}`);
      setProfile(p => ({
        ...p,
        followers: [...(p.followers || []), currentUser._id]
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
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

  if (error || !profile) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center p-6 bg-hv-bg flex-col gap-4">
        <Building2 className="w-16 h-16 text-hv-subtle animate-float" />
        <p className="text-red-500 font-bold">{error || 'Profile not found'}</p>
        <button onClick={() => navigate('/feed')} className="btn-ghost flex items-center gap-1.5 py-2 text-xs">
          <ArrowLeft size={14} /> Back to Feed
        </button>
      </div>
    );
  }

  const isFollowing = profile.followers?.some(f => f._id === currentUser?._id || f === currentUser?._id);

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 relative">
      <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-hv-muted hover:text-hv-text transition-colors text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft size={15} /> Back
        </button>

        {/* Header Card */}
        <div className="card-static overflow-hidden">
          <div className="h-32 bg-gradient-primary w-full opacity-90 relative" />
          
          <div className="p-6 -mt-10 relative">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
              <img
                src={profile.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(profile.name)}`}
                alt={profile.name}
                className="w-20 h-20 rounded-2xl border-4 border-white bg-white shadow-md object-cover flex-shrink-0"
              />
              
              <div className="flex-1 text-center md:text-left space-y-2 w-full mt-3 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-hv-text leading-tight">{profile.name}</h1>
                    <p className="text-sm text-hv-violet font-bold mt-1">
                      {profile.headline || 'Member of HireVerse'}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  {!isSelf && (
                    <div className="flex gap-2 self-center">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleFollow}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isFollowing
                            ? 'btn-ghost border-gray-200 bg-white text-hv-muted'
                            : 'btn-primary'
                        }`}
                      >
                        {isFollowing ? <><CheckCircle size={14} /> Following</> : <><UserPlus size={14} /> Connect</>}
                      </motion.button>
                    </div>
                  )}
                  {isSelf && (
                    <Link to="/profile" className="btn-ghost px-4 py-2 text-xs font-bold self-center">
                      Edit Profile
                    </Link>
                  )}
                </div>

                <div className="flex justify-center md:justify-start gap-4 mt-3 text-xs">
                  <span className="chip chip-violet font-bold">
                    {profile.followers?.length || 0} followers
                  </span>
                  <span className="chip chip-gray">
                    {profile.following?.length || 0} following
                  </span>
                </div>

                <p className="text-sm text-hv-muted leading-relaxed mt-4 text-left">
                  {profile.bio || 'No bio provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Skills & Education */}
          <div className="card-static p-6 md:col-span-1 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-hv-text mb-3 flex items-center gap-1.5">
                <List size={16} className="text-hv-violet" /> Skills
              </h3>
              {profile.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="chip chip-violet text-[10px] font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-hv-muted italic">No skills listed.</p>
              )}
            </div>

            {profile.accountType === 'professional' && profile.education?.college && (
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-bold text-hv-text mb-3 flex items-center gap-1.5">
                  <GraduationCap size={16} className="text-hv-violet" /> Education
                </h3>
                <div className="text-xs space-y-1 bg-gray-50 border border-gray-100 p-3 rounded-xl">
                  <p className="font-bold text-hv-text leading-snug">{profile.education.college}</p>
                  {profile.education.cgpa && <p className="text-hv-muted mt-1 font-semibold">CGPA: {profile.education.cgpa}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Experience, Recent Posts */}
          <div className="card-static p-6 md:col-span-2 space-y-6">
            {profile.accountType === 'professional' ? (
              <>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-hv-text flex items-center gap-1.5 pb-2 border-b border-gray-100">
                    <Briefcase size={16} className="text-hv-violet" /> Experience Timeline
                  </h3>
                  {profile.workExperience?.length > 0 ? (
                    <div className="relative border-l border-gray-100 ml-2.5 pl-6 space-y-6">
                      {profile.workExperience.map((exp, index) => (
                        <div key={index} className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-hv-violet shadow-sm" />
                          <h4 className="font-extrabold text-hv-text text-sm leading-snug">{exp.role}</h4>
                          <p className="text-xs font-bold text-hv-violet mt-0.5">{exp.company}</p>
                          <p className="text-[10px] text-hv-subtle font-bold uppercase mt-1">{exp.from} — {exp.to || 'Present'}</p>
                          {exp.description && <p className="text-xs text-hv-muted mt-2 leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-hv-muted italic">No experience listed.</p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-hv-text mb-4">Recent Feed Updates</h3>
                  {posts.length > 0 ? (
                    <div className="space-y-3">
                      {posts.map(post => (
                        <div key={post._id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                          <p className="text-xs text-hv-text leading-relaxed whitespace-pre-wrap">{post.content}</p>
                          <p className="text-[10px] text-hv-subtle font-bold uppercase mt-2">{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-hv-muted italic">No posts shared yet.</p>
                  )}
                </div>
              </>
            ) : (
              /* Company public details fallback */
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-hv-text flex items-center gap-1.5">
                  <BookOpen size={16} className="text-hv-violet" /> Organization profile
                </h3>
                <p className="text-sm text-hv-muted leading-relaxed">{profile.companyDetails?.description || 'No description provided.'}</p>
                <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-semibold text-hv-muted">
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <span className="text-hv-subtle block text-[10px] uppercase font-bold mb-1">Industry</span>
                    {profile.companyDetails?.industry || 'Technology'}
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <span className="text-hv-subtle block text-[10px] uppercase font-bold mb-1">Location</span>
                    {profile.companyDetails?.location || 'Remote'}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
