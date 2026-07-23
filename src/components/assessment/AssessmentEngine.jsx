import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Clock, Shield, AlertTriangle, CheckCircle, Maximize2, Minimize2,
  Lock, RefreshCw, ChevronRight, Save, Layers, Send
} from 'lucide-react';

// Workspaces
import ResumeScreeningWorkspace from './workspaces/ResumeScreeningWorkspace';
import AptitudeWorkspace from './workspaces/AptitudeWorkspace';
import TechnicalMCQWorkspace from './workspaces/TechnicalMCQWorkspace';
import CodingWorkspace from './workspaces/CodingWorkspace';
import DebuggingWorkspace from './workspaces/DebuggingWorkspace';
import FrontendWorkspace from './workspaces/FrontendWorkspace';
import BackendWorkspace from './workspaces/BackendWorkspace';
import DatabaseDesignWorkspace from './workspaces/DatabaseDesignWorkspace';
import SystemDesignWorkspace from './workspaces/SystemDesignWorkspace';
import ProductThinkingWorkspace from './workspaces/ProductThinkingWorkspace';
import FounderChallengeWorkspace from './workspaces/FounderChallengeWorkspace';
import UIDesignWorkspace from './workspaces/UIDesignWorkspace';
import QATestingWorkspace from './workspaces/QATestingWorkspace';
import AIMLWorkspace from './workspaces/AIMLWorkspace';
import CybersecurityWorkspace from './workspaces/CybersecurityWorkspace';
import DevOpsWorkspace from './workspaces/DevOpsWorkspace';
import CultureFitWorkspace from './workspaces/CultureFitWorkspace';
import BehavioralWorkspace from './workspaces/BehavioralWorkspace';
import HRInterviewWorkspace from './workspaces/HRInterviewWorkspace';
import AssignmentWorkspace from './workspaces/AssignmentWorkspace';

