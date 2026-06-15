import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaFileAlt, FaBuilding,
  FaChevronRight, FaHourglassHalf, FaCheckCircle, FaExclamationCircle
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const Interviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

  useEffect(() => {
    const fetchInterviews = async () => {
      if (user?.accountType !== 'professional') {
        setLoading(false);
        setError('Only professional accounts can track scheduled interviews.');
        return;
      }
      try {
        const res = await api.get('/applications/my-applications');
        
        // Extract roundSchedules from all applications
        const allSchedules = [];
        res.data.forEach((app) => {
          const job = app.jobId || {};
          const company = job.companyId || {};
          
          if (app.roundSchedules && Array.isArray(app.roundSchedules)) {
            app.roundSchedules.forEach((schedule) => {
              allSchedules.push({
                scheduleId: `${app._id}-${schedule.roundNumber}`,
                applicationId: app._id,
                jobId: job._id,
                jobTitle: job.jobTitle,
                companyId: company._id,
                companyName: company.name,
                companyLogo: company.profileImage,
                isCompanyVerified: company.verificationStatus === 'verified',
                roundName: schedule.roundName || `Round ${schedule.roundNumber}`,
                roundNumber: schedule.roundNumber,
                scheduledAt: new Date(schedule.scheduledAt),
                venue: schedule.venue || 'Online / Remote',
                notes: schedule.notes || '',
                applicationStatus: app.status,
                currentRound: app.currentRound
              });
            });
          }
        });

        // Sort schedules chronologically
        allSchedules.sort((a, b) => a.scheduledAt - b.scheduledAt);
        setInterviews(allSchedules);
      } catch (err) {
        setError('Failed to fetch your interview schedule.');
      }
      setLoading(false);
    };

    if (user) {
      fetchInterviews();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-brand-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
      </div>
    );
  }

  const now = new Date();
  const upcomingInterviews = interviews.filter(int => int.scheduledAt >= now);
  const pastInterviews = interviews.filter(int => int.scheduledAt < now).reverse(); // Show most recent past first

  const displayedInterviews = activeTab === 'upcoming' ? upcomingInterviews : pastInterviews;

  return (
    <div className="min-h-screen bg-brand-dark text-white px-4 md:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="border-b border-brand-medium/50 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Interview Rounds</h1>
            <p className="text-sm text-gray-400 mt-1">Keep track of your scheduled evaluations and requirements.</p>
          </div>
          
          <div className="flex bg-brand-medium/30 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'upcoming' 
                  ? 'bg-brand-purple text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Upcoming ({upcomingInterviews.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'past' 
                  ? 'bg-brand-purple text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Past ({pastInterviews.length})
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {displayedInterviews.length === 0 ? (
          <div className="glassmorphism p-12 rounded-2xl text-center text-gray-400">
            <FaCalendarAlt className="w-12 h-12 mx-auto mb-4 text-gray-600 animate-pulse" />
            <p className="text-lg font-bold">No {activeTab} interview rounds found</p>
            <p className="text-sm mt-1">
              {activeTab === 'upcoming' 
                ? 'Your scheduled rounds will appear here once companies invite you.'
                : 'Any past completed or missed interview rounds will be saved here.'}
            </p>
            {activeTab === 'upcoming' && (
              <p className="text-xs mt-3 text-gray-500">
                You can browse jobs at the{' '}
                <Link to="/jobs" className="text-brand-purple hover:underline">
                  Jobs Section
                </Link>
                .
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayedInterviews.map((int) => {
              const dateStr = int.scheduledAt.toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });
              
              const timeStr = int.scheduledAt.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              });

              // Status checks
              const isApplicationRejected = int.applicationStatus === 'rejected';
              const isApplicationHired = int.applicationStatus === 'hired';
              const isCurrentRound = int.currentRound === int.roundNumber;

              return (
                <div
                  key={int.scheduleId}
                  className={`glassmorphism p-6 rounded-2xl border transition-all ${
                    isCurrentRound && !isApplicationRejected && !isApplicationHired && activeTab === 'upcoming'
                      ? 'border-brand-purple ring-1 ring-brand-purple/20' 
                      : 'border-white/5'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                    
                    {/* Left: Company & Job Title */}
                    <div className="flex items-start gap-4">
                      <img
                        src={int.companyLogo}
                        alt={int.companyName}
                        className="w-12 h-12 rounded border border-brand-accent bg-brand-medium object-contain flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-white text-md">{int.companyName}</span>
                          {int.isCompanyVerified && (
                            <MdVerified className="text-brand-accent w-4 h-4" title="Verified Company" />
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-brand-purple mt-0.5 hover:text-brand-accent transition-colors">
                          <Link to={`/jobs/${int.jobId}`}>{int.jobTitle}</Link>
                        </h3>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs bg-violet-600/20 text-violet-400 border border-violet-500/25 px-2 py-0.5 rounded-full font-medium">
                            {int.roundName}
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

                    {/* Right: Date, Time & Venue */}
                    <div className="flex flex-col gap-2 items-start md:items-end text-xs text-gray-400 bg-brand-medium/10 md:bg-transparent p-3 md:p-0 rounded-xl">
                      <div className="flex items-center gap-1.5 text-white font-medium">
                        <FaCalendarAlt className="text-brand-purple" />
                        <span>{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaClock className="text-brand-purple" />
                        <span>{timeStr} IST</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <FaMapMarkerAlt className="text-brand-purple flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{int.venue}</span>
                      </div>
                    </div>

                  </div>

                  {/* Notes box */}
                  {int.notes && (
                    <div className="mt-4 bg-brand-medium/20 border border-white/5 rounded-xl p-3 flex gap-2.5 items-start">
                      <FaFileAlt className="text-violet-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Interview Instructions</p>
                        <p className="text-gray-200 leading-relaxed">{int.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions / Direct links */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                    <span className="text-gray-500">Scheduled on Hireverse</span>
                    <Link
                      to="/my-applications"
                      className="text-brand-accent hover:text-brand-purple font-semibold flex items-center gap-1 transition-colors"
                    >
                      View Full Application Progress <FaChevronRight className="w-2.5 h-2.5" />
                    </Link>
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

export default Interviews;
