import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  FaUserEdit, FaSave, FaTimes, FaListUl, FaInfoCircle, 
  FaBriefcase, FaGraduationCap, FaCertificate, FaPlus, FaTrash,
  FaFilePdf, FaFileUpload, FaCheck, FaUserFriends
} from 'react-icons/fa';

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

  // New features state
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
    } catch (err) {
      console.error('Failed to load user posts');
    }
    setPostsLoading(false);
  };

  const fetchFollowRequests = async () => {
    setRequestsLoading(true);
    try {
      const { data } = await api.get('/auth/follow-requests');
      setFollowRequests(data);
    } catch (err) {
      console.error('Failed to load follow requests');
    }
    setRequestsLoading(false);
  };

  const handleAcceptRequest = async (reqId) => {
    try {
      setError('');
      setSuccess('');
      await api.put(`/auth/follow-request/${reqId}/accept`);
      setSuccess('Connection request accepted!');
      fetchFollowRequests();
      fetchDetailedProfile();
    } catch {
      setError('Failed to accept request.');
    }
  };

  const handleRejectRequest = async (reqId) => {
    try {
      setError('');
      setSuccess('');
      await api.put(`/auth/follow-request/${reqId}/reject`);
      setSuccess('Connection request rejected.');
      fetchFollowRequests();
    } catch {
      setError('Failed to reject request.');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF resumes are supported.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB Limit
      setError('Resume must be under 2MB.');
      return;
    }

    setResumeUploading(true);
    setError('');
    setSuccess('');

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
        if (res.success) {
          setSuccess('Resume uploaded successfully!');
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError('Resume upload failed.');
      }
      setResumeUploading(false);
    };
  };

  const handleDeleteResume = async () => {
    try {
      setError('');
      setSuccess('');
      setResumeUploading(true);
      const res = await updateProfile({
        resume: { name: '', data: '', contentType: '' }
      });
      if (res.success) {
        setSuccess('Resume removed.');
      } else {
        setError(res.message);
      }
    } catch {
      setError('Failed to remove resume.');
    }
    setResumeUploading(false);
  };

  const handleDownloadResume = () => {
    if (user.resume && user.resume.data) {
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
    } catch (err) {
      console.error('Failed to fetch follower details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
    if (!isEditing && user) {
      // Reset values to current state on edit cancel/open
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
    setError('');
    setSuccess('');

    // Convert comma-separated string to skills array
    const skillsArray = profileData.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill !== '');

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
          .map((c) => c.trim())
          .filter((c) => c !== ''),
      };
      
      // Clean up empty experience listings before sending
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

  if (loading && !user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-white bg-brand-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-purple border-t-transparent animate-pulse"></div>
      </div>
    );
  }

  const isProfessional = user.accountType === 'professional';

  return (
    <div className="min-h-screen bg-brand-dark text-white px-4 md:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Alerts */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300 text-sm text-center">
            {success}
          </div>
        )}

        {/* Profile Card */}
        <div className="glassmorphism p-6 md:p-8 rounded-2xl relative">
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
            <img
              src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
              alt={user.name}
              className="w-28 h-28 rounded-full border-2 border-brand-purple bg-brand-medium mb-4 md:mb-0"
            />
            <div className="flex-1 text-center md:text-left space-y-2 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-white">{user.name}</h1>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-purple/20 text-brand-accent text-xs font-semibold uppercase">
                      {user.accountType}
                    </span>
                    {isProfessional && user.employmentStatus && (
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        user.employmentStatus === 'employed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        user.employmentStatus === 'recently_left' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {user.employmentStatus === 'employed' ? 'Employed' :
                         user.employmentStatus === 'recently_left' ? 'Recently Left' : 'Unemployed'}
                      </span>
                    )}
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center justify-center space-x-1.5 px-4 py-2 bg-brand-purple hover:bg-opacity-90 transition-colors text-xs font-semibold rounded-xl text-white self-center"
                  >
                    <FaUserEdit />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {!isEditing ? (
                <>
                  <p className="text-md text-brand-accent font-medium mt-2">
                    {user.headline || 'No headline set yet'}
                  </p>
                  <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
                    {user.bio || 'Write a short bio to tell others about yourself.'}
                  </p>
                </>
              ) : (
                <form onSubmit={handleSave} className="space-y-4 w-full mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Avatar Seed / URL</label>
                      <input
                        type="text"
                        value={profileData.profileImage}
                        onChange={(e) => setProfileData({ ...profileData, profileImage: e.target.value })}
                        placeholder="e.g. Image URL or seed for dicebear"
                        className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-purple"
                      />
                    </div>
                    {isProfessional && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Employment Status</label>
                        <select
                          value={profileData.employmentStatus}
                          onChange={(e) => setProfileData({ ...profileData, employmentStatus: e.target.value })}
                          className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-purple"
                        >
                          <option value="unemployed">Unemployed / Looking for work</option>
                          <option value="employed">Employed</option>
                          <option value="recently_left">Recently Left / Transitioning</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Headline</label>
                    <input
                      type="text"
                      value={profileData.headline}
                      onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                      placeholder="e.g. Senior Software Engineer at Google"
                      className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Write a short summary about your background, achievements, and experiences."
                      className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-purple min-h-[90px] resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Skills (Comma-separated)</label>
                    <input
                      type="text"
                      value={profileData.skills}
                      onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                      placeholder="e.g. React, Mongoose, Express, Python"
                      className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-purple"
                    />
                  </div>

                  {isProfessional && (
                    <div className="border-t border-brand-medium/50 pt-4 space-y-4">
                      <h3 className="text-sm font-bold text-brand-accent">Education</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-400 mb-1">College / University</label>
                          <input
                            type="text"
                            value={profileData.college}
                            onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                            placeholder="e.g. PSG College of Technology"
                            className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 mb-1">CGPA / Percentage</label>
                          <input
                            type="text"
                            value={profileData.cgpa}
                            onChange={(e) => setProfileData({ ...profileData, cgpa: e.target.value })}
                            placeholder="e.g. 8.4"
                            className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Certifications (Comma-separated)</label>
                        <input
                          type="text"
                          value={profileData.certifications}
                          onChange={(e) => setProfileData({ ...profileData, certifications: e.target.value })}
                          placeholder="e.g. AWS Solutions Architect, Google Analytics"
                          className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {isProfessional && (
                    <div className="border-t border-brand-medium/50 pt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-brand-accent">Work Experience</h3>
                        <button
                          type="button"
                          onClick={handleAddExperience}
                          className="text-xs text-brand-purple hover:text-brand-accent flex items-center gap-1 font-semibold"
                        >
                          <FaPlus className="w-2.5 h-2.5" /> Add Job Role
                        </button>
                      </div>
                      {workExperience.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">No work experience listed. Click 'Add Job Role' to add one.</p>
                      ) : (
                        <div className="space-y-4">
                          {workExperience.map((exp, idx) => (
                            <div key={idx} className="bg-brand-medium/20 border border-white/5 p-4 rounded-xl space-y-3 relative">
                              <button
                                type="button"
                                onClick={() => handleRemoveExperience(idx)}
                                className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                              >
                                <FaTrash className="w-3 h-3" />
                              </button>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-400 mb-1">Company *</label>
                                  <input
                                    type="text"
                                    required
                                    value={exp.company}
                                    onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                                    placeholder="e.g. Google"
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-400 mb-1">Role / Job Title *</label>
                                  <input
                                    type="text"
                                    required
                                    value={exp.role}
                                    onChange={(e) => handleExperienceChange(idx, 'role', e.target.value)}
                                    placeholder="e.g. Lead Frontend Engineer"
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-400 mb-1">From (YYYY-MM) *</label>
                                  <input
                                    type="text"
                                    required
                                    value={exp.from}
                                    onChange={(e) => handleExperienceChange(idx, 'from', e.target.value)}
                                    placeholder="e.g. 2022-03"
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-400 mb-1">To (YYYY-MM or empty for 'Present')</label>
                                  <input
                                    type="text"
                                    value={exp.to || ''}
                                    onChange={(e) => handleExperienceChange(idx, 'to', e.target.value || null)}
                                    placeholder="e.g. 2024-06"
                                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-400 mb-1">Description / Responsibilities</label>
                                <textarea
                                  value={exp.description}
                                  onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)}
                                  placeholder="Describe your achievements and daily tasks..."
                                  className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none min-h-[60px] resize-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="flex items-center space-x-1 px-4 py-2 border border-brand-medium rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="flex items-center space-x-1 px-4 py-2 bg-brand-purple rounded-xl text-xs font-semibold text-white hover:bg-opacity-90 transition-all disabled:opacity-50"
                    >
                      <FaSave />
                      <span>{saveLoading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Network & Extra info (Only show if not editing, to keep it clean) */}
        {!isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left: Skills & Education */}
            <div className="glassmorphism p-6 rounded-2xl md:col-span-1 space-y-6">
              {/* Skills */}
              <div>
                <h3 className="text-md font-bold mb-3 flex items-center space-x-2">
                  <FaListUl className="text-brand-purple" />
                  <span>Skills</span>
                </h3>
                {user.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 rounded-xl bg-brand-medium text-brand-accent text-[11px] font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No skills added yet.</p>
                )}
              </div>

              {/* Education */}
              {isProfessional && (
                <div className="border-t border-brand-medium/40 pt-4">
                  <h3 className="text-md font-bold mb-3 flex items-center space-x-2">
                    <FaGraduationCap className="text-brand-purple" />
                    <span>Education</span>
                  </h3>
                  {user.education?.college ? (
                    <div className="text-xs space-y-2">
                      <div>
                        <p className="font-semibold text-white">{user.education.college}</p>
                        {user.education.cgpa && (
                          <p className="text-gray-400 mt-0.5">CGPA: {user.education.cgpa}</p>
                        )}
                      </div>
                      {user.education.certifications?.length > 0 && (
                        <div className="pt-1">
                          <p className="font-semibold text-gray-300 text-[10px] uppercase tracking-wider flex items-center gap-1 mb-1">
                            <FaCertificate className="text-brand-accent" /> Certifications
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.education.certifications.map((cert, i) => (
                              <span key={i} className="text-[9px] bg-brand-medium/55 px-1.5 py-0.5 rounded text-gray-300">{cert}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No education info added yet.</p>
                  )}
                </div>
              )}

              {/* Resume */}
              {isProfessional && (
                <div className="border-t border-brand-medium/40 pt-4 space-y-3">
                  <h3 className="text-md font-bold mb-2 flex items-center space-x-2">
                    <FaFilePdf className="text-brand-purple" />
                    <span>Resume</span>
                  </h3>
                  {user.resume?.name ? (
                    <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <FaFilePdf className="text-red-400 shrink-0 w-4 h-4" />
                        <span className="text-xs font-semibold text-gray-200 truncate flex-1">{user.resume.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDownloadResume}
                          className="flex-1 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 rounded-lg text-[10px] font-bold transition-all"
                        >
                          View/Download
                        </button>
                        <button
                          onClick={handleDeleteResume}
                          className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[10px] font-bold transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-brand-medium/60 rounded-xl p-4 text-center cursor-pointer hover:border-violet-500/40 transition-colors relative">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeUpload}
                        disabled={resumeUploading}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <FaFileUpload className="text-gray-500 mx-auto w-6 h-6 mb-2" />
                      <p className="text-[10px] text-gray-400 font-semibold">
                        {resumeUploading ? 'Uploading...' : 'Upload PDF Resume (Max 2MB)'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Experience, Posts, Requests or Connections */}
            <div className="glassmorphism p-6 rounded-2xl md:col-span-2 space-y-6">
              
              {isProfessional ? (
                <div className="space-y-6">
                  {/* Tab Navigation */}
                  <div className="flex border-b border-brand-medium/40">
                    <button
                      onClick={() => setActiveTab('experience')}
                      className={`flex-1 pb-3 text-xs font-bold transition-colors border-b-2 text-center ${
                        activeTab === 'experience'
                          ? 'border-brand-purple text-white'
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      Experience
                    </button>
                    <button
                      onClick={() => { setActiveTab('posts'); fetchUserPosts(); }}
                      className={`flex-1 pb-3 text-xs font-bold transition-colors border-b-2 text-center ${
                        activeTab === 'posts'
                          ? 'border-brand-purple text-white'
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      My Posts ({userPosts.length})
                    </button>
                    <button
                      onClick={() => { setActiveTab('requests'); fetchFollowRequests(); }}
                      className={`flex-1 pb-3 text-xs font-bold transition-colors border-b-2 text-center relative ${
                        activeTab === 'requests'
                          ? 'border-brand-purple text-white'
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      Requests
                      {followRequests.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold">
                          {followRequests.length}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Tab Panels */}
                  {activeTab === 'experience' && (
                    <div>
                      {user.workExperience && user.workExperience.length > 0 ? (
                        <div className="relative border-l border-brand-medium/60 ml-2.5 pl-6 space-y-6">
                          {user.workExperience.map((exp, index) => (
                            <div key={index} className="relative">
                              <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-brand-purple border-2 border-brand-dark" />
                              <div>
                                <h4 className="font-bold text-white text-sm">{exp.role}</h4>
                                <p className="text-xs text-brand-accent mt-0.5">{exp.company}</p>
                                <p className="text-[10px] text-gray-500 mt-1">
                                  {exp.from} — {exp.to || 'Present'}
                                </p>
                                {exp.description && (
                                  <p className="text-xs text-gray-300 mt-2 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">No work experience listed yet.</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'posts' && (
                    <div className="space-y-4">
                      {postsLoading ? (
                        <div className="text-center py-6 text-gray-500 text-sm">Loading posts...</div>
                      ) : userPosts.length === 0 ? (
                        <p className="text-xs text-gray-400 italic text-center py-6">You haven't posted anything yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {userPosts.map(post => (
                            <div key={post._id} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                              <p className="text-xs text-gray-200 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                              <div className="flex justify-between items-center text-[10px] text-gray-500 pt-2 border-t border-white/5">
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
                    <div className="space-y-4">
                      {requestsLoading ? (
                        <div className="text-center py-6 text-gray-500 text-sm">Loading requests...</div>
                      ) : followRequests.length === 0 ? (
                        <p className="text-xs text-gray-400 italic text-center py-6">No pending connection requests.</p>
                      ) : (
                        <div className="space-y-3">
                          {followRequests.map(req => (
                            <div key={req._id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={req.senderId?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${req.senderId?.name}`}
                                  alt=""
                                  className="w-10 h-10 rounded-full border border-brand-purple bg-brand-medium"
                                />
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-white truncate">{req.senderId?.name}</h4>
                                  <p className="text-[10px] text-gray-400 truncate">{req.senderId?.headline || 'Professional'}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() => handleAcceptRequest(req._id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                                >
                                  <FaCheck /> Accept
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(req._id)}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                                >
                                  <FaTimes /> Reject
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
                // Company View
                <div>
                  <h3 className="text-md font-bold mb-4 flex items-center space-x-2">
                    <FaBuilding className="text-brand-purple" />
                    <span>Company Overview</span>
                  </h3>
                  <p className="text-xs text-gray-400 italic">Explore your network contacts below.</p>
                </div>
              )}

              {/* Connections (For all types) */}
              <div className={isProfessional ? "border-t border-brand-medium/40 pt-6" : ""}>
                <h3 className="text-md font-bold mb-4 flex items-center space-x-2">
                  <FaUserFriends className="text-brand-purple" />
                  <span>Network Contacts</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {/* Followers */}
                  <div className="bg-brand-medium/20 p-4 rounded-xl">
                    <h4 className="font-bold text-white mb-2">Followers ({followersList.length})</h4>
                    {followersList.length === 0 ? (
                      <p className="text-gray-500 text-[10px]">No followers yet.</p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {followersList.map((f) => (
                          <div key={f._id} className="flex items-center space-x-2 border-b border-brand-medium/20 pb-1.5 last:border-0 last:pb-0">
                            <img
                              src={f.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${f.name}`}
                              className="w-6 h-6 rounded-full border border-brand-purple bg-brand-medium"
                              alt=""
                            />
                            <div className="truncate">
                              <div className="font-semibold text-white truncate max-w-[120px]">{f.name}</div>
                              <div className="text-[9px] text-gray-400 truncate max-w-[120px]">{f.headline || 'Professional'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Following */}
                  <div className="bg-brand-medium/20 p-4 rounded-xl">
                    <h4 className="font-bold text-white mb-2">Following ({followingList.length})</h4>
                    {followingList.length === 0 ? (
                      <p className="text-gray-500 text-[10px]">Not following anyone yet.</p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {followingList.map((f) => (
                          <div key={f._id} className="flex items-center space-x-2 border-b border-brand-medium/20 pb-1.5 last:border-0 last:pb-0">
                            <img
                              src={f.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${f.name}`}
                              className="w-6 h-6 rounded-full border border-brand-purple bg-brand-medium"
                              alt=""
                            />
                            <div className="truncate">
                              <div className="font-semibold text-white truncate max-w-[120px]">{f.name}</div>
                              <div className="text-[9px] text-gray-400 truncate max-w-[120px]">{f.headline || 'Professional'}</div>
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
