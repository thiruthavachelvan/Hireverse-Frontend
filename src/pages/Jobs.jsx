import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaDollarSign, FaBuilding, FaSearch,
  FaLayerGroup, FaBriefcase, FaCheckCircle,
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const VerifiedBadge = ({ status }) => {
  if (status === 'verified') return (
    <span className="flex items-center gap-1 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full">
      <MdVerified className="w-3 h-3" /> Verified
    </span>
  );
  if (status === 'pending') return (
    <span className="text-xs text-amber-400/70 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 rounded-full">Pending</span>
  );
  return null;
};

const Jobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterVerified, setFilterVerified] = useState(false);

  useEffect(() => {
    fetchJobsAndApplications();
  }, []);

  const fetchJobsAndApplications = async () => {
    try {
      setLoading(true);
      const jobsRes = await api.get('/jobs');
      setJobs(jobsRes.data);

      if (user?.accountType === 'professional') {
        const appsRes = await api.get('/applications/my-applications');
        const appliedIds = new Set(appsRes.data.map((app) => app.jobId?._id));
        setAppliedJobIds(appliedIds);
      }
    } catch {
      setError('Failed to retrieve job postings.');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    const matchSearch =
      job.jobTitle.toLowerCase().includes(query) ||
      job.companyId?.name?.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      (job.requiredSkills || []).some((s) => s.toLowerCase().includes(query));
    const matchType = filterType === 'all' || job.jobType === filterType;
    const matchVerified = !filterVerified || job.companyId?.verificationStatus === 'verified';
    return matchSearch && matchType && matchVerified;
  });

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-brand-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white px-4 md:px-8 py-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
            {error}
            <button className="ml-4 underline" onClick={() => setError('')}>Dismiss</button>
          </div>
        )}

        {/* Header */}
        <div className="border-b border-brand-medium/50 pb-4">
          <h1 className="text-3xl font-extrabold text-white">Explore Jobs</h1>
          <p className="text-sm text-gray-400 mt-1">{jobs.length} opportunities from registered companies.</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, company, skills, location..."
              className="block w-full pl-9 pr-3 py-2.5 bg-brand-medium/30 border border-brand-medium rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-purple text-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-brand-medium/30 border border-brand-medium rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple"
          >
            <option value="all">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterVerified}
              onChange={e => setFilterVerified(e.target.checked)}
              className="w-4 h-4 accent-violet-500 rounded"
            />
            <MdVerified className="text-emerald-400 w-4 h-4" />
            Verified only
          </label>
        </div>

        {/* Job Grid */}
        {filteredJobs.length === 0 ? (
          <div className="glassmorphism p-12 rounded-2xl text-center text-gray-400">
            <FaBriefcase className="w-10 h-10 mx-auto mb-3 text-gray-600" />
            <p className="text-lg font-bold">No jobs found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => {
              const hasApplied = appliedJobIds.has(job._id);
              const isVerified = job.companyId?.verificationStatus === 'verified';
              return (
                <div
                  key={job._id}
                  className="glassmorphism p-6 rounded-2xl flex flex-col justify-between hover:border-violet-500/30 transition-all cursor-pointer group"
                  onClick={() => navigate(`/jobs/${job._id}`)}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start space-x-3 mb-3">
                      <img
                        src={job.companyId?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${job.companyId?.name}`}
                        alt={job.companyId?.name}
                        className="w-12 h-12 rounded-xl border border-brand-purple bg-brand-medium object-contain"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-extrabold text-white leading-tight group-hover:text-violet-300 transition-colors">{job.jobTitle}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-brand-accent font-medium">
                            <FaBuilding className="text-[10px]" />{job.companyId?.name || 'Company'}
                          </span>
                          <VerifiedBadge status={job.companyId?.verificationStatus} />
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1 bg-brand-medium/30 px-2 py-1 rounded-lg">
                        <FaMapMarkerAlt className="text-brand-purple" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1 bg-brand-medium/30 px-2 py-1 rounded-lg">
                        <FaDollarSign className="text-emerald-400" /> {job.salary}
                      </span>
                      <span className="flex items-center gap-1 bg-brand-medium/30 px-2 py-1 rounded-lg">
                        <FaBriefcase className="text-blue-400" /> {job.jobType || 'Full-time'}
                      </span>
                      {job.rounds?.length > 0 && (
                        <span className="flex items-center gap-1 bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2 py-1 rounded-lg">
                          <FaLayerGroup className="w-3 h-3" /> {job.rounds.length} Round{job.rounds.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-300 leading-relaxed mb-3 line-clamp-2">{job.description}</p>

                    {/* Skills */}
                    {job.requiredSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.requiredSkills.slice(0, 4).map((skill) => (
                          <span key={skill} className="px-2 py-0.5 text-[10px] bg-brand-medium/60 border border-brand-medium text-gray-300 rounded-lg">
                            {skill}
                          </span>
                        ))}
                        {job.requiredSkills.length > 4 && (
                          <span className="text-[10px] text-gray-500 px-1">+{job.requiredSkills.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/jobs/${job._id}`); }}
                      className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
                        hasApplied
                          ? 'bg-emerald-600/20 border border-emerald-600/40 text-emerald-400 cursor-default'
                          : 'bg-brand-purple hover:bg-opacity-90 text-white shadow-brand-purple/20'
                      }`}
                    >
                      {hasApplied ? (
                        <span className="flex items-center justify-center gap-1.5"><FaCheckCircle /> Applied</span>
                      ) : 'View & Apply'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
