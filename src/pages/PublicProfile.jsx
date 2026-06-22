import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  FaUserPlus, FaEnvelope, FaListUl, FaBriefcase, FaGraduationCap, FaCertificate, FaCheck
} from 'react-icons/fa';

const PublicProfile = () => {
  const { userId } = useParams();
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
      } catch (err) {
        setError('Failed to load profile.');
      }
      setLoading(false);
    };
    
    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    try {
      await api.post(`/auth/follow/${userId}`);
      // Optimistically update
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
      <div className="flex min-h-[80vh] items-center justify-center text-white bg-brand-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-purple border-t-transparent"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-white bg-brand-dark">
        <p className="text-red-400">{error || 'Profile not found'}</p>
      </div>
    );
  }

  const isFollowing = profile.followers?.some(f => f._id === currentUser?._id || f === currentUser?._id);

  return (
    <div className="min-h-screen bg-brand-dark text-white px-4 md:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="glassmorphism p-6 md:p-8 rounded-2xl relative">
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
            <img
              src={profile.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${profile.name}`}
              alt={profile.name}
              className="w-28 h-28 rounded-full border-2 border-brand-purple bg-brand-medium mb-4 md:mb-0"
            />
            <div className="flex-1 text-center md:text-left space-y-2 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-white">{profile.name}</h1>
                  <p className="text-md text-brand-accent font-medium mt-1">
                    {profile.headline || 'Professional'}
                  </p>
                </div>
                {!isSelf && (
                  <div className="flex gap-2 self-center">
                    <button
                      onClick={handleFollow}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-brand-purple hover:bg-opacity-90 transition-colors text-xs font-semibold rounded-xl text-white"
                    >
                      {isFollowing ? <><FaCheck /><span>Following</span></> : <><FaUserPlus /><span>Follow</span></>}
                    </button>
                    <button
                      className="flex items-center space-x-1.5 px-4 py-2 bg-brand-medium hover:bg-opacity-80 transition-colors text-xs font-semibold rounded-xl text-white border border-white/10"
                    >
                      <FaEnvelope /><span>Message</span>
                    </button>
                  </div>
                )}
                {isSelf && (
                  <Link to="/profile" className="px-4 py-2 bg-brand-purple text-xs font-semibold rounded-xl text-white">
                    Edit Profile
                  </Link>
                )}
              </div>

              <div className="flex justify-center md:justify-start gap-4 mt-2 text-xs text-gray-400">
                <span><strong className="text-white">{profile.followers?.length || 0}</strong> Followers</span>
                <span><strong className="text-white">{profile.following?.length || 0}</strong> Following</span>
              </div>

              <p className="text-sm text-gray-300 max-w-2xl leading-relaxed mt-2">
                {profile.bio || 'No bio provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glassmorphism p-6 rounded-2xl md:col-span-1 space-y-6">
            <div>
              <h3 className="text-md font-bold mb-3 flex items-center space-x-2">
                <FaListUl className="text-brand-purple" />
                <span>Skills</span>
              </h3>
              {profile.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="px-2.5 py-1 rounded-xl bg-brand-medium text-brand-accent text-[11px] font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No skills listed.</p>
              )}
            </div>

            {profile.accountType === 'professional' && profile.education?.college && (
              <div className="border-t border-brand-medium/40 pt-4">
                <h3 className="text-md font-bold mb-3 flex items-center space-x-2">
                  <FaGraduationCap className="text-brand-purple" />
                  <span>Education</span>
                </h3>
                <div className="text-xs space-y-2">
                  <p className="font-semibold text-white">{profile.education.college}</p>
                  {profile.education.cgpa && <p className="text-gray-400 mt-0.5">CGPA: {profile.education.cgpa}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="glassmorphism p-6 rounded-2xl md:col-span-2 space-y-6">
            {profile.accountType === 'professional' ? (
              <>
                <div>
                  <h3 className="text-md font-bold mb-4 flex items-center space-x-2 border-b border-brand-medium/40 pb-2">
                    <FaBriefcase className="text-brand-purple" />
                    <span>Experience</span>
                  </h3>
                  {profile.workExperience?.length > 0 ? (
                    <div className="relative border-l border-brand-medium/60 ml-2.5 pl-6 space-y-6">
                      {profile.workExperience.map((exp, index) => (
                        <div key={index} className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-brand-purple border-2 border-brand-dark" />
                          <h4 className="font-bold text-white text-sm">{exp.role}</h4>
                          <p className="text-xs text-brand-accent mt-0.5">{exp.company}</p>
                          <p className="text-[10px] text-gray-500 mt-1">{exp.from} — {exp.to || 'Present'}</p>
                          {exp.description && <p className="text-xs text-gray-300 mt-2 leading-relaxed">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No work experience listed.</p>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="text-md font-bold mb-4 border-b border-brand-medium/40 pb-2">
                    Recent Posts
                  </h3>
                  {posts.length > 0 ? (
                    <div className="space-y-3">
                      {posts.map(post => (
                        <div key={post._id} className="p-4 bg-white/5 border border-white/5 rounded-xl">
                          <p className="text-sm text-gray-200 whitespace-pre-wrap">{post.content}</p>
                          <p className="text-[10px] text-gray-500 mt-2">{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No posts to show.</p>
                  )}
                </div>
              </>
            ) : (
              <div>
                <h3 className="text-md font-bold mb-4">Company Details</h3>
                <p className="text-sm text-gray-300">{profile.companyDetails?.description || 'No details provided.'}</p>
                <div className="mt-4 text-xs space-y-2 text-gray-400">
                  <p><strong>Industry:</strong> {profile.companyDetails?.industry || 'N/A'}</p>
                  <p><strong>Size:</strong> {profile.companyDetails?.size || 'N/A'}</p>
                  <p><strong>Location:</strong> {profile.companyDetails?.location || 'N/A'}</p>
                  {profile.companyDetails?.website && (
                    <p><strong>Website:</strong> <a href={profile.companyDetails.website} target="_blank" rel="noreferrer" className="text-brand-purple">{profile.companyDetails.website}</a></p>
                  )}
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