const AssessmentEngine = () => {
  const { jobId, roundNumber, assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assessmentData, setAssessmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(null); // seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Proctoring Violations
  const [violations, setViolations] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active state for candidate submission across workspaces
  const [candidateResponse, setCandidateResponse] = useState({});

  useEffect(() => {
    fetchOrGenerateAssessment();
  }, [jobId, roundNumber, assessmentId]);

  // Anti-cheat proctoring event listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !submitted) {
        logViolation('Tab switch or hidden window detected');
      }
    };

    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsFullscreen(isFS);
      if (!isFS && !submitted) {
        logViolation('Fullscreen mode exited');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [submitted]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const logViolation = (type) => {
    setViolations((prev) => [
      ...prev,
      { type, timestamp: new Date().toISOString() },
    ]);
  };

  const fetchOrGenerateAssessment = async () => {
    try {
      setLoading(true);
      let data;
      if (assessmentId) {
        const res = await api.get(`/assessments/${assessmentId}`);
        data = res.data;
      } else if (jobId && roundNumber) {
        const res = await api.get(`/assessments/job/${jobId}/round/${roundNumber}`);
        data = res.data;
      }

      setAssessmentData(data);
      if (data) {
        const durationMins = data.duration || 45;
        setTimeLeft(durationMins * 60);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assessment round');
    }
    setLoading(false);
  };

  const handleAutoSubmit = () => {
    if (!submitted) {
      handleSubmitAssessment(true);
    }
  };

  const handleSubmitAssessment = async (isAuto = false) => {
    if (submitted) return;
    setIsSubmitting(true);
    try {
      const idToSubmit = assessmentData?._id || assessmentId;
      await api.post(`/assessments/${idToSubmit}/submit`, {
        candidateResponse,
        violations,
        isAutoSubmit: isAuto,
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Submission error');
    }
    setIsSubmitting(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs) => {
    if (secs === null) return '--:--';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hv-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#8B5CF6', borderRightColor: '#FF6B6B' }}
        />
      </div>
    );
  }

  if (error || !assessmentData) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center bg-hv-bg">
        <div className="card p-8 text-center max-w-md space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-hv-text">Assessment Notice</h2>
          <p className="text-sm text-hv-muted">{error || 'Assessment configuration not available.'}</p>
          <button onClick={() => navigate('/interviews')} className="btn-primary py-2 text-xs">
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  // Detect Round Type
  const roundType = (
    assessmentData.roundType ||
    assessmentData.type ||
    assessmentData.assessmentConfig?.roundType ||
    'aptitude'
  ).toLowerCase();

  // Dynamic Workspace Router
  const renderWorkspace = () => {
    const props = {
      assessment: assessmentData,
      candidateResponse,
      setCandidateResponse,
      onSave: (val) => setCandidateResponse((prev) => ({ ...prev, ...val })),
      onSubmit: () => handleSubmitAssessment(false),
      violations,
    };

    if (roundType.includes('resume')) return <ResumeScreeningWorkspace {...props} />;
    if (roundType.includes('aptitude')) return <AptitudeWorkspace {...props} />;
    if (roundType.includes('technical') || roundType.includes('mcq')) return <TechnicalMCQWorkspace {...props} />;
    if (roundType.includes('coding')) return <CodingWorkspace {...props} />;
    if (roundType.includes('debug')) return <DebuggingWorkspace {...props} />;
    if (roundType.includes('frontend') || roundType.includes('ui')) return <FrontendWorkspace {...props} />;
    if (roundType.includes('backend') || roundType.includes('api')) return <BackendWorkspace {...props} />;
    if (roundType.includes('database') || roundType.includes('sql') || roundType.includes('mongo')) return <DatabaseDesignWorkspace {...props} />;
    if (roundType.includes('system') || roundType.includes('architecture')) return <SystemDesignWorkspace {...props} />;
    if (roundType.includes('product')) return <ProductThinkingWorkspace {...props} />;
    if (roundType.includes('founder')) return <FounderChallengeWorkspace {...props} />;
    if (roundType.includes('ux') || roundType.includes('design')) return <UIDesignWorkspace {...props} />;
    if (roundType.includes('qa') || roundType.includes('testing')) return <QATestingWorkspace {...props} />;
    if (roundType.includes('ai') || roundType.includes('ml')) return <AIMLWorkspace {...props} />;
    if (roundType.includes('security') || roundType.includes('cyber') || roundType.includes('ctf')) return <CybersecurityWorkspace {...props} />;
    if (roundType.includes('devops') || roundType.includes('docker') || roundType.includes('k8s')) return <DevOpsWorkspace {...props} />;
    if (roundType.includes('culture')) return <CultureFitWorkspace {...props} />;
    if (roundType.includes('behavioral')) return <BehavioralWorkspace {...props} />;
    if (roundType.includes('hr') || roundType.includes('interview')) return <HRInterviewWorkspace {...props} />;
    if (roundType.includes('assignment')) return <AssignmentWorkspace {...props} />;

    // Fallback default
    return <TechnicalMCQWorkspace {...props} />;
  };

  return (
    <div className="min-h-screen bg-hv-bg flex flex-col font-sans relative select-none">

      {/* Header bar */}
      <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-hv-violet to-hv-coral flex items-center justify-center text-white font-black text-sm">
            HV
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-hv-text line-clamp-1">
              {assessmentData.jobTitle || 'HireVerse Assessment Workspace'}
            </h1>
            <p className="text-[10px] text-hv-muted capitalize font-semibold">
              Round {assessmentData.roundNumber || 1} · {roundType} Workspace
            </p>
          </div>
        </div>

        {/* Center: Proctoring indicator & Timer */}
        <div className="flex items-center gap-4">
          {/* Proctoring Shield */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
            <Shield size={13} className="text-emerald-600" />
            <span>AI Proctoring Active</span>
            {violations.length > 0 && (
              <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full">
                {violations.length} flags
              </span>
            )}
          </div>

          {/* Countdown Timer */}
          {timeLeft !== null && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
              timeLeft < 300 ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-gray-100 text-hv-text'
            }`}>
              <Clock size={13} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-hv-muted hover:text-hv-text rounded-lg hover:bg-gray-100 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        {/* Right: Submit CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmitAssessment(false)}
            disabled={isSubmitting || submitted}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <Send size={13} /> Finish & Submit
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        {submitted ? (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card p-10 text-center max-w-md space-y-4 shadow-xl"
            >
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
              <h2 className="text-2xl font-black text-hv-text">Assessment Submitted!</h2>
              <p className="text-sm text-hv-muted leading-relaxed">
                Your responses and workspace artifacts have been recorded securely. The startup team will review your submission.
              </p>
              <button onClick={() => navigate('/interviews')} className="btn-primary w-full py-2.5 text-xs">
                Back to Interviews Pipeline
              </button>
            </motion.div>
          </div>
        ) : (
          renderWorkspace()
        )}
      </main>

    </div>
  );
};

export default AssessmentEngine;
