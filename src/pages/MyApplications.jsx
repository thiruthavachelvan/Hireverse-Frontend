import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBuilding, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle,
  FaHourglassHalf, FaCalendarAlt, FaLayerGroup, FaTrophy,
  FaClipboardList,
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const statusConfig = {
  submitted: { label: 'Submitted', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: FaClipboardList },
  under_review: { label: 'Under Review', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: FaHourglassHalf },
  in_round: { label: 'In Rounds', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30', icon: FaLayerGroup },
  hired: { label: 'Hired! 🎉', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: FaTrophy },
  rejected: { label: 'Not Selected', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: FaTimesCircle },
};

const StatusChip = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.submitted;
  const Icon = cfg.icon;
  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-full ${cfg.color}`}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
};

const RoundStepper = ({ job, application }) => {
  const rounds = job?.rounds || [];
  if (rounds.length === 0) return null;

  const currentRound = application.currentRound;
  const isHired = application.status === 'hired';
  const isRejected = application.status === 'rejected';

  return (
    <div className="pt-4 border-t border-white/10">
      <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">Hiring Progress</p>
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-3.5 left-3.5 right-3.5 h-0.5 bg-white/5" />
        <div className="flex justify-between relative">
          {rounds.map((round, idx) => {
            const roundNum = round.roundNumber;
            const isDone = isHired || (!isRejected && currentRound > roundNum);
            const isCurrent = !isHired && !isRejected && currentRound === roundNum;
            const schedule = application.roundSchedules?.find(rs => rs.roundNumber === roundNum);

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 relative z-10 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                  isDone ? 'bg-emerald-500 text-white ring-2 ring-emerald-500/30' :
                  isCurrent ? 'bg-violet-600 text-white ring-2 ring-violet-500/40 animate-pulse' :
                  'bg-white/5 text-gray-600 border border-white/10'
                }`}>
                  {isDone ? '✓' : roundNum}
                </div>
                <p className={`text-xs text-center font-medium leading-tight max-w-16 ${
                  isDone || isCurrent ? 'text-white' : 'text-gray-500'
                }`}>{round.name}</p>
                {schedule?.scheduledAt && (
                  <div className="text-center">
                    <p className="text-xs text-violet-300 flex items-center gap-0.5">
                      <FaCalendarAlt className="w-2.5 h-2.5" />
                      {new Date(schedule.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-xs text-violet-300/70">
                      {new Date(schedule.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {schedule.venue && <p className="text-xs text-gray-500 mt-0.5 truncate max-w-16">{schedule.venue}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      if (user?.accountType !== 'professional') {
        setLoading(false);
        setError('Only professional accounts can track applications.');
        return;
      }
      try {
        const res = await api.get('/applications/my-applications');
        setApplications(res.data);
      } catch {
        setError('Failed to fetch your applications.');
      }
      setLoading(false);
    };
    if (user) {
      fetchApplications();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-brand-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white px-4 md:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="border-b border-brand-medium/50 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">My Applications</h1>
            <p className="text-sm text-gray-400 mt-1">Track all your job applications and hiring progress.</p>
          </div>
          <span className="text-gray-400 text-sm">{applications.length} application{applications.length !== 1 ? 's' : ''}</span>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="glassmorphism p-12 rounded-2xl text-center text-gray-400">
            <FaClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-bold">No applications yet</p>
            <p className="text-sm mt-1">Head to the <Link to="/jobs" className="text-violet-400 hover:underline">Jobs</Link> tab to find opportunities.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {applications.map((app) => {
              const jobDetails = app.jobId || {};
              const company = jobDetails.companyId || {};
              const isHired = app.status === 'hired';
              const isRejected = app.status === 'rejected';

              return (
                <div key={app._id} className={`glassmorphism p-6 rounded-2xl space-y-5 ${
                  isHired ? 'border border-emerald-500/20' :
                  isRejected ? 'border border-red-500/10 opacity-75' : ''
                }`}>
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={company.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${company.name}`}
                        alt={company.name}
                        className="w-12 h-12 rounded-xl border border-brand-purple bg-brand-medium object-contain"
                      />
                      <div>
                        <h3 className="text-lg font-extrabold text-white leading-tight">
                          {jobDetails.jobTitle || 'Deleted Job'}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 font-semibold text-brand-accent">
                            <FaBuilding className="text-[10px]" />
                            {company.name || 'Unknown Company'}
                            {company.verificationStatus === 'verified' && (
                              <MdVerified className="text-emerald-400 w-3 h-3" />
                            )}
                          </span>
                          {jobDetails.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <FaMapMarkerAlt className="text-[10px]" />{jobDetails.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusChip status={app.status} />
                      <span className="text-xs text-gray-500">
                        Applied {new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Round Stepper */}
                  {(jobDetails.rounds?.length > 0) && (
                    <RoundStepper job={jobDetails} application={app} />
                  )}

                  {/* Upcoming Schedule highlight */}
                  {app.status === 'in_round' && app.roundSchedules?.length > 0 && (() => {
                    const nextSchedule = app.roundSchedules
                      .filter(rs => rs.roundNumber === app.currentRound && rs.scheduledAt)
                      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0];
                    if (!nextSchedule) return null;
                    return (
                      <div className="bg-violet-500/10 border border-violet-500/25 rounded-xl px-4 py-3 flex items-start gap-3">
                        <FaCalendarAlt className="text-violet-400 w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-violet-300 font-semibold text-sm">Upcoming: {nextSchedule.roundName}</p>
                          <p className="text-violet-200/70 text-xs mt-0.5">
                            {new Date(nextSchedule.scheduledAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
                          </p>
                          {nextSchedule.venue && <p className="text-gray-400 text-xs mt-0.5">📍 {nextSchedule.venue}</p>}
                          {nextSchedule.notes && <p className="text-gray-400 text-xs mt-0.5">📝 {nextSchedule.notes}</p>}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Status Messages */}
                  <div className="flex items-center gap-2 text-xs bg-brand-medium/20 p-3 rounded-xl">
                    {isRejected ? (
                      <>
                        <FaTimesCircle className="text-red-500 w-4 h-4 flex-shrink-0" />
                        <span className="text-red-400 font-medium">We appreciate your interest. The team has decided to move forward with other candidates.</span>
                      </>
                    ) : isHired ? (
                      <>
                        <FaTrophy className="text-amber-400 w-4 h-4 flex-shrink-0" />
                        <span className="text-emerald-400 font-semibold">🎊 Congratulations! You have been selected for this position.</span>
                      </>
                    ) : app.status === 'in_round' ? (
                      <>
                        <FaLayerGroup className="text-violet-400 w-4 h-4 flex-shrink-0" />
                        <span className="text-gray-300">
                          You are currently in <strong className="text-violet-300">
                            {jobDetails.rounds?.find(r => r.roundNumber === app.currentRound)?.name || `Round ${app.currentRound}`}
                          </strong>. Await the company's schedule notification.
                        </span>
                      </>
                    ) : (
                      <>
                        <FaHourglassHalf className="text-brand-accent w-4 h-4 animate-spin flex-shrink-0" />
                        <span className="text-gray-300">Your application is under review. The company will respond soon.</span>
                      </>
                    )}
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

export default MyApplications;
