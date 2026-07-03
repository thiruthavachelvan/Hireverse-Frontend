import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaFileAlt, FaBuilding,
  FaChevronRight, FaLaptopCode, FaVideo, FaLock
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

// ─────────────────────────────────────────────
// Assessment Round Card
// ─────────────────────────────────────────────
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
    <div className={`glassmorphism p-6 rounded-2xl border transition-all ${
      isCurrentRound && !isApplicationRejected && !isApplicationHired && !isCompleted
        ? 'border-violet-500/40 ring-1 ring-violet-500/20'
        : 'border-white/5'
    }`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex items-start gap-4">
          <img src={int.companyLogo} alt={int.companyName}
            className="w-12 h-12 rounded border border-brand-accent bg-brand-medium object-contain flex-shrink-0" />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-white">{int.companyName}</span>
              {int.isCompanyVerified && <MdVerified className="text-brand-accent w-4 h-4" />}
            </div>
            <h3 className="text-lg font-bold text-violet-400 mt-0.5">
              <Link to={`/jobs/${int.jobId}`}>{int.jobTitle}</Link>
            </h3>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-violet-600/20 text-violet-300 border border-violet-500/25 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <FaLaptopCode className="w-3 h-3" /> {int.roundName}
              </span>
              <span className="text-xs bg-violet-600/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full">
                {assessmentType}
              </span>
              {isCompleted ? (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  Completed ✓
                </span>
              ) : (
                isCurrentRound && !isApplicationRejected && !isApplicationHired && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Current Round
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Timer info */}
        <div className="flex flex-col gap-2 items-start md:items-end text-xs text-gray-400 bg-brand-medium/10 md:bg-transparent p-3 md:p-0 rounded-xl">
          {isCompleted ? (
            <>
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span>Completed ✓</span>
              </div>
              {int.attemptId?.submittedAt && (
                <div className="text-[10px] text-gray-400">
                  Submitted: {new Date(int.attemptId.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 text-white font-medium">
                <FaClock className="text-violet-400" />
                <span>Duration: {duration} minutes</span>
              </div>
              {from && (
                <div className="flex items-center gap-1.5">
                  <FaCalendarAlt className="text-violet-400 flex-shrink-0" />
                  <span>
                    {from.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    {' – '}
                    {until ? until.toLocaleString('en-IN', { timeStyle: 'short' }) : '...'}
                  </span>
                </div>
              )}
              {/* Window status badge */}
              {isBeforeWindow && (
                <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full font-medium">
                  ⏳ Opens {from.toLocaleString('en-IN', { timeStyle: 'short' })}
                </span>
              )}
              {isInWindow && from && (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full font-medium animate-pulse">
                  ✅ Window Open Now
                </span>
              )}
              {isAfterWindow && (
                <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-full font-medium">
                  ❌ Window Closed
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
        <p className="text-xs text-gray-500">
          {isCompleted 
            ? 'You have finished this evaluation round.' 
            : !from ? 'Availability window not set yet.' : `Start any time during the window — you'll get ${duration} mins.`}
        </p>
        {isCompleted ? (
          <button disabled
            className="px-5 py-2.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-xl text-sm flex items-center gap-2 cursor-not-allowed opacity-70">
            Completed ✓
          </button>
        ) : (
          isCurrentRound && !isApplicationRejected && !isApplicationHired && (
            canStart ? (
              <Link to={`/assessment/job/${int.jobId}/round/${int.roundNumber}/rules`}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-lg shadow-violet-500/20 transition-all text-sm flex items-center gap-2">
                <FaLaptopCode /> Start Test
              </Link>
            ) : isBeforeWindow ? (
              <button disabled
                className="px-5 py-2.5 bg-amber-500/20 text-amber-400 font-bold rounded-xl text-sm flex items-center gap-2 cursor-not-allowed opacity-70">
                <FaLock /> Not Yet Open
              </button>
            ) : isAfterWindow ? (
              <button disabled
                className="px-5 py-2.5 bg-red-500/20 text-red-400 font-bold rounded-xl text-sm flex items-center gap-2 cursor-not-allowed opacity-70">
                Window Closed
              </button>
            ) : (
              <button disabled
                className="px-5 py-2.5 bg-gray-500/20 text-gray-400 font-bold rounded-xl text-sm flex items-center gap-2 cursor-not-allowed opacity-70">
                Start Test
              </button>
            )
          )
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Interview Round Card
// ─────────────────────────────────────────────
const InterviewCard = ({ int }) => {
  const cfg = int.interviewConfig || {};
  const scheduledAt = cfg.scheduledAt ? new Date(cfg.scheduledAt) : (int.scheduledAt ? new Date(int.scheduledAt) : null);
  const meetingLink = cfg.meetingLink || int.venue || '';
  const notes       = cfg.notes       || int.notes || '';

  const isApplicationRejected = int.applicationStatus === 'rejected';
  const isApplicationHired    = int.applicationStatus === 'hired';
  const isCurrentRound        = int.currentRound === int.roundNumber;

  const dateStr = scheduledAt?.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = scheduledAt?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`glassmorphism p-6 rounded-2xl border transition-all ${
      isCurrentRound && !isApplicationRejected && !isApplicationHired
        ? 'border-blue-500/40 ring-1 ring-blue-500/20'
        : 'border-white/5'
    }`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex items-start gap-4">
          <img src={int.companyLogo} alt={int.companyName}
            className="w-12 h-12 rounded border border-brand-accent bg-brand-medium object-contain flex-shrink-0" />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-white">{int.companyName}</span>
              {int.isCompanyVerified && <MdVerified className="text-brand-accent w-4 h-4" />}
            </div>
            <h3 className="text-lg font-bold text-blue-400 mt-0.5">
              <Link to={`/jobs/${int.jobId}`}>{int.jobTitle}</Link>
            </h3>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-blue-600/20 text-blue-300 border border-blue-500/25 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <FaVideo className="w-3 h-3" /> {int.roundName}
              </span>
              {isCurrentRound && !isApplicationRejected && !isApplicationHired && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Current Round
                </span>
              )}
              {isApplicationRejected && (
                <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-medium">
                  Application Closed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Schedule info */}
        <div className="flex flex-col gap-2 items-start md:items-end text-xs text-gray-400 bg-brand-medium/10 md:bg-transparent p-3 md:p-0 rounded-xl">
          {scheduledAt ? (
            <>
              <div className="flex items-center gap-1.5 text-white font-medium">
                <FaCalendarAlt className="text-blue-400" />
                <span>{dateStr}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaClock className="text-blue-400" />
                <span>{timeStr} IST</span>
              </div>
            </>
          ) : (
            <span className="text-gray-500 italic">Schedule not set yet</span>
          )}
          {meetingLink && (
            <div className="flex items-center gap-1.5 text-gray-300">
              <FaMapMarkerAlt className="text-blue-400 flex-shrink-0" />
              <span className="truncate max-w-[200px]">{meetingLink}</span>
            </div>
          )}
        </div>
      </div>

      {/* Notes box */}
      {notes && (
        <div className="mt-4 bg-brand-medium/20 border border-white/5 rounded-xl p-3 flex gap-2.5 items-start">
          <FaFileAlt className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Interview Instructions</p>
            <p className="text-gray-200 leading-relaxed">{notes}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
        <span className="text-gray-500">Scheduled on HireVerse</span>
        <div className="flex items-center gap-3">
          {meetingLink && (
            <a href={meetingLink} target="_blank" rel="noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors">
              <FaVideo /> Join Interview
            </a>
          )}
          <Link to="/my-applications"
            className="text-brand-accent hover:text-brand-purple font-semibold flex items-center gap-1 transition-colors">
            Full Progress <FaChevronRight className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Interviews Page
// ─────────────────────────────────────────────
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
                // Round type from new schema, fallback to detecting from hasAssessment
                roundType:         schedule.roundType || (schedule.hasAssessment ? 'assessment' : 'interview'),
                // New schema fields
                assessmentConfig:  schedule.assessmentConfig,
                interviewConfig:   schedule.interviewConfig,
                // Legacy fallback fields
                assessmentDetails: schedule.assessmentDetails,
                scheduledAt:       schedule.interviewConfig?.scheduledAt || schedule.scheduledAt,
                venue:             schedule.interviewConfig?.meetingLink  || schedule.venue || '',
                notes:             schedule.interviewConfig?.notes        || schedule.notes || '',
                applicationStatus: app.status,
                currentRound:      app.currentRound,
                // New fields for completion status
                status:            schedule.status || 'Scheduled',
                assessmentCompleted: schedule.assessmentCompleted || false,
                attemptId:         schedule.attemptId || null,
              });
            });
          }
        });

        // Sort: assessment rounds by availableFrom, interview by scheduledAt
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
      <div className="flex min-h-[80vh] items-center justify-center bg-brand-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
      </div>
    );
  }

  const now = new Date();

  // "upcoming" = assessment windows not yet closed OR interview not yet passed
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
    <div className="min-h-screen bg-brand-dark text-white px-4 md:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="border-b border-brand-medium/50 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Interview Rounds</h1>
            <p className="text-sm text-gray-400 mt-1">Track your scheduled evaluations and online tests.</p>
          </div>
          <div className="flex bg-brand-medium/30 p-1 rounded-xl border border-white/5">
            <button onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'upcoming' ? 'bg-brand-purple text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}>
              Upcoming ({upcoming.length})
            </button>
            <button onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'past' ? 'bg-brand-purple text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}>
              Past ({past.length})
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">{error}</div>
        )}

        {displayed.length === 0 ? (
          <div className="glassmorphism p-12 rounded-2xl text-center text-gray-400">
            <FaCalendarAlt className="w-12 h-12 mx-auto mb-4 text-gray-600 animate-pulse" />
            <p className="text-lg font-bold">No {activeTab} rounds found</p>
            <p className="text-sm mt-1">
              {activeTab === 'upcoming'
                ? 'Your scheduled rounds and assessments will appear here once companies invite you.'
                : 'Any past completed interview rounds will be saved here.'}
            </p>
            {activeTab === 'upcoming' && (
              <p className="text-xs mt-3 text-gray-500">
                Browse jobs at the{' '}
                <Link to="/jobs" className="text-brand-purple hover:underline">Jobs Section</Link>.
              </p>
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
