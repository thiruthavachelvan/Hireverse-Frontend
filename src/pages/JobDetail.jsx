import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building2, MapPin, DollarSign, CheckCircle2,
  Clock, ArrowLeft, Briefcase, Code, Layers,
  XCircle, ExternalLink, Megaphone, FileText, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VerifiedBadge = ({ status }) => {
  if (status === 'verified') return (
    <span className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full font-bold">
      <CheckCircle2 size={13} className="text-emerald-500" /> HireVerse Partner
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-full font-bold">
      <Clock size={13} className="text-amber-500" /> Verification Pending
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-black text-hv-text">Apply for {job.jobTitle}</h2>
            <p className="text-xs text-hv-muted font-bold mt-0.5">{job.companyId?.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-hv-subtle hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {job.applicationForm?.length === 0 ? (
            <p className="text-hv-muted text-sm text-center py-4">No additional questions. Click submit to apply.</p>
          ) : (
            (job.applicationForm || []).map((q, idx) => (
              <div key={idx} className="space-y-1.5">
                <label className="block text-sm font-semibold text-hv-text">
                  {q.question}
                  {q.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <textarea
                  rows={3}
                  value={answers[idx]?.answer || ''}
                  onChange={e => handleAnswer(idx, e.target.value)}
                  className="input-field min-h-[80px] resize-none pt-2"
                  placeholder="Type your response here..."
                />
              </div>
            ))
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1 py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1 py-3"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </motion.div>
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
  }, [id, isProfessional, navigate]);

  if (loading) return (
    <div className="flex min-h-[80vh] items-center justify-center bg-hv-bg">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 rounded-full border-2 border-transparent"
        style={{ borderTopColor: '#8B5CF6', borderRightColor: '#FF6B6B' }}
      />
    </div>
  );

  if (!job) return null;

  const company = job.companyId;

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 relative">
      <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />

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

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* Back */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-1.5 text-hv-muted hover:text-hv-text transition-colors text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft size={15} /> Back to Jobs
        </button>

        {/* Success Banner */}
        {applySuccess && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-bold text-sm">Application submitted successfully!</p>
              <p className="text-xs text-emerald-600/80 mt-0.5 font-medium">The company will review your answers and contact you shortly.</p>
            </div>
          </div>
        )}

        {/* Job Header Card */}
        <div className="card-static p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
            <div className="flex items-start gap-4">
              <img
                src={company?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(company?.name || '')}`}
                alt={company?.name}
                className="w-14 h-14 rounded-2xl border border-gray-100 bg-gray-50 object-contain flex-shrink-0"
              />
              <div>
                <h1 className="text-2xl font-black text-hv-text leading-snug">{job.jobTitle}</h1>
                <p className="text-sm font-bold text-hv-violet mt-1 flex items-center gap-1.5">
                  <Building2 size={14} /> {company?.name}
                </p>
              </div>
            </div>
            
            <div className="flex-shrink-0 mt-2 md:mt-0">
              <VerifiedBadge status={company?.verificationStatus} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            <span className="chip chip-gray">
              <MapPin size={11} className="text-hv-subtle" /> {job.location}
            </span>
            <span className="chip chip-success font-bold">
              <DollarSign size={11} /> {job.salary}
            </span>
            <span className="chip chip-violet font-semibold">
              <Briefcase size={11} /> {job.jobType}
            </span>
            <span className="chip chip-coral">
              <Layers size={11} /> {job.rounds?.length || 0} Rounds
            </span>
          </div>

          {/* Apply Button */}
          {isProfessional && (
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              {applied ? (
                <div className="flex items-center gap-1.5 px-4 py-2 border border-emerald-100 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold">
                  <CheckCircle2 size={14} /> Already applied
                </div>
              ) : !job.isActive ? (
                <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 border border-gray-200 text-hv-muted rounded-xl text-xs font-bold">
                  <XCircle size={14} /> This job listing is closed
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="btn-primary px-8 py-3"
                >
                  Apply Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content Split */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Description details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Description */}
            <div className="card-static p-6 space-y-4">
              <h2 className="text-lg font-bold text-hv-text">Job Description</h2>
              <p className="text-hv-muted text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>

            {/* Required Skills */}
            {job.requiredSkills?.length > 0 && (
              <div className="card-static p-6 space-y-4">
                <h2 className="text-lg font-bold text-hv-text flex items-center gap-1.5">
                  <Code size={18} className="text-hv-violet" /> Required Skills
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map(skill => (
                    <span key={skill} className="chip chip-violet font-semibold text-xs py-1 px-3">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Application Questions preview */}
            {job.applicationForm?.length > 0 && (
              <div className="card-static p-6 space-y-4">
                <h2 className="text-lg font-bold text-hv-text flex items-center gap-1.5">
                  <FileText size={18} className="text-hv-violet" /> Application Form Questions
                </h2>
                <p className="text-xs text-hv-muted font-bold uppercase tracking-wider">Required responses to apply</p>
                <div className="space-y-3">
                  {job.applicationForm.map((q, idx) => (
                    <div key={idx} className="flex gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <span className="text-hv-violet font-extrabold text-xs mt-0.5 shrink-0">Q{idx + 1}</span>
                      <div>
                        <p className="text-hv-text text-sm font-semibold leading-relaxed">{q.question}</p>
                        {q.required && <span className="chip chip-coral text-[9px] mt-1.5 px-2 py-0">Required</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar details */}
          <div className="space-y-6">
            
            {/* Hiring pipeline list */}
            <div className="card-static p-6 space-y-4">
              <h2 className="text-lg font-bold text-hv-text flex items-center gap-1.5">
                <Layers size={18} className="text-hv-violet" /> Hiring Process
              </h2>
              {job.rounds?.length === 0 ? (
                <p className="text-xs text-hv-muted italic">No hiring rounds specified.</p>
              ) : (
                <div className="relative pl-4 space-y-4">
                  {job.rounds.map((round, idx) => (
                    <div key={idx} className="relative flex gap-3 pb-3 last:pb-0">
                      {idx < job.rounds.length - 1 && (
                        <div className="absolute left-2 top-6 w-0.5 h-full bg-violet-100" />
                      )}
                      <div className="w-4.5 h-4.5 rounded-full bg-hv-violet border border-violet-200 flex-shrink-0 mt-1 z-10 animate-pulse-glow" />
                      <div>
                        <p className="text-hv-text text-sm font-bold leading-tight">{round.name}</p>
                        <p className="text-hv-subtle text-[10px] uppercase font-bold mt-0.5">Round {round.roundNumber}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* About Company Mini Card */}
            <div className="card-static p-6 space-y-4">
              <h2 className="text-lg font-bold text-hv-text">About the Company</h2>
              <div className="space-y-2.5 text-xs text-hv-muted">
                {company?.companyDetails?.industry && <p><strong className="text-hv-text">Industry:</strong> {company.companyDetails.industry}</p>}
                {company?.companyDetails?.size && <p><strong className="text-hv-text">Size:</strong> {company.companyDetails.size} employees</p>}
                {company?.companyDetails?.website && (
                  <p>
                    <a href={company.companyDetails.website} target="_blank" rel="noopener noreferrer" className="text-hv-violet hover:opacity-80 underline flex items-center gap-1 font-bold">
                      Visit Website <ExternalLink size={10} />
                    </a>
                  </p>
                )}
                {company?.bio && <p className="pt-2 border-t border-gray-100 leading-relaxed text-hv-muted">{company.bio}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
