import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import api from '../services/api';
import { FaClock, FaExclamationTriangle, FaChevronLeft, FaChevronRight, FaPaperPlane, FaLock } from 'react-icons/fa';

const AssessmentTest = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  
  // Proctoring data
  const proctorData = useRef({
    tabSwitchCount: 0,
    fullscreenExitCount: 0,
    copyPasteAttempts: 0,
    rightClickAttempts: 0,
    totalTimeOutsideSecureMode: 0,
    violations: []
  });

  const [isFullscreenActive, setIsFullscreenActive] = useState(true);
  const [violationCount, setViolationCount] = useState(0);
  const [warningMsg, setWarningMsg] = useState('');
  const exitTimeRef = useRef(null);

  const showWarning = (msg) => {
    setWarningMsg(msg);
    setTimeout(() => setWarningMsg(''), 5000);
  };

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (submitting || isSubmitted) return;
    setSubmitting(true);
    
    try {
      // Calculate final time outside secure mode if currently outside
      if (exitTimeRef.current) {
        const outsideTime = Math.round((Date.now() - exitTimeRef.current) / 1000);
        proctorData.current.totalTimeOutsideSecureMode += outsideTime;
      }

      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {});
      }
      
      const payload = {
        answers,
        proctorData: proctorData.current
      };
      
      await api.post(`/assessments/${assessmentId}/submit`, payload);
      setIsSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit. Please try again or contact support.');
    } finally {
      setSubmitting(false);
    }
  }, [answers, assessmentId, submitting, isSubmitted]);

  // Unified violation adder
  const addViolation = useCallback((type, msg) => {
    const time = new Date();
    proctorData.current.violations.push({ type, time, message: msg });
    
    if (type === 'TAB_SWITCH') {
      proctorData.current.tabSwitchCount += 1;
    } else if (type === 'FULLSCREEN_EXIT') {
      proctorData.current.fullscreenExitCount += 1;
    } else if (type === 'COPY_PASTE') {
      proctorData.current.copyPasteAttempts += 1;
    } else if (type === 'RIGHT_CLICK') {
      proctorData.current.rightClickAttempts += 1;
    }

    // Only TAB_SWITCH and FULLSCREEN_EXIT count towards the 3 allowed violations limit
    if (type === 'TAB_SWITCH' || type === 'FULLSCREEN_EXIT') {
      setViolationCount(prev => {
        const next = prev + 1;
        if (next > 3) {
          // Exceeded allowed violations -> auto submit
          setTimeout(() => {
            alert('You exceeded the allowed security violations. Your assessment is being submitted automatically.');
            handleSubmit(true);
          }, 0);
        }
        return next;
      });
    }
  }, [handleSubmit]);

  // Fetch assessment
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const { data } = await api.get(`/assessments/${assessmentId}/report`).catch(() => ({ data: null }));
        if (data?.attempt) {
          setError('This assessment has already been completed.');
          setLoading(false);
          return;
        }

        const res = await api.get(`/assessments/${assessmentId}`);
        const asm = res.data;
        if (asm.status === 'Completed') {
          setError('Assessment already completed.');
        } else {
          setAssessment(asm);
          
          // Calculate remaining time based on startTime + duration
          const startMs = new Date(asm.startTime).getTime();
          const endMs = startMs + asm.duration * 60000;
          const nowMs = Date.now();
          const remainingSecs = Math.max(0, Math.floor((endMs - nowMs) / 1000));
          setTimeLeft(remainingSecs);
          
          if (remainingSecs === 0) {
            setError('Time is already up for this assessment.');
          }
        }
      } catch (err) {
        setError('Failed to load assessment. It might not exist.');
      }
      setLoading(false);
    };
    fetchAssessment();
  }, [assessmentId]);

  // Timer
  useEffect(() => {
    if (!assessment || timeLeft <= 0 || submitting || isSubmitted) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [assessment, timeLeft, submitting, isSubmitted, handleSubmit]);

  // Proctoring Events
  useEffect(() => {
    if (!assessment || submitting || isSubmitted || error) return;

    // Check if loaded and NOT in fullscreen on start
    if (!document.fullscreenElement) {
      setIsFullscreenActive(false);
      exitTimeRef.current = Date.now();
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation('TAB_SWITCH', 'Switched away from the test tab');
        showWarning('Tab switching detected! This violation has been recorded.');
      }
    };

    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setIsFullscreenActive(true);
        if (exitTimeRef.current) {
          const outsideTime = Math.round((Date.now() - exitTimeRef.current) / 1000);
          proctorData.current.totalTimeOutsideSecureMode += outsideTime;
          exitTimeRef.current = null;
        }
      } else {
        setIsFullscreenActive(false);
        exitTimeRef.current = Date.now();
        addViolation('FULLSCREEN_EXIT', 'Exited secure fullscreen mode');
        showWarning('Fullscreen exited! Please return to secure fullscreen. Violations are recorded.');
      }
    };

    const handleCopyPaste = (e) => {
      e.preventDefault();
      addViolation('COPY_PASTE', `Attempted to ${e.type}`);
      showWarning('Copying/Pasting is disabled and flagged as a security violation.');
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      addViolation('RIGHT_CLICK', 'Attempted right click context menu');
      showWarning('Right click is disabled and flagged as a security violation.');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [assessment, submitting, isSubmitted, error, addViolation]);

  const handleAnswerChange = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const showOverlay = !isFullscreenActive && !loading && !error && !submitting && !isSubmitted;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a2e]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a2e] px-4 text-white">
        <div className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl">
          <FaExclamationTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold">{error}</h2>
          <button onClick={() => navigate('/interviews')} className="mt-4 px-6 py-2 bg-brand-purple rounded-xl font-semibold">Back to Interviews</button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a2e] px-4 text-white">
        <div className="text-center p-8 bg-white/5 border border-emerald-500/20 rounded-3xl max-w-md space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Assessment Submitted Successfully</h2>
          <div className="space-y-2 text-sm text-gray-400 leading-relaxed">
            <p>Your assessment has been submitted.</p>
            <p>Your results have been sent to the company.</p>
            <p>The recruiter will update your application status.</p>
          </div>
          <button
            onClick={() => navigate('/interviews')}
            className="w-full py-3 bg-brand-purple hover:bg-opacity-90 rounded-xl font-semibold transition-all"
          >
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  const q = assessment.questions[currentQIndex];
  const totalQ = assessment.questions.length;
  
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white flex flex-col relative select-none">
      
      {/* Secure Mode Blocking Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md text-white p-6 text-center select-none">
          <div className="max-w-md p-8 bg-brand-medium/30 border border-red-500/30 rounded-3xl space-y-6 shadow-2xl">
            <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black text-white">⚠ Secure Mode Disabled</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              You exited fullscreen mode. Violation recorded: <strong className="text-red-400">Fullscreen Exit</strong>.
            </p>
            <div className="bg-red-500/10 border border-red-500/20 py-2.5 rounded-xl text-red-400 font-bold text-sm">
              Violations: {violationCount}/3
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              To continue your assessment, return to secure fullscreen mode. The test timer continues running in the background.
            </p>
            <button
              onClick={() => {
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen().catch(() => {
                    alert('Fullscreen request denied. Please check your browser settings.');
                  });
                }
              }}
              className="w-full py-3 bg-brand-purple hover:bg-opacity-90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-purple/20"
            >
              Return to Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <div className={`h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#161625] ${showOverlay ? 'filter blur-2xl pointer-events-none' : ''}`}>
        <div className="font-bold text-lg text-brand-accent tracking-widest">HIREVERSE ASSESS</div>
        
        {warningMsg && (
          <div className="hidden md:flex animate-pulse items-center gap-2 text-red-400 bg-red-400/10 px-4 py-1.5 rounded-full text-xs font-bold border border-red-400/20">
            <FaExclamationTriangle /> {warningMsg}
          </div>
        )}

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
            <FaClock /> {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to finish and submit the assessment early?')) {
                handleSubmit(false);
              }
            }}
            disabled={submitting || showOverlay}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-brand-dark rounded-xl font-bold transition-colors disabled:opacity-50"
          >
            <FaPaperPlane /> Finish
          </button>
        </div>
      </div>

      <div className={`flex flex-1 overflow-hidden ${showOverlay ? 'filter blur-2xl pointer-events-none' : ''}`}>
        {/* Left Sidebar: Navigator */}
        <div className="w-64 border-r border-white/10 bg-[#161625] p-4 flex flex-col hidden md:flex">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Question Navigator</p>
          <div className="grid grid-cols-5 gap-2">
            {assessment.questions.map((question, idx) => {
              const isAns = !!answers[question._id];
              const isCurr = idx === currentQIndex;
              return (
                <button
                  key={question._id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all border ${
                    isCurr 
                      ? 'border-brand-purple bg-brand-purple text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]' 
                      : isAns 
                        ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400'
                        : 'border-white/10 hover:bg-white/5 text-gray-400'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          
          <div className="mt-auto space-y-2 text-xs text-gray-400">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" /> Answered</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-brand-purple border border-brand-purple" /> Current</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded border border-white/10" /> Not Answered</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#1a1a2e] overflow-y-auto">
          {warningMsg && (
            <div className="md:hidden animate-pulse flex items-center gap-2 text-red-400 bg-red-400/10 p-3 text-xs font-bold border-b border-red-400/20">
              <FaExclamationTriangle /> {warningMsg}
            </div>
          )}

          <div className="p-6 md:p-10 flex-1 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold text-brand-purple uppercase tracking-wider">
                Question {currentQIndex + 1} of {totalQ}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 text-gray-400 border border-white/10 uppercase tracking-widest">
                {q.type}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-semibold text-white leading-relaxed mb-8">
              {q.type === 'MCQ' ? q.question : q.problemTitle}
            </h2>

            {q.type === 'MCQ' ? (
              <div className="space-y-4">
                {q.options.map((opt, i) => {
                  const isSelected = answers[q._id] === opt;
                  return (
                    <label
                      key={i}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand-purple bg-brand-purple/10'
                          : 'border-white/10 hover:bg-white/5 bg-brand-medium/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q._id}
                        value={opt}
                        checked={isSelected}
                        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                        className="w-4 h-4 accent-brand-purple"
                      />
                      <span className="text-gray-200">{opt}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-sm text-gray-300 leading-relaxed bg-brand-medium/20 p-4 rounded-xl border border-white/10">
                  {q.description}
                  
                  <div className="mt-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-xs">
                      <p className="text-gray-500 mb-1">Sample Input:</p>
                      <p className="text-emerald-400">{q.sampleInput}</p>
                    </div>
                    <div className="flex-1 bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-xs">
                      <p className="text-gray-500 mb-1">Sample Output:</p>
                      <p className="text-emerald-400">{q.sampleOutput}</p>
                    </div>
                  </div>
                </div>

                <div className="h-[400px] rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={answers[q._id] || '// Write your code here...\n'}
                    onChange={(val) => handleAnswerChange(q._id, val)}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Footer Actions */}
          <div className="p-4 border-t border-white/10 bg-[#161625] flex justify-between">
            <button
              onClick={() => setCurrentQIndex(prev => prev - 1)}
              disabled={currentQIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
            >
              <FaChevronLeft /> Previous
            </button>
            <button
              onClick={() => setCurrentQIndex(prev => prev + 1)}
              disabled={currentQIndex === totalQ - 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-brand-purple hover:bg-opacity-90 text-white disabled:opacity-30 transition-colors"
            >
              Next <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentTest;
