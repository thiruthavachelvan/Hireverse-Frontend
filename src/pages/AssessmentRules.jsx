import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaExclamationTriangle, FaDesktop, FaCheckCircle, FaBan } from 'react-icons/fa';

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
      <div className="flex min-h-screen items-center justify-center bg-brand-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-dark px-4">
        <div className="bg-brand-medium/20 border border-white/10 p-8 rounded-2xl max-w-lg text-center space-y-4">
          <FaExclamationTriangle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Cannot Start Assessment</h2>
          <p className="text-gray-400">{error}</p>
          <button onClick={() => navigate('/interviews')} className="px-6 py-2 bg-brand-purple hover:bg-opacity-90 rounded-xl font-semibold text-white mt-4">
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white">Online Assessment Instructions</h1>
          <p className="text-gray-400">Please read the following instructions carefully before starting.</p>
        </div>

        <div className="bg-brand-medium/20 border border-brand-purple/30 rounded-3xl p-8 space-y-6 shadow-xl shadow-brand-purple/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Questions</p>
              <p className="text-xl font-bold text-white">{assessment.questions?.length || 0}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Duration</p>
              <p className="text-xl font-bold text-white">{assessment.duration} Minutes</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-lg font-bold text-brand-accent flex items-center gap-2">
              <FaDesktop /> Secure Browser Environment
            </h3>
            
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-emerald-400 mt-1 flex-shrink-0" />
                <p>The test will launch in <strong>Fullscreen Mode</strong>. Exiting fullscreen will be recorded as a violation.</p>
              </li>
              <li className="flex items-start gap-3">
                <FaBan className="text-red-400 mt-1 flex-shrink-0" />
                <p><strong>Do not switch tabs or windows.</strong> Tab navigation is actively monitored and will reduce your Trust Score.</p>
              </li>
              <li className="flex items-start gap-3">
                <FaBan className="text-red-400 mt-1 flex-shrink-0" />
                <p><strong>Copying and pasting</strong> is disabled and monitored. Attempting to paste external code will flag your submission.</p>
              </li>
              <li className="flex items-start gap-3">
                <FaExclamationTriangle className="text-amber-400 mt-1 flex-shrink-0" />
                <p>If your Trust Score drops too low due to violations, your assessment may be disqualified by the employer.</p>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={handleStart}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-brand-dark font-extrabold rounded-xl text-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              Agree & Start Assessment
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              By clicking this button, you agree to the proctoring rules and will enter fullscreen mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentRules;
