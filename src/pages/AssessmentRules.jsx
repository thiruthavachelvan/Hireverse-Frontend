import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AlertTriangle, Monitor, CheckCircle2, Ban, ArrowLeft } from 'lucide-react';

const AssessmentRules = () => {
  const { jobId, roundNumber } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const { data } = await api.get(`/assessments/job/${jobId}/round/${roundNumber}`);
        if (data.status === 'Completed') {
          setError('You have already completed this assessment.');
        } else {
          setAssessment(data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load assessment details.');
      }
      setLoading(false);
    };
    fetchAssessment();
  }, [jobId, roundNumber]);

  const handleStart = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => {
        navigate(`/assessment/${assessment._id}`);
      }).catch(err => {
        alert('Could not enable fullscreen. Please ensure your browser allows it.');
      });
    } else {
      navigate(`/assessment/${assessment._id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hv-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-hv-violet border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hv-bg px-4">
        <div className="card p-8 rounded-3xl max-w-lg text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-hv-danger mx-auto" />
          <h2 className="text-xl font-black text-hv-text">Cannot Start Assessment</h2>
          <p className="text-hv-muted">{error}</p>
          <button onClick={() => navigate('/interviews')} className="btn-primary mt-4">
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hv-bg text-hv-text px-4 py-12 assessment-shell">
      <div className="max-w-2xl mx-auto space-y-8">
        <button onClick={() => navigate('/interviews')} className="flex items-center gap-2 text-sm font-semibold text-hv-muted hover:text-hv-text">
          <ArrowLeft size={16} /> Back to Interviews
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-hv-text">Online Assessment Instructions</h1>
          <p className="text-hv-muted">Please read the following instructions carefully before starting.</p>
        </div>

        <div className="card p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] uppercase tracking-[0.2em] text-hv-subtle font-bold mb-1">Total Questions</p>
              <p className="text-xl font-black text-hv-text">{assessment.questions?.length || 0}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] uppercase tracking-[0.2em] text-hv-subtle font-bold mb-1">Duration</p>
              <p className="text-xl font-black text-hv-text">{assessment.duration} Minutes</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-lg font-black text-hv-violet flex items-center gap-2">
              <Monitor size={18} /> Secure Browser Environment
            </h3>
            
            <ul className="space-y-3 text-sm text-hv-muted">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-hv-success mt-1 flex-shrink-0" size={16} />
                <p>The test will launch in <strong>Fullscreen Mode</strong>. Exiting fullscreen will be recorded as a violation.</p>
              </li>
              <li className="flex items-start gap-3">
                <Ban className="text-hv-danger mt-1 flex-shrink-0" size={16} />
                <p><strong>Do not switch tabs or windows.</strong> Tab navigation is actively monitored and will reduce your Trust Score.</p>
              </li>
              <li className="flex items-start gap-3">
                <Ban className="text-hv-danger mt-1 flex-shrink-0" size={16} />
                <p><strong>Copying and pasting</strong> is disabled and monitored. Attempting to paste external code will flag your submission.</p>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="text-hv-warning mt-1 flex-shrink-0" size={16} />
                <p>If your Trust Score drops too low due to violations, your assessment may be disqualified by the employer.</p>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={handleStart}
              className="btn-primary w-full py-3.5 text-base"
            >
              Agree & Start Assessment
            </button>
            <p className="text-center text-xs text-hv-subtle mt-3">
              By clicking this button, you agree to the proctoring rules and will enter fullscreen mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentRules;
