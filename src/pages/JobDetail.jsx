import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FaBuilding, FaMapMarkerAlt, FaDollarSign, FaCheckCircle,
  FaClock, FaArrowLeft, FaBriefcase, FaCode, FaLayerGroup,
  FaTimesCircle,
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const VerifiedBadge = ({ status }) => {
  if (status === 'verified') return (
    <span className="flex items-center gap-1.5 text-sm bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-medium">
      <MdVerified className="w-4 h-4" /> HireVerse Verified Company
    </span>
  );
  return (
    <span className="flex items-center gap-1.5 text-sm bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full">
      <FaClock className="w-3.5 h-3.5" /> Verification Pending
    </span>
  );
};

const ApplicationModal = ({ job, onClose, onSuccess }) => {
  const [answers, setAnswers] = useState(() =>
    (job.applicationForm || []).map(q => ({ question: q.question, answer: '' }))
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAnswer = (idx, val) => {
    setAnswers(prev => prev.map((a, i) => i === idx ? { ...a, answer: val } : a));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Validate required questions
    for (let i = 0; i < (job.applicationForm || []).length; i++) {
      if (job.applicationForm[i].required && !answers[i]?.answer?.trim()) {
        setError(`Please answer the required question: "${job.applicationForm[i].question}"`);
        return;
      }
    }
    setSubmitting(true);
    try {
      await api.post('/applications', { jobId: job._id, formAnswers: answers });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#1a1a2e] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Apply for {job.jobTitle}</h2>
            <p className="text-gray-400 text-sm mt-0.5">{job.companyId?.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
            <FaTimesCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {job.applicationForm?.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No additional questions. Click submit to apply.</p>
          ) : (
            (job.applicationForm || []).map((q, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {q.question}
                  {q.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <textarea
                  rows={3}
                  value={answers[idx]?.answer || ''}
                  onChange={e => handleAnswer(idx, e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none transition-colors"
                  placeholder="Your answer..."
                />
              </div>
            ))
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-5 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/20"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isProfessional } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
        // Check if already applied
        if (isProfessional) {
          try {
            const appsRes = await api.get('/applications/my-applications');
            const alreadyApplied = appsRes.data.some(a => a.jobId?._id === id || a.jobId === id);
            setApplied(alreadyApplied);
          } catch { /* ignore */ }
        }
      } catch {
        navigate('/jobs');
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
    </div>
  );

  if (!job) return null;

  const company = job.companyId;
  const isVerified = company?.verificationStatus === 'verified';

  return (
    <div className="min-h-screen bg-brand-dark px-4 py-8">
      {showApplyModal && (
        <ApplicationModal
          job={job}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            setApplied(true);
            setApplySuccess(true);
          }}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <FaArrowLeft /> Back to Jobs
        </button>

        {/* Success Banner */}
        {applySuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-5 py-4 rounded-xl flex items-center gap-3">
            <FaCheckCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Application submitted successfully!</p>
              <p className="text-sm text-emerald-300/80 mt-0.5">The company will review your answers and respond soon.</p>
            </div>
          </div>
        )}

        {/* Job Header */}
        <div className="glassmorphism rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            <img
              src={company?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${company?.name}`}
              alt={company?.name}
              className="w-16 h-16 rounded-2xl border border-white/10 bg-brand-medium"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-white">{job.jobTitle}</h1>
                  <p className="text-gray-400 mt-1 flex items-center gap-1.5">
                    <FaBuilding className="text-violet-400 w-3.5 h-3.5" />
                    {company?.name}
                  </p>
                </div>
                <VerifiedBadge status={company?.verificationStatus} />
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-violet-400" /> {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaDollarSign className="text-emerald-400" /> {job.salary}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaBriefcase className="text-blue-400" /> {job.jobType}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaLayerGroup className="text-pink-400" /> {job.rounds?.length || 0} Round{job.rounds?.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          {isProfessional && (
            <div className="mt-5 pt-5 border-t border-white/10">
              {applied ? (
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <FaCheckCircle /> Already applied
                </div>
              ) : !job.isActive ? (
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <FaTimesCircle /> This job listing is closed
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
                >
                  Apply Now
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div className="glassmorphism rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Job Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>

            {/* Required Skills */}
            {job.requiredSkills?.length > 0 && (
              <div className="glassmorphism rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FaCode className="text-violet-400" /> Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map(skill => (
                    <span key={skill} className="bg-violet-500/15 text-violet-300 border border-violet-500/25 px-3 py-1.5 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Application Form Preview */}
            {job.applicationForm?.length > 0 && (
              <div className="glassmorphism rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Application Form</h2>
                <p className="text-gray-400 text-sm mb-4">You will need to answer these questions when applying:</p>
                <div className="space-y-3">
                  {job.applicationForm.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white/3 rounded-xl p-4 border border-white/5">
                      <span className="text-violet-400 font-bold text-sm mt-0.5 shrink-0">Q{idx + 1}</span>
                      <div>
                        <p className="text-gray-200 text-sm">{q.question}</p>
                        {q.required && <span className="text-xs text-red-400 mt-1 block">Required</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hiring Rounds */}
            <div className="glassmorphism rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaLayerGroup className="text-violet-400" /> Hiring Process
              </h2>
              {job.rounds?.length === 0 ? (
                <p className="text-gray-400 text-sm">No rounds specified</p>
              ) : (
                <div className="space-y-3">
                  {job.rounds.map((round, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 text-xs font-bold shrink-0">
                        {round.roundNumber}
                      </div>
                      <div className="flex-1 h-px bg-violet-500/20" style={{ display: idx < job.rounds.length - 1 ? 'none' : 'block' }} />
                      <p className="text-gray-300 text-sm font-medium">{round.name}</p>
                    </div>
                  ))}
                  {/* Visual timeline */}
                  <div className="mt-4 relative pl-4">
                    {job.rounds.map((round, idx) => (
                      <div key={idx} className="relative flex gap-3 pb-4 last:pb-0">
                        {idx < job.rounds.length - 1 && (
                          <div className="absolute left-2.5 top-6 w-px h-full bg-violet-500/20" />
                        )}
                        <div className="w-5 h-5 rounded-full bg-violet-600 border-2 border-violet-400 flex-shrink-0 mt-0.5 z-10" />
                        <div>
                          <p className="text-white text-sm font-semibold">{round.name}</p>
                          <p className="text-gray-500 text-xs">Round {round.roundNumber}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="glassmorphism rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">About the Company</h2>
              <div className="space-y-2 text-sm text-gray-400">
                {company?.companyDetails?.industry && <p><span className="text-gray-300">Industry:</span> {company.companyDetails.industry}</p>}
                {company?.companyDetails?.size && <p><span className="text-gray-300">Size:</span> {company.companyDetails.size}</p>}
                {company?.companyDetails?.website && (
                  <p>
                    <a href={company.companyDetails.website} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 underline">
                      {company.companyDetails.website}
                    </a>
                  </p>
                )}
                {company?.bio && <p className="mt-2 text-gray-300 leading-relaxed">{company.bio}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
