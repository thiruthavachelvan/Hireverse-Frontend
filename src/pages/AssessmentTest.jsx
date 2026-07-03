import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import api from '../services/api';
import { Clock3, AlertTriangle, ChevronLeft, ChevronRight, Send, ShieldAlert } from 'lucide-react';

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
      <div className="flex min-h-screen items-center justify-center bg-hv-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-hv-violet border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hv-bg px-4 text-hv-text">
        <div className="text-center p-8 card max-w-lg">
          <AlertTriangle className="w-12 h-12 text-hv-danger mx-auto mb-4" />
          <h2 className="text-xl font-black">{error}</h2>
          <button onClick={() => navigate('/interviews')} className="btn-primary mt-4">Back to Interviews</button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hv-bg px-4 text-hv-text">
        <div className="text-center p-8 card max-w-md space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-hv-success rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-hv-text">Assessment Submitted Successfully</h2>
          <div className="space-y-2 text-sm text-hv-muted leading-relaxed">
            <p>Your assessment has been submitted.</p>
            <p>Your results have been sent to the company.</p>
            <p>The recruiter will update your application status.</p>
          </div>
          <button
            onClick={() => navigate('/interviews')}
            className="btn-primary w-full"
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
    <div className="min-h-screen bg-hv-bg text-hv-text flex flex-col relative select-none assessment-shell">
      
      {/* Secure Mode Blocking Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md text-white p-6 text-center select-none">
          <div className="max-w-md p-8 card space-y-6">
            <ShieldAlert className="w-16 h-16 text-hv-danger mx-auto animate-bounce" />
            <h2 className="text-2xl font-black text-hv-text">Secure Mode Disabled</h2>
            <p className="text-hv-muted text-sm leading-relaxed">
              You exited fullscreen mode. Violation recorded: <strong className="text-hv-danger">Fullscreen Exit</strong>.
            </p>
            <div className="bg-red-50 border border-red-100 py-2.5 rounded-xl text-red-500 font-bold text-sm">
              Violations: {violationCount}/3
            </div>
            <p className="text-xs text-hv-subtle leading-relaxed">
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
              className="btn-primary w-full"
            >
              Return to Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <div className={`h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white ${showOverlay ? 'filter blur-2xl pointer-events-none' : ''}`}>
        <div className="font-black text-lg gradient-text tracking-widest">HIREVERSE ASSESS</div>
        
        {warningMsg && (
          <div className="hidden md:flex animate-pulse items-center gap-2 text-hv-danger bg-red-50 px-4 py-1.5 rounded-full text-xs font-bold border border-red-100">
            <AlertTriangle size={14} /> {warningMsg}
          </div>
        )}

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 font-mono text-xl font-black ${timeLeft < 300 ? 'text-hv-danger animate-pulse' : 'text-hv-success'}`}>
            <Clock3 size={18} /> {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to finish and submit the assessment early?')) {
                handleSubmit(false);
              }
            }}
            disabled={submitting || showOverlay}
            className="flex items-center gap-2 px-5 py-2 btn-primary rounded-xl"
          >
            <Send size={16} /> Finish
          </button>
        </div>
      </div>

      <div className={`flex flex-1 overflow-hidden ${showOverlay ? 'filter blur-2xl pointer-events-none' : ''}`}>
        {/* Left Sidebar: Navigator */}
        <div className="w-64 border-r border-gray-100 bg-gray-50/50 p-4 flex flex-col hidden md:flex">
          <p className="text-[10px] font-bold text-hv-subtle uppercase tracking-[0.2em] mb-4">Question Navigator</p>
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
          
          <div className="mt-auto space-y-2 text-xs text-hv-muted">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200" /> Answered</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-hv-violet border border-hv-violet" /> Current</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded border border-gray-200" /> Not Answered</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-hv-bg overflow-y-auto">
          {warningMsg && (
            <div className="md:hidden animate-pulse flex items-center gap-2 text-hv-danger bg-red-50 p-3 text-xs font-bold border-b border-red-100">
              <AlertTriangle size={14} /> {warningMsg}
            </div>
          )}

          <div className="p-6 md:p-10 flex-1 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-black text-hv-violet uppercase tracking-[0.2em]">
                Question {currentQIndex + 1} of {totalQ}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-hv-subtle border border-gray-200 uppercase tracking-[0.2em]">
                {q.type}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-semibold text-hv-text leading-relaxed mb-8">
              {q.type === 'MCQ' ? q.question : q.problemTitle}
            </h2>

            {q.type === 'MCQ' ? (
              <div className="space-y-4">
                {q.options.map((opt, i) => {
                  const isSelected = answers[q._id] === opt;
                  return (
                    <label
                      key={i}
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-hv-violet bg-violet-50'
                          : 'border-gray-200 hover:bg-gray-50 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q._id}
                        value={opt}
                        checked={isSelected}
                        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                        className="w-4 h-4 accent-hv-violet"
                      />
                      <span className="text-hv-text">{opt}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-sm text-hv-muted leading-relaxed bg-white p-4 rounded-2xl border border-gray-200">
                  {q.description}
                  
                  <div className="mt-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100 font-mono text-xs">
                      <p className="text-hv-subtle mb-1">Sample Input:</p>
                      <p className="text-hv-success">{q.sampleInput}</p>
                    </div>
                    <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100 font-mono text-xs">
                      <p className="text-hv-subtle mb-1">Sample Output:</p>
                      <p className="text-hv-success">{q.sampleOutput}</p>
                    </div>
                  </div>
                </div>

                <div className="h-[400px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
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
          <div className="p-4 border-t border-gray-100 bg-white flex justify-between">
            <button
              onClick={() => setCurrentQIndex(prev => prev - 1)}
              disabled={currentQIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gray-50 hover:bg-gray-100 text-hv-text disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={() => setCurrentQIndex(prev => prev + 1)}
              disabled={currentQIndex === totalQ - 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold btn-primary disabled:opacity-30"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentTest;
