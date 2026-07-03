import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, DollarSign, Briefcase, CheckCircle, Search,
  Filter, Layers, Sparkles
} from 'lucide-react';
import { SkeletonJobCard } from '../components/SkeletonLoader';

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
      (job.requiredSkills || []).some((s) => s?.toLowerCase().includes(query));
    const matchType = filterType === 'all' || job.jobType === filterType;
    const matchVerified = !filterVerified || job.companyId?.verificationStatus === 'verified';
    return matchSearch && matchType && matchVerified;
  });

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 relative">
      <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm text-center flex items-center justify-between">
            <span>{error}</span>
            <button className="underline font-bold text-xs" onClick={() => setError('')}>Dismiss</button>
          </div>
        )}

        {/* Header */}
        <div className="border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-black text-hv-text">Explore Jobs</h1>
          <p className="text-sm text-hv-muted mt-1 font-medium">{jobs.length} opportunities from registered partners.</p>
        </div>

        {/* Search + Filters (redesigned) */}
        <div className="card-static p-4 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, company, skills, location..."
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex gap-3 flex-wrap items-center">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="input-field py-2 text-sm w-40"
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>

            <button
              onClick={() => setFilterVerified(v => !v)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                filterVerified
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                  : 'border-gray-200 bg-white text-hv-muted hover:border-gray-300'
              }`}
            >
              <CheckCircle size={14} className={filterVerified ? 'text-emerald-500' : 'text-gray-400'} />
              Partner Verified
            </button>
          </div>
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonJobCard key={i} />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="card p-16 text-center max-w-md mx-auto space-y-4">
            <Briefcase className="w-16 h-16 text-hv-subtle mx-auto animate-float" />
            <div>
              <p className="text-lg font-bold text-hv-text">No jobs found</p>
              <p className="text-sm text-hv-muted mt-1">Try adjusting your filters or search keywords.</p>
            </div>
            <button
              onClick={() => { setSearchQuery(''); setFilterType('all'); setFilterVerified(false); }}
              className="btn-ghost py-2 text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredJobs.map((job) => {
              const hasApplied = appliedJobIds.has(job._id);
              const isVerified = job.companyId?.verificationStatus === 'verified';
              return (
                <motion.div
                  key={job._id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="card p-6 flex flex-col justify-between cursor-pointer"
                  onClick={() => navigate(`/jobs/${job._id}`)}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={job.companyId?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(job.companyId?.name || '')}`}
                        alt={job.companyId?.name}
                        className="w-11 h-11 rounded-xl object-contain border border-gray-100 bg-gray-50 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-hv-text leading-snug group-hover:text-hv-violet transition-colors text-base line-clamp-1">{job.jobTitle}</h3>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-xs text-hv-muted font-bold">{job.companyId?.name || 'Company'}</span>
                          {isVerified && (
                            <span className="chip chip-success text-[9px] px-1.5 py-0">Verified</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap gap-2 text-xs mb-4">
                      <span className="chip chip-gray">
                        <MapPin size={11} /> {job.location}
                      </span>
                      <span className="chip chip-success font-bold">
                        <DollarSign size={11} /> {job.salary}
                      </span>
                      <span className="chip chip-violet font-semibold">
                        <Briefcase size={11} /> {job.jobType || 'Full-time'}
                      </span>
                      {job.rounds?.length > 0 && (
                        <span className="chip chip-coral">
                          <Layers size={11} /> {job.rounds.length} Round{job.rounds.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-hv-muted leading-relaxed mb-4 line-clamp-2">{job.description}</p>

                    {/* Skills */}
                    {job.requiredSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {job.requiredSkills.slice(0, 3).map((skill) => (
                          <span key={skill} className="px-2 py-0.5 text-[10px] font-semibold bg-gray-50 border border-gray-100 text-hv-muted rounded-lg">
                            {skill}
                          </span>
                        ))}
                        {job.requiredSkills.length > 3 && (
                          <span className="text-[10px] text-hv-subtle font-semibold px-1">+{job.requiredSkills.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-2">
                    {hasApplied ? (
                      <div className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-emerald-200 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold">
                        <CheckCircle size={14} className="text-emerald-500" /> Applied
                      </div>
                    ) : (
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/jobs/${job._id}`); }}
                        className="btn-primary w-full py-2.5 text-xs"
                      >
                        View & Apply <Sparkles size={12} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
