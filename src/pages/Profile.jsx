import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  UserPen, Save, X, List, Info, Briefcase, GraduationCap, 
  BadgeCheck, Plus, Trash2, FileText, UploadCloud, CheckCircle, 
  Users, Sparkles, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    headline: '',
    bio: '',
    skills: '',
    profileImage: '',
    employmentStatus: 'unemployed',
    college: '',
    cgpa: '',
    certifications: '',
  });

  const [workExperience, setWorkExperience] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tab views
  const [activeTab, setActiveTab] = useState('experience'); // 'experience', 'posts', 'requests'
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [followRequests, setFollowRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  const fetchUserPosts = async () => {
    setPostsLoading(true);
    try {
      const { data } = await api.get(`/posts/user/${user._id}`);
      setUserPosts(data);
    } catch { /* ignore */ }
    setPostsLoading(false);
  };

  const fetchFollowRequests = async () => {
    setRequestsLoading(true);
    try {
      const { data } = await api.get('/auth/follow-requests');
      setFollowRequests(data);
    } catch { /* ignore */ }
    setRequestsLoading(false);
  };

  const handleAcceptRequest = async (reqId) => {
    try {
      setError(''); setSuccess('');
      await api.put(`/auth/follow-request/${reqId}/accept`);
      setSuccess('Connection request accepted!');
      fetchFollowRequests();
      fetchDetailedProfile();
    } catch { setError('Failed to accept request.'); }
  };

  const handleRejectRequest = async (reqId) => {
    try {
      setError(''); setSuccess('');
      await api.put(`/auth/follow-request/${reqId}/reject`);
      setSuccess('Connection request rejected.');
      fetchFollowRequests();
    } catch { setError('Failed to reject request.'); }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF resumes are supported.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Resume must be under 2MB.');
      return;
    }

    setResumeUploading(true);
    setError(''); setSuccess('');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Data = reader.result;
        const res = await updateProfile({
          resume: {
            name: file.name,
            data: base64Data,
            contentType: file.type
          }
        });
        if (res.success) setSuccess('Resume uploaded successfully!');
        else setError(res.message);
      } catch { setError('Resume upload failed.'); }
      setResumeUploading(false);
    };
  };

  const handleDeleteResume = async () => {
    try {
      setError(''); setSuccess('');
      setResumeUploading(true);
      const res = await updateProfile({
        resume: { name: '', data: '', contentType: '' }
      });
      if (res.success) setSuccess('Resume removed.');
      else setError(res.message);
    } catch { setError('Failed to remove resume.'); }
    setResumeUploading(false);
  };

  const handleDownloadResume = () => {
    if (user.resume?.data) {
      const link = document.createElement('a');
      link.href = user.resume.data;
      link.download = user.resume.name || 'resume.pdf';
      link.click();
    }
  };

  useEffect(() => {
    if (user) {
      setProfileData({
        headline: user.headline || '',
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : '',
        profileImage: user.profileImage || '',
        employmentStatus: user.employmentStatus || 'unemployed',
        college: user.education?.college || '',
        cgpa: user.education?.cgpa || '',
        certifications: user.education?.certifications ? user.education.certifications.join(', ') : '',
      });
      setWorkExperience(user.workExperience || []);
      fetchDetailedProfile();
      if (user.accountType === 'professional') {
        fetchUserPosts();
        fetchFollowRequests();
      }
    }
  }, [user]);

  const fetchDetailedProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/auth/profile/${user._id}`);
      setFollowersList(res.data.followers || []);
      setFollowingList(res.data.following || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError(''); setSuccess('');
    if (!isEditing && user) {
      setProfileData({
        headline: user.headline || '',
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : '',
        profileImage: user.profileImage || '',
        employmentStatus: user.employmentStatus || 'unemployed',
        college: user.education?.college || '',
        cgpa: user.education?.cgpa || '',
        certifications: user.education?.certifications ? user.education.certifications.join(', ') : '',
      });
      setWorkExperience(user.workExperience || []);
    }
  };

  const handleAddExperience = () => {
    setWorkExperience([
      ...workExperience,
      { company: '', role: '', from: '', to: '', description: '' }
    ]);
  };

  const handleRemoveExperience = (idx) => {
    setWorkExperience(workExperience.filter((_, i) => i !== idx));
  };

  const handleExperienceChange = (idx, field, val) => {
    setWorkExperience(workExperience.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(''); setSuccess('');

    const skillsArray = profileData.skills
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');

    const submissionData = {
      headline: profileData.headline,
      bio: profileData.bio,
      skills: skillsArray,
      profileImage: profileData.profileImage,
    };

    if (user.accountType === 'professional') {
      submissionData.employmentStatus = profileData.employmentStatus;
      submissionData.education = {
        college: profileData.college,
        cgpa: profileData.cgpa,
        certifications: profileData.certifications
          .split(',')
          .map(c => c.trim())
          .filter(c => c !== ''),
      };
      submissionData.workExperience = workExperience.filter(exp => exp.company.trim() && exp.role.trim());
    }

    const res = await updateProfile(submissionData);
    setSaveLoading(false);

    if (res.success) {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } else {
      setError(res.message);
    }
  };

  // Profile completion strength logic (circular tracker)
  const getProfileStrength = () => {
    let score = 15; // starting base score
    if (user.profileImage) score += 15;
    if (user.headline) score += 15;
    if (user.bio) score += 15;
    if (user.skills?.length > 0) score += 15;
    if (user.education?.college || user.companyDetails?.website) score += 15;
    if (user.resume?.name || user.companyDetails?.description) score += 10;
    return score;
  };

  const strength = getProfileStrength();
  const radius = 30;
  const strokeDash = 2 * Math.PI * radius;
  const strokeOffset = strokeDash - (strength / 100) * strokeDash;

  if (loading && !user) {
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

  const isProfessional = user.accountType === 'professional';

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 relative">
      <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-sm text-center font-bold">
            {success}
          </div>
        )}

        {/* Profile Card */}
        <div className="card-static overflow-hidden">
          {/* Cover Mesh Banner */}
          <div className="h-44 bg-gradient-primary w-full opacity-90 relative" />

          {/* Profile Details Container */}
          <div className="p-6 md:p-8 -mt-16 relative">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              
              {/* Profile image with zoom on hover */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-28 h-28 rounded-3xl border-4 border-white bg-white shadow-lg overflow-hidden flex-shrink-0 relative group"
              >
                <img
                  src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </motion.div>

              <div className="flex-1 text-center md:text-left space-y-2 w-full mt-10 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-hv-text leading-tight">{user.name}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                      <span className="chip chip-violet uppercase text-[9px] px-2 py-0">
                        {user.accountType}
                      </span>
                      {isProfessional && user.employmentStatus && (
                        <span className={`chip text-[9px] px-2 py-0 uppercase ${
                          user.employmentStatus === 'employed' ? 'chip-success' :
                          user.employmentStatus === 'recently_left' ? 'chip-warning' :
                          'chip-blue'
                        }`}>
                          {user.employmentStatus === 'employed' ? 'Employed' :
                           user.employmentStatus === 'recently_left' ? 'Recently Left' : 'Open to work'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Edit Toggle (Header) */}
                  {!isEditing && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleEditToggle}
                      className="btn-ghost flex items-center justify-center gap-1.5 px-4 py-2 text-xs self-center"
                    >
                      <UserPen size={14} />
                      <span>Edit Workspace</span>
                    </motion.button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="pt-2">
                    <p className="text-base text-hv-violet font-bold leading-snug">
                      {user.headline || 'No headline set yet'}
                    </p>
                    <p className="text-sm text-hv-muted max-w-2xl leading-relaxed mt-2">
                      {user.bio || 'Write a short bio to tell others about yourself.'}
                    </p>
                  </div>
                ) : (
                  /* Inline Edit Form */
                  <form onSubmit={handleSave} className="space-y-4 w-full pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div>
                        <label className="block text-xs font-semibold text-hv-muted mb-1.5">Profile Image seed/URL</label>
                        <input
                          type="text"
                          value={profileData.profileImage}
                          onChange={(e) => setProfileData({ ...profileData, profileImage: e.target.value })}
                          placeholder="e.g. John seed for avatar generator"
                          className="input-field py-2 text-xs"
                        />
                      </div>
                      {isProfessional && (
                        <div>
                          <label className="block text-xs font-semibold text-hv-muted mb-1.5">Employment Status</label>
                          <select
                            value={profileData.employmentStatus}
                            onChange={(e) => setProfileData({ ...profileData, employmentStatus: e.target.value })}
                            className="input-field py-2 text-xs"
                          >
                            <option value="unemployed">Unemployed / Looking for work</option>
                            <option value="employed">Employed</option>
                            <option value="recently_left">Recently Left / Transitioning</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="text-left">
                      <label className="block text-xs font-semibold text-hv-muted mb-1.5">Professional Headline</label>
                      <input
                        type="text"
                        value={profileData.headline}
                        onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                        placeholder="e.g. Lead Frontend Engineer at Acme Corp"
                        className="input-field py-2 text-xs"
                      />
                    </div>

                    <div className="text-left">
                      <label className="block text-xs font-semibold text-hv-muted mb-1.5">Workspace Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="Share your goals, career background, and what you are building."
                        className="input-field min-h-[90px] resize-none py-2 text-xs"
                      />
                    </div>

                    <div className="text-left">
                      <label className="block text-xs font-semibold text-hv-muted mb-1.5">Skills (Comma-separated)</label>
                      <input
                        type="text"
                        value={profileData.skills}
                        onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                        placeholder="e.g. React, Mongoose, Express, Python"
                        className="input-field py-2 text-xs"
                      />
                    </div>

                    {/* Educational details for professional users */}
                    {isProfessional && (
                      <div className="border-t border-gray-100 pt-4 space-y-4 text-left">
                        <h3 className="text-sm font-bold gradient-text">Education Profile</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-hv-muted mb-1.5">College / Institution</label>
                            <input
                              type="text"
                              value={profileData.college}
                              onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                              placeholder="e.g. PSG College of Technology"
                              className="input-field py-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-hv-muted mb-1.5">CGPA / Percentage</label>
                            <input
                              type="text"
                              value={profileData.cgpa}
                              onChange={(e) => setProfileData({ ...profileData, cgpa: e.target.value })}
                              placeholder="e.g. 8.5"
                              className="input-field py-2 text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-hv-muted mb-1.5">Certifications (Comma-separated)</label>
                          <input
                            type="text"
                            value={profileData.certifications}
                            onChange={(e) => setProfileData({ ...profileData, certifications: e.target.value })}
                            placeholder="e.g. AWS Certified Developer, Scrum Master"
                            className="input-field py-2 text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {/* Work Experience Builder */}
                    {isProfessional && (
                      <div className="border-t border-gray-100 pt-4 space-y-4 text-left">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold gradient-text">Work Experience Timeline</h3>
                          <button
                            type="button"
                            onClick={handleAddExperience}
                            className="text-xs text-hv-violet hover:opacity-85 flex items-center gap-1 font-bold cursor-pointer"
                          >
                            <Plus size={14} /> Add Role
                          </button>
                        </div>
                        {workExperience.length === 0 ? (
                          <p className="text-xs text-hv-muted italic">No work experience listed yet.</p>
                        ) : (
                          <div className="space-y-4">
                            {workExperience.map((exp, idx) => (
                              <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-3 relative">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExperience(idx)}
                                  className="absolute top-4 right-4 text-red-500 hover:text-red-600 text-xs flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[10px] font-semibold text-hv-muted mb-1">Company *</label>
                                    <input
                                      type="text"
                                      required
                                      value={exp.company}
                                      onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                                      placeholder="e.g. Google"
                                      className="input-field bg-white py-1.5 text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-semibold text-hv-muted mb-1">Role / Job Title *</label>
                                    <input
                                      type="text"
                                      required
                                      value={exp.role}
                                      onChange={(e) => handleExperienceChange(idx, 'role', e.target.value)}
                                      placeholder="e.g. Lead Engineer"
                                      className="input-field bg-white py-1.5 text-xs"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[10px] font-semibold text-hv-muted mb-1">From (YYYY-MM) *</label>
                                    <input
                                      type="text"
                                      required
                                      value={exp.from}
                                      onChange={(e) => handleExperienceChange(idx, 'from', e.target.value)}
                                      placeholder="e.g. 2022-03"
                                      className="input-field bg-white py-1.5 text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-semibold text-hv-muted mb-1">To (YYYY-MM or Present)</label>
                                    <input
                                      type="text"
                                      value={exp.to || ''}
                                      onChange={(e) => handleExperienceChange(idx, 'to', e.target.value || null)}
                                      placeholder="e.g. Present"
                                      className="input-field bg-white py-1.5 text-xs"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-hv-muted mb-1">Responsibilities / Achievements</label>
                                  <textarea
                                    value={exp.description}
                                    onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)}
                                    placeholder="Describe your achievements and tasks..."
                                    className="input-field bg-white min-h-[60px] resize-none py-1.5 text-xs"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className="btn-ghost flex items-center gap-1.5 py-2 text-xs"
                      >
                        <X size={14} /> Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saveLoading}
                        className="btn-primary flex items-center gap-1.5 py-2 text-xs"
                      >
                        <Save size={14} /> {saveLoading ? 'Saving...' : 'Save workspace'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Columns: Profile Strength, Skills, Network */}
        {!isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Strength & Skills & Resume */}
            <div className="space-y-6 md:col-span-1">
              
              {/* Profile strength circle */}
              <div className="card p-6 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-hv-text">Profile Strength</h3>
                  <p className="text-xs text-hv-muted">Completing profiles gets 3x more recruiters.</p>
                </div>
                <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <svg className="w-16 h-16 -rotate-95">
                    <circle cx="32" cy="32" r={radius} className="fill-none stroke-gray-100 stroke-[5px]" />
                    <motion.circle
                      cx="32" cy="32" r={radius}
                      className="fill-none stroke-[5px]"
                      stroke="url(#strength-grad)"
                      strokeDasharray={strokeDash}
                      initial={{ strokeDashoffset: strokeDash }}
                      animate={{ strokeDashoffset: strokeOffset }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="strength-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF6B6B" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute font-black text-xs text-hv-text">{strength}%</span>
                </div>
              </div>

              {/* Skills */}
              <div className="card p-6 space-y-4">
                <h3 className="text-sm font-bold text-hv-text flex items-center gap-1.5">
                  <List size={16} className="text-hv-violet" /> Skills
                </h3>
                {user.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="chip chip-violet font-semibold text-[10px]">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-hv-muted italic">No skills listed yet.</p>
                )}
              </div>

              {/* Education */}
              {isProfessional && (
                <div className="card p-6 space-y-4">
                  <h3 className="text-sm font-bold text-hv-text flex items-center gap-1.5">
                    <GraduationCap size={16} className="text-hv-violet" /> Education
                  </h3>
                  {user.education?.college ? (
                    <div className="text-xs space-y-2">
                      <div>
                        <p className="font-bold text-hv-text text-sm leading-snug">{user.education.college}</p>
                        {user.education.cgpa && (
                          <p className="text-hv-muted mt-1 font-semibold">CGPA: {user.education.cgpa}</p>
                        )}
                      </div>
                      {user.education.certifications?.length > 0 && (
                        <div className="pt-2 border-t border-gray-50">
                          <p className="text-[9px] font-bold text-hv-subtle uppercase tracking-wider flex items-center gap-1 mb-1.5">
                            <BadgeCheck size={12} className="text-hv-coral" /> Certifications
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {user.education.certifications.map((cert, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-gray-50 border border-gray-100 text-[10px] text-hv-muted font-bold">{cert}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-hv-muted italic">No education profile added.</p>
                  )}
                </div>
              )}

              {/* Resume pdf */}
              {isProfessional && (
                <div className="card p-6 space-y-3">
                  <h3 className="text-sm font-bold text-hv-text flex items-center gap-1.5">
                    <FileText size={16} className="text-hv-violet" /> Resume Profile
                  </h3>
                  {user.resume?.name ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText size={16} className="text-red-400 shrink-0" />
                        <span className="text-xs font-bold text-hv-text truncate flex-1">{user.resume.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDownloadResume}
                          className="btn-ghost flex-1 py-1.5 text-[10px]"
                        >
                          Download
                        </button>
                        <button
                          onClick={handleDeleteResume}
                          className="px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-hv-violet/40 transition-colors relative">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeUpload}
                        disabled={resumeUploading}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <UploadCloud size={24} className="text-hv-subtle mx-auto mb-2" />
                      <p className="text-[10px] text-hv-muted font-bold uppercase tracking-wider">
                        {resumeUploading ? 'Uploading...' : 'Upload PDF Resume (Max 2MB)'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Timeline tabs, requests, posts */}
            <div className="md:col-span-2 space-y-6">
              
              {isProfessional ? (
                <div className="card p-6 space-y-6">
                  {/* Tab switches */}
                  <div className="flex border-b border-gray-100">
                    {[
                      { id: 'experience', label: 'Experience' },
                      { id: 'posts',      label: `My Posts (${userPosts.length})`, action: fetchUserPosts },
                      { id: 'requests',   label: `Connection Requests`, count: followRequests.length, action: fetchFollowRequests }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); if (tab.action) tab.action(); }}
                        className={`flex-1 pb-3 text-xs font-bold transition-colors border-b-2 text-center relative cursor-pointer ${
                          activeTab === tab.id
                            ? 'border-hv-violet text-hv-violet'
                            : 'border-transparent text-hv-muted hover:text-hv-text'
                        }`}
                      >
                        {tab.label}
                        {tab.count > 0 && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Panel views */}
                  {activeTab === 'experience' && (
                    <div className="pt-2">
                      {user.workExperience && user.workExperience.length > 0 ? (
                        <div className="relative border-l border-gray-100 ml-2.5 pl-6 space-y-6">
                          {user.workExperience.map((exp, index) => (
                            <div key={index} className="relative group">
                              <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-hv-violet shadow-sm" />
                              <div>
                                <h4 className="font-extrabold text-hv-text text-sm leading-snug">{exp.role}</h4>
                                <p className="text-xs font-bold text-hv-violet mt-0.5">{exp.company}</p>
                                <p className="text-[10px] text-hv-subtle font-bold uppercase mt-1">
                                  {exp.from} — {exp.to || 'Present'}
                                </p>
                                {exp.description && (
                                  <p className="text-xs text-hv-muted mt-2.5 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-hv-muted italic text-center py-6">No work experience listed yet.</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'posts' && (
                    <div className="space-y-4 pt-2">
                      {postsLoading ? (
                        <div className="text-center py-6 text-hv-muted text-xs">Loading posts...</div>
                      ) : userPosts.length === 0 ? (
                        <p className="text-xs text-hv-muted italic text-center py-6">You haven't posted updates yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {userPosts.map(post => (
                            <div key={post._id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                              <p className="text-xs text-hv-text whitespace-pre-wrap leading-relaxed">{post.content}</p>
                              <div className="flex justify-between items-center text-[10px] text-hv-muted pt-2 border-t border-gray-100 font-bold">
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                <div className="flex gap-3">
                                  <span>{post.likes?.length || 0} Likes</span>
                                  <span>{post.comments?.length || 0} Comments</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'requests' && (
                    <div className="space-y-4 pt-2">
                      {requestsLoading ? (
                        <div className="text-center py-6 text-hv-muted text-xs">Loading requests...</div>
                      ) : followRequests.length === 0 ? (
                        <p className="text-xs text-hv-muted italic text-center py-6">No pending connection requests.</p>
                      ) : (
                        <div className="space-y-3">
                          {followRequests.map(req => (
                            <div key={req._id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={req.senderId?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(req.senderId?.name || '')}`}
                                  alt=""
                                  className="w-9 h-9 rounded-lg object-cover border border-gray-200 bg-white"
                                />
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-hv-text truncate">{req.senderId?.name}</h4>
                                  <p className="text-[10px] text-hv-muted truncate">{req.senderId?.headline || 'Professional'}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() => handleAcceptRequest(req._id)}
                                  className="btn-success px-3 py-1.5 text-[10px] shadow-none flex items-center gap-1 font-bold"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(req._id)}
                                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Company Overview block */
                <div className="card p-6 space-y-4">
                  <h3 className="text-sm font-bold text-hv-text flex items-center gap-1.5">
                    <BookOpen size={16} className="text-hv-violet" /> Company Workspace Overview
                  </h3>
                  <p className="text-xs text-hv-muted italic">Configure open positions, verify candidates, and publish hiring drives.</p>
                </div>
              )}

              {/* Connections/Followers Grid */}
              <div className="card p-6 space-y-4">
                <h3 className="text-sm font-bold text-hv-text flex items-center gap-1.5">
                  <Users size={16} className="text-hv-violet" /> Career Network Contacts
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Followers */}
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-3">
                    <h4 className="font-bold text-hv-text">Followers ({followersList.length})</h4>
                    {followersList.length === 0 ? (
                      <p className="text-hv-subtle text-[10px]">No followers yet.</p>
                    ) : (
                      <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                        {followersList.map((f) => (
                          <div key={f._id} className="flex items-center gap-2 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                            <img
                              src={f.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(f.name)}`}
                              className="w-6.5 h-6.5 rounded-lg object-cover border border-gray-200 bg-white"
                              alt=""
                            />
                            <div className="truncate">
                              <p className="font-bold text-hv-text truncate max-w-[120px]">{f.name}</p>
                              <p className="text-[9px] text-hv-muted truncate max-w-[120px]">{f.headline || 'Professional'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Following */}
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-3">
                    <h4 className="font-bold text-hv-text">Following ({followingList.length})</h4>
                    {followingList.length === 0 ? (
                      <p className="text-hv-subtle text-[10px]">Not following anyone yet.</p>
                    ) : (
                      <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                        {followingList.map((f) => (
                          <div key={f._id} className="flex items-center gap-2 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                            <img
                              src={f.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(f.name)}`}
                              className="w-6.5 h-6.5 rounded-lg object-cover border border-gray-200 bg-white"
                              alt=""
                            />
                            <div className="truncate">
                              <p className="font-bold text-hv-text truncate max-w-[120px]">{f.name}</p>
                              <p className="text-[9px] text-hv-muted truncate max-w-[120px]">{f.headline || 'Professional'}</p>
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
        )}
      </div>
    </div>
  );
};

export default Profile;
