import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import {
  FaBriefcase, FaPlusCircle, FaMapMarkerAlt, FaDollarSign,
  FaLayerGroup, FaPlus, FaTrash, FaCalendarAlt, FaCheckCircle,
  FaTimesCircle, FaChevronDown, FaChevronUp, FaClipboardList,
  FaTrophy, FaHourglassHalf, FaToggleOn, FaToggleOff, FaFilePdf, FaBullhorn
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

// ─── Status chip for applicants ─────────────────────────────────────────────
const StatusChip = ({ status }) => {
  const cfg = {
    submitted:    { cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Submitted' },
    under_review: { cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Under Review' },
    in_round:     { cls: 'bg-violet-500/20 text-violet-400 border-violet-500/30', label: 'In Round' },
    hired:        { cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Hired' },
    rejected:     { cls: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Not Selected' },
  }[status] || { cls: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: status };
  return (
    <span className={`text-xs font-medium border px-2.5 py-1 rounded-full ${cfg.cls}`}>{cfg.label}</span>
  );
};

// ─── Applicant Card (company view) ──────────────────────────────────────────
const ApplicantCard = ({ app, job, onAction }) => {
  const [expanded, setExpanded] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    roundNumber: app.currentRound || 1,
    scheduledAt: '',
    venue: '',
    notes: '',
    hasAssessment: false,
    assessmentType: 'Aptitude MCQ',
    numQuestions: 20,
    diffEasy: 40,
    diffMedium: 40,
    diffHard: 20,
    duration: 45,
    startTime: '',
    endTime: '',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState('');

  const doAction = async (endpoint, body = {}) => {
    setActionLoading(true);
    try {
      const { data } = await api.put(`/applications/${app._id}/${endpoint}`, body);
      onAction(app._id, data.application);
      if (toast) setToast('');
      setToast('✓ Done');
      setTimeout(() => setToast(''), 2000);
    } catch (err) {
      setToast(err.response?.data?.message || 'Action failed');
    }
    setActionLoading(false);
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!scheduleData.scheduledAt) return;
    const payload = {
      roundNumber: scheduleData.roundNumber,
      scheduledAt: scheduleData.scheduledAt,
      venue: scheduleData.venue,
      notes: scheduleData.notes,
      hasAssessment: scheduleData.hasAssessment,
      assessmentDetails: scheduleData.hasAssessment ? {
        assessmentType: scheduleData.assessmentType,
        numQuestions: scheduleData.numQuestions,
        difficulty: { easy: scheduleData.diffEasy, medium: scheduleData.diffMedium, hard: scheduleData.diffHard },
        duration: scheduleData.duration,
        startTime: scheduleData.startTime,
        endTime: scheduleData.endTime,
      } : undefined,
    };
    await doAction('schedule-round', payload);
    setShowScheduler(false);
  };

  const totalRounds = job?.rounds?.length || 0;
  const isInRound = app.status === 'in_round';
  const isHired = app.status === 'hired';
  const isRejected = app.status === 'rejected';
  const isSubmitted = app.status === 'submitted';
  const canAdvance = isInRound && app.currentRound < totalRounds;
  const canHire = isInRound && app.currentRound === totalRounds;

  return (
    <div className={`bg-brand-medium/20 border rounded-2xl overflow-hidden transition-all ${
      isHired ? 'border-emerald-500/30' : isRejected ? 'border-red-500/10 opacity-60' : 'border-white/5'
    }`}>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
        <img
          src={app.applicantId?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${app.applicantId?.name}`}
          alt={app.applicantId?.name}
          className="w-10 h-10 rounded-full border border-brand-purple bg-brand-medium flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <Link to={`/profile/${app.applicantId?._id}`} className="font-semibold text-sm text-white hover:text-brand-purple transition-colors">{app.applicantId?.name}</Link>
          <p className="text-gray-400 text-xs">{app.applicantId?.headline || app.applicantId?.email}</p>
          {app.applicantId?.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {app.applicantId.skills.slice(0, 4).map(s => (
                <span key={s} className="text-[9px] bg-brand-medium px-1.5 py-0.5 rounded text-gray-300">{s}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusChip status={app.status} />
          {isInRound && (
            <span className="text-xs text-violet-300">
              {job?.rounds?.find(r => r.roundNumber === app.currentRound)?.name || `Round ${app.currentRound}`}
            </span>
          )}
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
          {/* Candidate Profile Details */}
          <div className="bg-white/3 rounded-xl p-3 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Candidate Profile</p>
            <div className="text-xs space-y-1">
              {app.applicantId?.employmentStatus && (
                <p className="text-gray-300">
                  <span className="font-semibold text-gray-400">Employment Status:</span>{' '}
                  <span className="capitalize">{app.applicantId.employmentStatus.replace('_', ' ')}</span>
                </p>
              )}
              {app.applicantId?.education && (
                <div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-gray-400">Education:</span>{' '}
                    {app.applicantId.education.college || 'N/A'} (CGPA: {app.applicantId.education.cgpa || 'N/A'})
                  </p>
                  {app.applicantId.education.certifications?.length > 0 && (
                    <p className="text-gray-400 text-[10px]">
                      Certifications: {app.applicantId.education.certifications.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Resume PDF */}
          {app.applicantId?.resume?.data && (
            <div className="bg-white/3 rounded-xl p-3 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Resume</p>
                <p className="text-sm text-gray-300 font-medium">{app.applicantId.resume.name || 'resume.pdf'}</p>
              </div>
              <a
                href={app.applicantId.resume.data}
                download={app.applicantId.resume.name || 'resume.pdf'}
                className="px-3 py-1.5 bg-brand-purple/20 hover:bg-brand-purple/40 text-brand-accent text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <FaFilePdf /> View / Download
              </a>
            </div>
          )}

          {/* Form Answers */}
          {app.formAnswers?.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Application Answers</p>
              <div className="space-y-3">
                {app.formAnswers.map((fa, idx) => (
                  <div key={idx} className="bg-white/3 rounded-xl p-3">
                    <p className="text-gray-300 text-xs font-medium mb-1">Q: {fa.question}</p>
                    <p className="text-white text-sm leading-relaxed">{fa.answer || <em className="text-gray-500">No answer</em>}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Round Schedules */}
          {app.roundSchedules?.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Round Schedules</p>
              <div className="space-y-2">
                {app.roundSchedules.map((rs, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-2">
                    <FaCalendarAlt className="text-violet-400 flex-shrink-0" />
                    <span className="text-violet-300 font-medium">{rs.roundName}:</span>
                    <span className="text-gray-300">
                      {new Date(rs.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    {rs.venue && <span className="text-gray-400">· {rs.venue}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Toast */}
          {toast && <p className={`text-xs font-medium ${toast.startsWith('✓') ? 'text-emerald-400' : 'text-red-400'}`}>{toast}</p>}

          {/* Actions */}
          {!isRejected && !isHired && (
            <div className="flex flex-wrap gap-2">
              {/* Accept (for submitted apps) */}
              {isSubmitted && (
                <button
                  onClick={() => doAction('accept')}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <FaCheckCircle /> Accept to Round 1
                </button>
              )}

              {/* Schedule Round */}
              {isInRound && (
                <button
                  onClick={() => setShowScheduler(v => !v)}
                  className="px-3 py-1.5 bg-violet-600/80 hover:bg-violet-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <FaCalendarAlt /> Schedule Round
                </button>
              )}

              {/* Advance to next round */}
              {canAdvance && (
                <button
                  onClick={() => doAction('advance')}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <FaLayerGroup /> Advance to Next Round
                </button>
              )}

              {/* Mark Hired */}
              {canHire && (
                <button
                  onClick={() => doAction('hire')}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-amber-500/80 hover:bg-amber-400 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <FaTrophy /> Mark as Hired
                </button>
              )}

              {/* Reject */}
              <button
                onClick={() => doAction('reject')}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-red-600/50 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <FaTimesCircle /> Reject
              </button>
            </div>
          )}

          {/* Schedule Round Form */}
          {showScheduler && (
            <form onSubmit={handleSchedule} className="bg-white/3 rounded-xl p-4 space-y-4 border border-white/10">
              <p className="text-sm font-bold text-white">Schedule a Round</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Round</label>
                  <select
                    value={scheduleData.roundNumber}
                    onChange={e => setScheduleData(p => ({ ...p, roundNumber: Number(e.target.value) }))}
                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    {(job?.rounds || []).map(r => (
                      <option key={r.roundNumber} value={r.roundNumber}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduleData.scheduledAt}
                    onChange={e => setScheduleData(p => ({ ...p, scheduledAt: e.target.value }))}
                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Venue / Link</label>
                <input
                  type="text"
                  placeholder="e.g. Office Room 3 / Google Meet link"
                  value={scheduleData.venue}
                  onChange={e => setScheduleData(p => ({ ...p, venue: e.target.value }))}
                  className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Notes for candidate</label>
                <input
                  type="text"
                  placeholder="e.g. Bring your portfolio, prepare for 30 min discussion"
                  value={scheduleData.notes}
                  onChange={e => setScheduleData(p => ({ ...p, notes: e.target.value }))}
                  className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Assessment Toggle */}
              <div className="border-t border-white/10 pt-3">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={scheduleData.hasAssessment}
                    onChange={e => setScheduleData(p => ({ ...p, hasAssessment: e.target.checked }))}
                    className="accent-violet-500 w-4 h-4"
                  />
                  <span className="font-medium">Include Online Assessment for this round</span>
                </label>

                {scheduleData.hasAssessment && (
                  <div className="bg-brand-dark/60 border border-violet-500/20 rounded-xl p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Assessment Type</label>
                        <select
                          value={scheduleData.assessmentType}
                          onChange={e => setScheduleData(p => ({ ...p, assessmentType: e.target.value }))}
                          className="w-full bg-brand-medium/30 border border-brand-medium rounded-md px-2 py-1.5 text-xs text-white focus:outline-none"
                        >
                          <option>Aptitude MCQ</option>
                          <option>Technical MCQ</option>
                          <option>Coding Round</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">No. of Questions</label>
                        <input
                          type="number" min="1" max="50"
                          value={scheduleData.numQuestions}
                          onChange={e => setScheduleData(p => ({ ...p, numQuestions: parseInt(e.target.value) }))}
                          className="w-full bg-brand-medium/30 border border-brand-medium rounded-md px-2 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Difficulty Distribution</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-emerald-400 block mb-0.5">Easy (%)</label>
                          <input type="number" min="0" max="100" value={scheduleData.diffEasy}
                            onChange={e => setScheduleData(p => ({ ...p, diffEasy: parseInt(e.target.value) }))}
                            className="w-full bg-brand-medium/30 border border-brand-medium rounded-md px-2 py-1 text-xs text-white focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] text-amber-400 block mb-0.5">Medium (%)</label>
                          <input type="number" min="0" max="100" value={scheduleData.diffMedium}
                            onChange={e => setScheduleData(p => ({ ...p, diffMedium: parseInt(e.target.value) }))}
                            className="w-full bg-brand-medium/30 border border-brand-medium rounded-md px-2 py-1 text-xs text-white focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] text-red-400 block mb-0.5">Hard (%)</label>
                          <input type="number" min="0" max="100" value={scheduleData.diffHard}
                            onChange={e => setScheduleData(p => ({ ...p, diffHard: parseInt(e.target.value) }))}
                            className="w-full bg-brand-medium/30 border border-brand-medium rounded-md px-2 py-1 text-xs text-white focus:outline-none" />
                        </div>
                      </div>
                      {(scheduleData.diffEasy + scheduleData.diffMedium + scheduleData.diffHard) !== 100 && (
                        <p className="text-[10px] text-amber-400 mt-1">⚠ Percentages should add up to 100% (Current: {scheduleData.diffEasy + scheduleData.diffMedium + scheduleData.diffHard}%)</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Duration (minutes)</label>
                        <input type="number" min="5" value={scheduleData.duration}
                          onChange={e => setScheduleData(p => ({ ...p, duration: parseInt(e.target.value) }))}
                          className="w-full bg-brand-medium/30 border border-brand-medium rounded-md px-2 py-1.5 text-xs text-white focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Available From</label>
                          <input type="datetime-local" value={scheduleData.startTime}
                            onChange={e => setScheduleData(p => ({ ...p, startTime: e.target.value }))}
                            className="w-full bg-brand-medium/30 border border-brand-medium rounded-md px-2 py-1 text-[10px] text-white focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Available Until</label>
                          <input type="datetime-local" value={scheduleData.endTime}
                            onChange={e => setScheduleData(p => ({ ...p, endTime: e.target.value }))}
                            className="w-full bg-brand-medium/30 border border-brand-medium rounded-md px-2 py-1 text-[10px] text-white focus:outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50">
                  {actionLoading ? 'Saving...' : 'Send Schedule Notification'}
                </button>
                <button type="button" onClick={() => setShowScheduler(false)} className="px-4 py-2 text-gray-400 hover:text-white text-xs rounded-lg hover:bg-white/5 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Company Dashboard ───────────────────────────────────────────────────────
const CompanyDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [jobForm, setJobForm] = useState({
    jobTitle: '',
    description: '',
    requiredSkills: '',
    salary: '',
    location: '',
    jobType: 'Full-time',
    shareToFeed: true,
  });
  const [hiringInfo, setHiringInfo] = useState(user?.companyDetails?.upcomingHiring || '');
  const [updatingHiringInfo, setUpdatingHiringInfo] = useState(false);
  const [hiringToast, setHiringToast] = useState('');
  const [rounds, setRounds] = useState([{ name: '' }]);
  const [formQuestions, setFormQuestions] = useState([{ question: '', required: true }]);
  const [activeJobId, setActiveJobId] = useState(null);
  const [activeJob, setActiveJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs/company');
      setJobs(res.data);
    } catch { setError('Failed to load company jobs.'); }
    setLoading(false);
  };

  const addRound = () => setRounds(r => [...r, { name: '' }]);
  const removeRound = (idx) => setRounds(r => r.filter((_, i) => i !== idx));
  const updateRound = (idx, val) => setRounds(r => r.map((item, i) => i === idx ? { ...item, name: val } : item));

  const addQuestion = () => setFormQuestions(q => [...q, { question: '', required: true }]);
  const removeQuestion = (idx) => setFormQuestions(q => q.filter((_, i) => i !== idx));
  const updateQuestion = (idx, field, val) =>
    setFormQuestions(q => q.map((item, i) => i === idx ? { ...item, [field]: val } : item));

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (user.verificationStatus !== 'verified') {
      setError('Only verified companies can post jobs.');
      return;
    }
    const { jobTitle, description, salary, location } = jobForm;
    if (!jobTitle || !description || !salary || !location) {
      setError('Please fill out all required fields.');
      return;
    }
    const validRounds = rounds.filter(r => r.name.trim()).map((r, i) => ({ roundNumber: i + 1, name: r.name }));
    const validQuestions = formQuestions.filter(q => q.question.trim());
    setActionLoading(true);
    setError('');
    try {
      const res = await api.post('/jobs', {
        ...jobForm,
        rounds: validRounds,
        applicationForm: validQuestions,
      });
      setJobs([res.data, ...jobs]);
      setJobForm({ jobTitle: '', description: '', requiredSkills: '', salary: '', location: '', jobType: 'Full-time', shareToFeed: true });
      setRounds([{ name: '' }]);
      setFormQuestions([{ question: '', required: true }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job.');
    }
    setActionLoading(false);
  };

  const handleUpdateHiringInfo = async (e) => {
    e.preventDefault();
    setUpdatingHiringInfo(true);
    try {
      await api.put('/auth/profile', { companyDetails: { upcomingHiring: hiringInfo } });
      setHiringToast('✓ Updated');
      setTimeout(() => setHiringToast(''), 3000);
    } catch {
      setHiringToast('Update failed');
      setTimeout(() => setHiringToast(''), 3000);
    }
    setUpdatingHiringInfo(false);
  };

  const fetchJobApplicants = async (job) => {
    setActiveJob(job);
    setActiveJobId(job._id);
    setShowLeaderboard(false);
    setLoadingApplicants(true);
    try {
      const res = await api.get(`/applications/job/${job._id}`);
      setApplicants(res.data);
    } catch { setError('Failed to load job applicants.'); }
    setLoadingApplicants(false);
  };

  const fetchJobLeaderboard = async (job) => {
    setActiveJob(job);
    setActiveJobId(job._id);
    setShowLeaderboard(true);
    setLoadingLeaderboard(true);
    try {
      const { data } = await api.get(`/assessments/job/${job._id}/results`);
      setLeaderboard(data);
    } catch (err) {
      console.error(err);
    }
    setLoadingLeaderboard(false);
  };

  const handleApplicantAction = (appId, updatedApp) => {
    setApplicants(prev => prev.map(a => a._id === appId ? { ...a, ...updatedApp } : a));
  };

  const handleToggleActive = async (jobId) => {
    try {
      const res = await api.put(`/jobs/${jobId}/toggle-active`);
      setJobs(prev => prev.map(j => j._id === jobId ? { ...j, isActive: res.data.isActive } : j));
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-brand-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white px-4 md:px-8 py-8">
      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center text-sm">
          {error}
          <button className="ml-4 underline" onClick={() => setError('')}>Dismiss</button>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Create Job Form */}
        <div className="lg:col-span-1 space-y-6">
          {user.verificationStatus === 'pending' && (
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-3 text-amber-300 text-sm flex items-start gap-2">
              <FaHourglassHalf className="mt-0.5 flex-shrink-0" />
              <span>Your company is <strong>pending verification</strong>. Candidates cannot see your jobs yet. You will be able to post jobs once you are approved by the administrator.</span>
            </div>
          )}
          {user.verificationStatus === 'rejected' && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-300 text-sm flex items-start gap-2">
              <FaTimesCircle className="mt-0.5 flex-shrink-0" />
              <span>Your company verification has been <strong>rejected</strong>. Please contact support.</span>
            </div>
          )}
          {user.verificationStatus === 'verified' && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-3 text-emerald-300 text-sm flex items-center gap-2">
              <MdVerified /><span>Your company is <strong>HireVerse Verified</strong>!</span>
            </div>
          )}

          <div className="glassmorphism p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <FaBullhorn className="text-brand-purple" /><span>Upcoming Hiring Info</span>
            </h2>
            <form onSubmit={handleUpdateHiringInfo} className="space-y-3">
              <p className="text-xs text-gray-400">Share your company's upcoming hiring plans, off-campus drives, or general recruitment schedules. Candidates visiting your profile will see this.</p>
              <textarea
                value={hiringInfo}
                onChange={e => setHiringInfo(e.target.value)}
                placeholder="e.g. We are planning an off-campus drive for 2025 graduates in December..."
                className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple min-h-[80px] resize-none"
              />
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={updatingHiringInfo}
                  className="px-4 py-2 bg-brand-purple hover:bg-opacity-95 font-semibold text-xs rounded-xl transition-all disabled:opacity-50"
                >
                  {updatingHiringInfo ? 'Saving...' : 'Save Info'}
                </button>
                {hiringToast && <span className={`text-xs font-medium ${hiringToast.includes('✓') ? 'text-emerald-400' : 'text-red-400'}`}>{hiringToast}</span>}
              </div>
            </form>
          </div>

          <div className="glassmorphism p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <FaPlusCircle className="text-brand-purple" /><span>Post a New Job</span>
            </h2>

            {user.verificationStatus !== 'verified' ? (
              <p className="text-xs text-gray-400 text-center py-6">
                Posting jobs is restricted to verified companies.
              </p>
            ) : (
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Job Title *</label>
                  <input type="text" required value={jobForm.jobTitle} onChange={e => setJobForm({...jobForm, jobTitle: e.target.value})}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Job Type</label>
                  <select value={jobForm.jobType} onChange={e => setJobForm({...jobForm, jobType: e.target.value})}
                    className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple">
                    {['Full-time','Part-time','Internship','Contract','Remote'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Description *</label>
                  <textarea required value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})}
                    placeholder="Describe the role, responsibilities..."
                    className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple min-h-[80px] resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Required Skills (comma-separated)</label>
                  <input type="text" value={jobForm.requiredSkills} onChange={e => setJobForm({...jobForm, requiredSkills: e.target.value})}
                    placeholder="e.g. React, Node.js, MongoDB"
                    className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Salary *</label>
                    <input type="text" required value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})}
                      placeholder="e.g. ₹8-12 LPA"
                      className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Location *</label>
                    <input type="text" required value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})}
                      placeholder="e.g. Remote / Chennai"
                      className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple" />
                  </div>
                </div>

                {/* Round Builder */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                      <FaLayerGroup className="text-violet-400" /> Hiring Rounds
                    </label>
                    <button type="button" onClick={addRound} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                      <FaPlus className="w-2.5 h-2.5" /> Add Round
                    </button>
                  </div>
                  <div className="space-y-4">
                    {rounds.map((r, idx) => (
                      <div key={idx} className="bg-brand-medium/10 border border-white/5 rounded-xl p-3 space-y-3">
                        <div className="flex gap-2 items-center">
                          <span className="text-xs text-gray-500 w-5 shrink-0">{idx + 1}.</span>
                          <input
                            type="text"
                            value={r.name}
                            onChange={e => updateRound(idx, e.target.value)}
                            placeholder={`Round ${idx + 1} name (e.g. Aptitude Test)`}
                            className="flex-1 bg-brand-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
                          />
                          {rounds.length > 1 && (
                            <button type="button" onClick={() => removeRound(idx)} className="text-red-400/60 hover:text-red-400 p-1">
                              <FaTrash className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Questions Builder */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                      <FaClipboardList className="text-violet-400" /> Application Form Questions
                    </label>
                    <button type="button" onClick={addQuestion} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                      <FaPlus className="w-2.5 h-2.5" /> Add Question
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formQuestions.map((q, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={q.question}
                            onChange={e => updateQuestion(idx, 'question', e.target.value)}
                            placeholder={`Question ${idx + 1}`}
                            className="flex-1 bg-brand-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
                          />
                          {formQuestions.length > 1 && (
                            <button type="button" onClick={() => removeQuestion(idx)} className="text-red-400/60 hover:text-red-400 p-1">
                              <FaTrash className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <label className="flex items-center gap-1.5 text-[10px] text-gray-500 ml-1 cursor-pointer">
                          <input type="checkbox" checked={q.required} onChange={e => updateQuestion(idx, 'required', e.target.checked)}
                            className="accent-violet-500 w-3 h-3" />
                          Required
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={jobForm.shareToFeed}
                    onChange={e => setJobForm({ ...jobForm, shareToFeed: e.target.checked })}
                    className="accent-brand-purple w-4 h-4"
                  />
                  Share job to feed and notify followers
                </label>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-brand-purple hover:bg-opacity-95 font-semibold text-sm rounded-xl transition-all disabled:opacity-50 shadow-md shadow-brand-purple/20"
                >
                  {actionLoading ? 'Creating...' : 'Publish Job Listing'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT: Job Listings + Applicants */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <FaBriefcase className="text-brand-purple" />
            <span>Your Jobs ({jobs.length})</span>
          </h2>

          {jobs.length === 0 ? (
            <div className="glassmorphism p-10 rounded-2xl text-center text-gray-400">
              <FaBriefcase className="w-10 h-10 mx-auto mb-3 text-gray-600" />
              <p className="text-lg">No job openings created yet.</p>
              <p className="text-sm mt-1">Use the form on the left to post a job opportunity.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job._id} className={`glassmorphism p-5 rounded-2xl border transition-all ${activeJobId === job._id ? 'border-violet-500' : 'border-transparent'} ${!job.isActive ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-white">{job.jobTitle}</h3>
                        {!job.isActive && <span className="text-xs bg-gray-500/20 text-gray-400 border border-gray-500/30 px-2 py-0.5 rounded-full">Closed</span>}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-brand-purple" />{job.location}</span>
                        <span className="flex items-center gap-1"><FaDollarSign className="text-brand-purple" />{job.salary}</span>
                        {job.rounds?.length > 0 && (
                          <span className="flex items-center gap-1 text-violet-400"><FaLayerGroup />{job.rounds.length} rounds</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button
                        onClick={() => { setShowLeaderboard(false); fetchJobApplicants(job); }}
                        className="px-3 py-1.5 bg-brand-purple/10 border border-brand-purple/40 hover:bg-brand-purple text-xs font-semibold rounded-xl text-brand-accent hover:text-white transition-colors whitespace-nowrap"
                      >
                        Applicants ({job.applicants?.length || 0})
                      </button>
                      {job.rounds?.some(r => r.hasAssessment) && (
                        <button
                          onClick={() => fetchJobLeaderboard(job)}
                          className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/40 hover:bg-emerald-500 text-xs font-semibold rounded-xl text-emerald-400 hover:text-white transition-colors whitespace-nowrap"
                        >
                          Assessment Results
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleActive(job._id)}
                        className={`text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${job.isActive ? 'text-emerald-400 hover:text-red-400' : 'text-gray-400 hover:text-emerald-400'}`}
                      >
                        {job.isActive ? <><FaToggleOn className="w-4 h-4" /> Active</> : <><FaToggleOff className="w-4 h-4" /> Closed</>}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 mt-3 line-clamp-2 leading-relaxed">{job.description}</p>

                  {job.requiredSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.requiredSkills.map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-brand-medium text-brand-accent">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Applicant Review Panel */}
          {activeJobId && !showLeaderboard && (
            <div className="glassmorphism p-6 rounded-2xl mt-2">
              <h3 className="text-lg font-bold mb-4 border-b border-brand-medium pb-3 text-brand-accent flex items-center gap-2">
                <FaClipboardList />
                Applicants — {activeJob?.jobTitle}
                <span className="text-sm text-gray-400 font-normal">({applicants.length})</span>
              </h3>

              {loadingApplicants ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-purple border-t-transparent" />
                </div>
              ) : applicants.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No applications submitted for this role yet.</p>
              ) : (
                <div className="space-y-3">
                  {applicants.map(app => (
                    <ApplicantCard key={app._id} app={app} job={activeJob} onAction={handleApplicantAction} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeJobId && showLeaderboard && (
            <div className="glassmorphism p-6 rounded-2xl mt-2">
              <h3 className="text-lg font-bold mb-4 border-b border-brand-medium pb-3 text-emerald-400 flex items-center gap-2">
                <FaTrophy />
                Assessment Leaderboard — {activeJob?.jobTitle}
              </h3>
              {loadingLeaderboard ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                </div>
              ) : leaderboard.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No assessment results available yet.</p>
              ) : (
                <div className="space-y-4">
                  {leaderboard.map((result, idx) => (
                    <div key={result._id} className="bg-brand-medium/20 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center">
                      <div className="font-bold text-xl text-gray-500 w-8 text-center">#{idx + 1}</div>
                      <img src={result.candidateId?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${result.candidateId?.name}`} alt="" className="w-12 h-12 rounded-full border border-emerald-500" />
                      <div className="flex-1">
                        <Link to={`/profile/${result.candidateId?._id}`} className="font-bold text-white hover:text-emerald-400 transition-colors">{result.candidateId?.name}</Link>
                        <p className="text-xs text-gray-400">{result.candidateId?.email}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Score</p>
                          <p className="font-bold text-lg text-white">{result.percentage}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Trust Score</p>
                          <p className={`font-bold text-lg ${result.proctorReport?.trustScore >= 80 ? 'text-emerald-400' : result.proctorReport?.trustScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                            {result.proctorReport?.trustScore || 0}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Time Taken</p>
                          <p className="font-bold text-lg text-white">{result.timeTaken}m</p>
                        </div>
                        <div className="text-center w-24">
                          <StatusChip status={result.status === 'Passed' ? 'hired' : 'rejected'} />
                        </div>
                      </div>
                      <div className="w-full sm:w-auto mt-2 sm:mt-0 text-xs">
                        {(result.proctorReport?.violations?.length > 0 || result.proctorReport?.trustScore < 100) && (
                          <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg p-2 max-w-xs text-[10px]">
                            <strong>Proctor Flags:</strong>
                            <ul className="list-disc pl-4 mt-1">
                              {result.proctorReport.tabSwitchCount > 0 && <li>Tab switches: {result.proctorReport.tabSwitchCount}</li>}
                              {result.proctorReport.fullscreenExitCount > 0 && <li>Fullscreen exits: {result.proctorReport.fullscreenExitCount}</li>}
                              {result.proctorReport.copyPasteAttempts > 0 && <li>Copy/Paste attempts: {result.proctorReport.copyPasteAttempts}</li>}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
