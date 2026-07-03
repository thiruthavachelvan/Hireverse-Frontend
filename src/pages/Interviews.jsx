import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, FileText, Building2,
  ChevronRight, Laptop, Video, Lock, Sparkles, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

// ─── Assessment Round Card ──────────────────────────────────────
const AssessmentCard = ({ int }) => {
  const cfg = int.assessmentConfig || int.assessmentDetails || {};
  const availableFrom  = cfg.availableFrom  || cfg.startTime;
  const availableUntil = cfg.availableUntil || cfg.endTime;
  const duration       = cfg.duration || 45;
  const assessmentType = cfg.assessmentType || cfg.type || 'Online Assessment';

  const now  = new Date();
  const from = availableFrom  ? new Date(availableFrom)  : null;
  const until = availableUntil ? new Date(availableUntil) : null;

  const isBeforeWindow = from  && now < from;
  const isAfterWindow  = until && now > until;
  const isInWindow     = !isBeforeWindow && !isAfterWindow;

  const isApplicationRejected = int.applicationStatus === 'rejected';
  const isApplicationHired    = int.applicationStatus === 'hired';
  const isCurrentRound        = int.currentRound === int.roundNumber;
  const isCompleted           = int.assessmentCompleted || int.status === 'Completed' || !!int.attemptId;

  const canStart = isInWindow && isCurrentRound && !isApplicationRejected && !isApplicationHired && !isCompleted;

  return (
    <div className={`card p-6 border ${
      isCurrentRound && !isApplicationRejected && !isApplicationHired && !isCompleted
        ? 'border-violet-300 shadow-md bg-violet-50/5'
        : 'bg-white'
    }`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex items-start gap-4">
          <img src={int.companyLogo || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(int.companyName || '')}`} alt=""
            className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 object-contain flex-shrink-0" />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-hv-text text-sm">{int.companyName}</span>
              {int.isCompanyVerified && (
                <span className="chip chip-success text-[8px] px-1 py-0 leading-none">Verified Partner</span>
              )}
            </div>
            <h3 className="text-base font-extrabold text-hv-violet mt-0.5 hover:opacity-85 transition-opacity">
              <Link to={`/jobs/${int.jobId}`}>{int.jobTitle}</Link>
            </h3>
            
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <span className="chip chip-violet font-semibold text-[10px]">
                <Laptop size={11} /> {int.roundName}
              </span>
              <span className="chip chip-gray font-bold text-[10px]">
                {assessmentType}
              </span>
              {isCompleted ? (
                <span className="chip chip-success text-[10px]">
                  Completed ✓
                </span>
              ) : (
                isCurrentRound && !isApplicationRejected && !isApplicationHired && (
                  <span className="chip chip-success text-[10px] animate-pulse">
                    Current Stage
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Timer stats details */}
        <div className="flex flex-col gap-1.5 items-start md:items-end text-xs text-hv-muted">
          {isCompleted ? (
            <>
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <span>Completed ✓</span>
              </div>
              {int.attemptId?.submittedAt && (
                <div className="text-[10px] text-hv-subtle font-semibold uppercase">
                  Submitted: {new Date(int.attemptId.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 font-bold text-hv-text">
                <Clock size={13} className="text-hv-violet" />
                <span>Duration: {duration} mins</span>
              </div>
              {from && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                  <Calendar size={13} className="text-hv-violet flex-shrink-0" />
                  <span>
                    {from.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    {' – '}
                    {until ? until.toLocaleString('en-IN', { timeStyle: 'short' }) : '...'}
                  </span>
                </div>
              )}
              {/* Window status pill */}
              {isBeforeWindow && (
                <span className="text-[10px] font-bold uppercase chip chip-warning mt-1.5">
                  Opens {from.toLocaleString('en-IN', { timeStyle: 'short' })}
                </span>
              )}
              {isInWindow && from && (
                <span className="text-[10px] font-bold uppercase chip chip-success mt-1.5 animate-pulse">
                  Window Active Now
                </span>
              )}
              {isAfterWindow && (
                <span className="text-[10px] font-bold uppercase chip chip-danger mt-1.5">
                  Closed
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer block */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center gap-4 flex-wrap">
        <p className="text-xs text-hv-muted leading-relaxed max-w-sm">
          {isCompleted 
            ? 'Evaluation round finished successfully.' 
            : !from ? 'Waiting for company availability window.' : `Start any time during the window — test duration is ${duration} mins.`}
        </p>
        
        {isCompleted ? (
          <button disabled className="btn-ghost py-2 text-xs opacity-70 cursor-not-allowed">
            Completed ✓
          </button>
        ) : (
          isCurrentRound && !isApplicationRejected && !isApplicationHired && (
            canStart ? (
              <Link to={`/assessment/job/${int.jobId}/round/${int.roundNumber}/rules`}
                className="btn-primary py-2 text-xs flex items-center gap-1 shadow-violet-200">
                <Laptop size={14} /> Start Test
              </Link>
            ) : isBeforeWindow ? (
              <button disabled className="btn-ghost py-2 text-xs opacity-60 cursor-not-allowed">
                <Lock size={12} /> Locked
              </button>
            ) : isAfterWindow ? (
              <button disabled className="btn-ghost py-2 text-xs opacity-60 cursor-not-allowed">
                Expired
              </button>
            ) : (
              <button disabled className="btn-ghost py-2 text-xs opacity-60 cursor-not-allowed">
                Start Test
              </button>
            )
          )
        )}
      </div>
    </div>
  );
};

// ─── Interview Round Card ──────────────────────────────────────
const InterviewCard = ({ int }) => {
  const cfg = int.interviewConfig || {};
  const scheduledAt = cfg.scheduledAt ? new Date(cfg.scheduledAt) : (int.scheduledAt ? new Date(int.scheduledAt) : null);
  const meetingLink = cfg.meetingLink || int.venue || '';
  const notes       = cfg.notes       || int.notes || '';

  const isApplicationRejected = int.applicationStatus === 'rejected';
  const isApplicationHired    = int.applicationStatus === 'hired';
  const isCurrentRound        = int.currentRound === int.roundNumber;

  const dateStr = scheduledAt?.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = scheduledAt?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`card p-6 border ${
      isCurrentRound && !isApplicationRejected && !isApplicationHired
        ? 'border-violet-300 shadow-md'
        : 'bg-white'
    }`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex items-start gap-4">
          <img src={int.companyLogo || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(int.companyName || '')}`} alt=""
            className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 object-contain flex-shrink-0" />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-hv-text text-sm">{int.companyName}</span>
              {int.isCompanyVerified && (
                <span className="chip chip-success text-[8px] px-1 py-0 leading-none">Verified Partner</span>
              )}
            </div>
            <h3 className="text-base font-extrabold text-hv-violet mt-0.5 hover:opacity-85 transition-opacity">
              <Link to={`/jobs/${int.jobId}`}>{int.jobTitle}</Link>
            </h3>
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <span className="chip chip-violet font-semibold text-[10px]">
                <Video size={11} /> {int.roundName}
              </span>
              {isCurrentRound && !isApplicationRejected && !isApplicationHired && (
                <span className="chip chip-success text-[10px] animate-pulse">
                  Current Stage
                </span>
              )}
              {isApplicationRejected && (
                <span className="chip chip-danger text-[10px]">
                  Application Closed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Schedule metadata details */}
        <div className="flex flex-col gap-1.5 items-start md:items-end text-xs text-hv-muted">
          {scheduledAt ? (
            <>
              <div className="flex items-center gap-1.5 font-bold text-hv-text">
                <Calendar size={13} className="text-hv-violet" />
                <span>{dateStr}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <Clock size={13} className="text-hv-violet" />
                <span>{timeStr} IST</span>
              </div>
            </>
          ) : (
            <span className="text-hv-subtle italic">Waiting for schedule times</span>
          )}
          {meetingLink && (
            <div className="flex items-center gap-1 text-hv-subtle font-medium mt-1 truncate max-w-[200px]">
              <MapPin size={11} className="flex-shrink-0" />
              <span className="truncate">{meetingLink}</span>
            </div>
          )}
        </div>
      </div>

      {/* Notes block */}
      {notes && (
        <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-3 flex gap-2.5 items-start">
          <FileText size={15} className="text-hv-violet flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-hv-subtle uppercase tracking-wider text-[9px] mb-1">Recruiter Notes</p>
            <p className="text-hv-muted leading-relaxed">{notes}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center gap-4 flex-wrap text-xs">
        <span className="text-hv-subtle font-semibold">Interviews scheduled on HireVerse</span>
        <div className="flex items-center gap-3">
          {meetingLink && (
            <a href={meetingLink} target="_blank" rel="noreferrer"
              className="btn-primary py-2 text-xs flex items-center gap-1">
              <Video size={13} /> Join Call
            </a>
          )}
          <Link to="/my-applications"
            className="text-hv-violet font-bold flex items-center gap-0.5 hover:opacity-80 transition-opacity">
            Full Progress <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Main Interviews Page ────────────────────────────────────────
const Interviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchInterviews = async () => {
      if (user?.accountType !== 'professional') {
        setLoading(false);
        setError('Only professional accounts can track scheduled interviews.');
        return;
      }
      try {
        const res = await api.get('/applications/my-applications');
        const allSchedules = [];

        res.data.forEach((app) => {
          const job     = app.jobId || {};
          const company = job.companyId || {};

          if (app.roundSchedules && Array.isArray(app.roundSchedules)) {
            app.roundSchedules.forEach((schedule) => {
              allSchedules.push({
                scheduleId:        `${app._id}-${schedule.roundNumber}`,
                applicationId:     app._id,
                jobId:             job._id,
                jobTitle:          job.jobTitle,
                companyId:         company._id,
                companyName:       company.name,
                companyLogo:       company.profileImage,
                isCompanyVerified: company.verificationStatus === 'verified',
                roundName:         schedule.roundName || `Round ${schedule.roundNumber}`,
                roundNumber:       schedule.roundNumber,
                roundType:         schedule.roundType || (schedule.hasAssessment ? 'assessment' : 'interview'),
                assessmentConfig:  schedule.assessmentConfig,
                interviewConfig:   schedule.interviewConfig,
                assessmentDetails: schedule.assessmentDetails,
                scheduledAt:       schedule.interviewConfig?.scheduledAt || schedule.scheduledAt,
                venue:             schedule.interviewConfig?.meetingLink  || schedule.venue || '',
                notes:             schedule.interviewConfig?.notes        || schedule.notes || '',
                applicationStatus: app.status,
                currentRound:      app.currentRound,
                status:            schedule.status || 'Scheduled',
                assessmentCompleted: schedule.assessmentCompleted || false,
                attemptId:         schedule.attemptId || null,
              });
            });
          }
        });

        // Sort schedules
        allSchedules.sort((a, b) => {
          const aDate = a.roundType === 'assessment'
            ? new Date(a.assessmentConfig?.availableFrom || 0)
            : new Date(a.interviewConfig?.scheduledAt    || a.scheduledAt || 0);
          const bDate = b.roundType === 'assessment'
            ? new Date(b.assessmentConfig?.availableFrom || 0)
            : new Date(b.interviewConfig?.scheduledAt    || b.scheduledAt || 0);
          return aDate - bDate;
        });

        setInterviews(allSchedules);
      } catch (err) {
        setError('Failed to fetch your interview schedule.');
      }
      setLoading(false);
    };

    if (user) fetchInterviews();
  }, [user]);

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

  const now = new Date();

  const upcoming = interviews.filter(int => {
    if (int.roundType === 'assessment') {
      const until = int.assessmentConfig?.availableUntil || int.assessmentDetails?.endTime;
      return !until || new Date(until) >= now;
    }
    const at = int.interviewConfig?.scheduledAt || int.scheduledAt;
    return !at || new Date(at) >= now;
  });

  const past = interviews.filter(int => {
    if (int.roundType === 'assessment') {
      const until = int.assessmentConfig?.availableUntil || int.assessmentDetails?.endTime;
      return until && new Date(until) < now;
    }
    const at = int.interviewConfig?.scheduledAt || int.scheduledAt;
    return at && new Date(at) < now;
  }).reverse();

  const displayed = activeTab === 'upcoming' ? upcoming : past;

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 relative">
      <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">

        <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-hv-text">Workspace Rounds</h1>
            <p className="text-sm text-hv-muted mt-1 font-medium">Coordinate upcoming technical MCQs, coding challenges, and panel interviews.</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'upcoming' ? 'bg-white text-hv-violet shadow-sm' : 'text-hv-muted hover:text-hv-text'
              }`}>
              Upcoming ({upcoming.length})
            </button>
            <button onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'past' ? 'bg-white text-hv-violet shadow-sm' : 'text-hv-muted hover:text-hv-text'
              }`}>
              History ({past.length})
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">{error}</div>
        )}

        {displayed.length === 0 ? (
          <div className="card p-16 text-center max-w-md mx-auto space-y-4">
            <Calendar className="w-16 h-16 text-hv-subtle mx-auto animate-float" />
            <div>
              <p className="text-lg font-bold text-hv-text">No {activeTab} rounds scheduled</p>
              <p className="text-sm text-hv-muted mt-1 leading-relaxed">
                {activeTab === 'upcoming'
                  ? 'Your scheduled tests and calls will appear here when recruiters schedule updates.'
                  : 'Your past interview sessions and test attempts will be cataloged here.'}
              </p>
            </div>
            {activeTab === 'upcoming' && (
              <Link to="/jobs" className="btn-primary inline-flex py-2.5 text-xs">
                Browse Active Jobs <Sparkles size={13} />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((int) =>
              int.roundType === 'assessment'
                ? <AssessmentCard key={int.scheduleId} int={int} />
                : <InterviewCard  key={int.scheduleId} int={int} />
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Interviews;
