import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2, MapPin, CheckCircle2, XCircle,
  Hourglass, Calendar, Layers, Trophy, FileText,
  AlertCircle, Sparkles, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig = {
  submitted:    { label: 'Submitted',    color: 'chip-blue font-bold',    icon: FileText },
  under_review: { label: 'Under Review', color: 'chip-warning font-bold', icon: Hourglass },
  in_round:     { label: 'In Rounds',    color: 'chip-violet font-bold',  icon: Layers },
  hired:        { label: 'Hired! 🎉',    color: 'chip-success font-black border-emerald-300 bg-emerald-50', icon: Trophy },
  rejected:     { label: 'Not Selected', color: 'chip-danger font-bold',  icon: XCircle },
};

const StatusChip = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.submitted;
  const Icon = cfg.icon;
  return (
    <span className={`chip flex items-center gap-1 text-xs px-2.5 py-1 ${cfg.color}`}>
      <Icon size={12} /> {cfg.label}
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
    <div className="pt-4 border-t border-gray-100">
      <p className="text-xs text-hv-muted mb-4 uppercase tracking-wider font-bold">Hiring Pipeline Progress</p>
      <div className="relative">
        
        {/* Connecting horizontal line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100" />
        
        <div className="flex justify-between relative">
          {rounds.map((round, idx) => {
            const roundNum = round.roundNumber;
            const isDone = isHired || (!isRejected && currentRound > roundNum);
            const isCurrent = !isHired && !isRejected && currentRound === roundNum;
            const schedule = application.roundSchedules?.find(rs => rs.roundNumber === roundNum);

            return (
              <div key={idx} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                  isDone ? 'bg-emerald-500 text-white ring-4 ring-emerald-50' :
                  isCurrent ? 'bg-hv-violet text-white ring-4 ring-violet-100 animate-pulse' :
                  'bg-white text-hv-subtle border border-gray-200'
                }`}>
                  {isDone ? '✓' : roundNum}
                </div>
                
                <p className={`text-[10px] text-center font-bold uppercase tracking-wider leading-tight max-w-16 ${
                  isDone || isCurrent ? 'text-hv-text' : 'text-hv-subtle'
                }`}>{round.name}</p>

                {schedule?.scheduledAt && (
                  <div className="text-center mt-1">
                    <p className="text-[10px] text-hv-violet font-bold flex items-center justify-center gap-0.5">
                      <Calendar size={10} />
                      {new Date(schedule.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-[9px] text-hv-muted font-semibold mt-0.5">
                      {new Date(schedule.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {schedule.venue && <p className="text-[9px] text-hv-subtle font-medium mt-0.5 truncate max-w-16">{schedule.venue}</p>}
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

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 relative">
      <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">

        <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-hv-text">My Applications</h1>
            <p className="text-sm text-hv-muted mt-1 font-medium">Track your startup opportunity pipeline and interview rounds.</p>
          </div>
          <span className="text-xs font-bold text-hv-muted bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
            {applications.length} submitted
          </span>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="card p-16 text-center max-w-md mx-auto space-y-4">
            <Trophy className="w-16 h-16 text-hv-subtle mx-auto animate-float" />
            <div>
              <p className="text-lg font-bold text-hv-text">No applications yet</p>
              <p className="text-sm text-hv-muted mt-1">Start browsing startup opportunities to build your pipeline.</p>
            </div>
            <Link to="/jobs" className="btn-primary inline-flex py-2.5 text-xs">
              Find Opportunities <ChevronRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {applications.map((app) => {
              const jobDetails = app.jobId || {};
              const company = jobDetails.companyId || {};
              const isHired = app.status === 'hired';
              const isRejected = app.status === 'rejected';

              return (
                <div key={app._id} className={`card p-6 space-y-5 border ${
                  isHired ? 'border-emerald-200 bg-emerald-50/10' :
                  isRejected ? 'border-red-100 opacity-80' : 'bg-white'
                }`}>
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={company.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(company.name || '')}`}
                        alt=""
                        className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 object-contain flex-shrink-0"
                      />
                      <div>
                        <h3 className="text-lg font-black text-hv-text leading-tight">
                          {jobDetails.jobTitle || 'Deleted Role'}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-hv-muted mt-1.5 flex-wrap font-semibold">
                          <span className="flex items-center gap-1 text-hv-violet">
                            <Building2 size={13} /> {company.name || 'Startup'}
                          </span>
                          {company.verificationStatus === 'verified' && (
                            <span className="chip chip-success text-[9px] px-1.5 py-0 leading-none">Verified</span>
                          )}
                          {jobDetails.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <MapPin size={11} className="text-hv-subtle" /> {jobDetails.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <StatusChip status={app.status} />
                      <span className="text-[10px] text-hv-subtle font-bold uppercase">
                        Applied {new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>

                  {/* Stepper progress */}
                  {(jobDetails.rounds?.length > 0) && (
                    <RoundStepper job={jobDetails} application={app} />
                  )}

                  {/* Scheduled Round banner */}
                  {app.status === 'in_round' && app.roundSchedules?.length > 0 && (() => {
                    const nextSchedule = app.roundSchedules
                      .filter(rs => rs.roundNumber === app.currentRound && rs.scheduledAt)
                      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0];
                    if (!nextSchedule) return null;
                    return (
                      <div className="bg-violet-50 border border-violet-100 rounded-2xl px-4 py-3 flex items-start gap-3">
                        <Calendar className="text-hv-violet w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-hv-violet font-bold text-sm">Upcoming Round: {nextSchedule.roundName}</p>
                          <p className="text-hv-muted text-xs mt-0.5 font-medium">
                            {new Date(nextSchedule.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                          {nextSchedule.venue && <p className="text-hv-subtle text-xs mt-1">📍 Venue/Link: <a href={nextSchedule.venue} target="_blank" rel="noreferrer" className="underline font-bold text-hv-violet">{nextSchedule.venue}</a></p>}
                          {nextSchedule.notes && <p className="text-hv-subtle text-xs mt-0.5">📝 Notes: {nextSchedule.notes}</p>}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Status Banner Message */}
                  <div className="flex items-center gap-2 text-xs bg-gray-50 border border-gray-100 p-3 rounded-xl">
                    {isRejected ? (
                      <>
                        <XCircle size={14} className="text-red-500 shrink-0" />
                        <span className="text-red-600 font-semibold">Thank you for your interest. The hiring team has decided to pursue other applicants.</span>
                      </>
                    ) : isHired ? (
                      <>
                        <Trophy size={14} className="text-amber-500 shrink-0" />
                        <span className="text-emerald-700 font-bold">🎉 Congratulations! You've received an offer from this startup!</span>
                      </>
                    ) : app.status === 'in_round' ? (
                      <>
                        <Layers size={14} className="text-hv-violet shrink-0 animate-pulse-glow" />
                        <span className="text-hv-text font-semibold">
                          Active: You are currently in{' '}
                          <strong className="text-hv-violet">
                            {jobDetails.rounds?.find(r => r.roundNumber === app.currentRound)?.name || `Round ${app.currentRound}`}
                          </strong>
                          . Stay alert for scheduling updates.
                        </span>
                      </>
                    ) : (
                      <>
                        <Hourglass size={14} className="text-hv-subtle shrink-0" />
                        <span className="text-hv-muted font-semibold">Under Review: The startup's founding team is reviewing your builder profile.</span>
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
