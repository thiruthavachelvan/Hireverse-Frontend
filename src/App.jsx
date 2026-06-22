import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState, useEffect } from 'react';
import api from './services/api';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import AssessmentRules from './pages/AssessmentRules';
import AssessmentTest from './pages/AssessmentTest';
import MyApplications from './pages/MyApplications';
import ProfessionalFeed from './pages/ProfessionalFeed';
import Interviews from './pages/Interviews';
import AdminDashboard from './pages/AdminDashboard';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import { FaTimes, FaBriefcase } from 'react-icons/fa';

function JobAlertPopup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeAlert, setActiveAlert] = useState(null);

  useEffect(() => {
    if (user?.accountType !== 'professional') return;

    const checkJobAlerts = async () => {
      try {
        const { data } = await api.get('/notifications');
        // Find first unread job_posted notification
        const unreadJobAlert = data.find(n => n.type === 'job_posted' && !n.isRead);
        if (unreadJobAlert) {
          setActiveAlert(unreadJobAlert);
        }
      } catch (err) {
        console.error('Error fetching job alerts:', err);
      }
    };

    checkJobAlerts();
    const interval = setInterval(checkJobAlerts, 45000); // Check every 45s
    return () => clearInterval(interval);
  }, [user]);

  if (!activeAlert) return null;

  const handleClose = async () => {
    try {
      await api.put(`/notifications/${activeAlert._id}/read`);
      setActiveAlert(null);
    } catch {
      setActiveAlert(null);
    }
  };

  const handleView = async () => {
    try {
      await api.put(`/notifications/${activeAlert._id}/read`);
      const jobId = activeAlert.relatedJobId?._id || activeAlert.relatedJobId;
      setActiveAlert(null);
      if (jobId) {
        navigate(`/jobs/${jobId}`);
      }
    } catch {
      setActiveAlert(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a2e] border-2 border-violet-500/50 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        <div className="text-center space-y-4 pt-4">
          <div className="w-16 h-16 bg-violet-600/20 border border-violet-500/40 rounded-2xl flex items-center justify-center mx-auto text-violet-400">
            <FaBriefcase className="w-8 h-8" />
          </div>
          
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full font-bold">
              New Job Alert
            </span>
            <h2 className="text-xl font-black text-white pt-2">{activeAlert.title}</h2>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed max-w-sm mx-auto">
            {activeAlert.message}
          </p>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white rounded-xl text-sm font-semibold transition-all"
            >
              Dismiss
            </button>
            <button
              onClick={handleView}
              className="flex-1 px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-500/25"
            >
              View Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-brand-dark flex flex-col justify-between">
          <Navbar />
          <JobAlertPopup />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private routes (All roles) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:userId"
                element={
                  <ProtectedRoute>
                    <PublicProfile />
                  </ProtectedRoute>
                }
              />

              {/* Private routes (Professional/Candidates only) */}
              <Route
                path="/feed"
                element={
                  <ProtectedRoute allowedRoles={['professional']}>
                    <ProfessionalFeed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interviews"
                element={
                  <ProtectedRoute allowedRoles={['professional']}>
                    <Interviews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessment/job/:jobId/round/:roundNumber/rules"
                element={
                  <ProtectedRoute allowedRoles={['professional']}>
                    <AssessmentRules />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessment/:assessmentId"
                element={
                  <ProtectedRoute allowedRoles={['professional']}>
                    <AssessmentTest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/companies"
                element={
                  <ProtectedRoute allowedRoles={['professional']}>
                    <Companies />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/companies/:id"
                element={
                  <ProtectedRoute allowedRoles={['professional']}>
                    <CompanyDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute allowedRoles={['professional']}>
                    <Jobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs/:id"
                element={
                  <ProtectedRoute allowedRoles={['professional']}>
                    <JobDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-applications"
                element={
                  <ProtectedRoute allowedRoles={['professional']}>
                    <MyApplications />
                  </ProtectedRoute>
                }
              />

              {/* Private routes (Admin only) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Landing />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
