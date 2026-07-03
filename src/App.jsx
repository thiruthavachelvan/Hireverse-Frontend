import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from './services/api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import AppLoader from './components/AppLoader';
import PageTransition from './components/PageTransition';
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
import Notifications from './pages/Notifications';
import { Briefcase, X } from 'lucide-react';

// ─── Job Alert Popup (redesigned) ───────────────────────────────
function JobAlertPopup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeAlert, setActiveAlert] = useState(null);

  useEffect(() => {
    if (user?.accountType !== 'professional') return;
    const checkJobAlerts = async () => {
      try {
        const { data } = await api.get('/notifications');
        const unreadJobAlert = data.find(n => n.type === 'job_posted' && !n.isRead);
        if (unreadJobAlert) setActiveAlert(unreadJobAlert);
      } catch { /* ignore */ }
    };
    checkJobAlerts();
    const interval = setInterval(checkJobAlerts, 45000);
    return () => clearInterval(interval);
  }, [user]);

  if (!activeAlert) return null;

  const handleClose = async () => {
    try { await api.put(`/notifications/${activeAlert._id}/read`); } catch { /* ignore */ }
    setActiveAlert(null);
  };

  const handleView = async () => {
    try { await api.put(`/notifications/${activeAlert._id}/read`); } catch { /* ignore */ }
    const jobId = activeAlert.relatedJobId?._id || activeAlert.relatedJobId;
    setActiveAlert(null);
    if (jobId) navigate(`/jobs/${jobId}`);
  };

  return (
    <AnimatePresence>
      {activeAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="bg-white rounded-3xl p-8 max-w-md w-full relative overflow-hidden"
            style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}
          >
            {/* Gradient bg accent */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #FF6B6B, #8B5CF6)' }} />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="relative z-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: 'linear-gradient(135deg, rgba(255,107,107,0.12), rgba(139,92,246,0.12))' }}>
                <Briefcase size={24} className="text-hv-violet" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full chip chip-violet">
                  New Job Alert
                </span>
                <h2 className="text-xl font-black text-hv-text mt-3">{activeAlert.title}</h2>
              </div>
              <p className="text-sm text-hv-muted leading-relaxed">{activeAlert.message}</p>
              <div className="flex gap-3 pt-2">
                <button onClick={handleClose} className="btn-ghost flex-1 py-2.5 text-sm">Dismiss</button>
                <button onClick={handleView} className="btn-primary flex-1 py-2.5 text-sm">View Listing</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Animated Routes wrapper ─────────────────────────────────────
function AnimatedRoutes() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  // Show AppLoader until auth resolves + minimum display time
  if (loading && !appReady) {
    return <AppLoader onDone={() => setAppReady(true)} />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

        {/* All authenticated */}
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><PageTransition><PublicProfile /></PageTransition></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><PageTransition><Notifications /></PageTransition></ProtectedRoute>} />

        {/* Professional only */}
        <Route path="/feed" element={<ProtectedRoute allowedRoles={['professional']}><PageTransition><ProfessionalFeed /></PageTransition></ProtectedRoute>} />
        <Route path="/interviews" element={<ProtectedRoute allowedRoles={['professional']}><PageTransition><Interviews /></PageTransition></ProtectedRoute>} />
        <Route path="/assessment/job/:jobId/round/:roundNumber/rules" element={<ProtectedRoute allowedRoles={['professional']}><PageTransition><AssessmentRules /></PageTransition></ProtectedRoute>} />
        <Route path="/assessment/:assessmentId" element={<ProtectedRoute allowedRoles={['professional']}><PageTransition><AssessmentTest /></PageTransition></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute allowedRoles={['professional']}><PageTransition><Companies /></PageTransition></ProtectedRoute>} />
        <Route path="/companies/:id" element={<ProtectedRoute allowedRoles={['professional']}><PageTransition><CompanyDetail /></PageTransition></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute allowedRoles={['professional']}><PageTransition><Jobs /></PageTransition></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<ProtectedRoute allowedRoles={['professional']}><PageTransition><JobDetail /></PageTransition></ProtectedRoute>} />
        <Route path="/my-applications" element={<ProtectedRoute allowedRoles={['professional']}><PageTransition><MyApplications /></PageTransition></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<PageTransition><Landing /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

// ─── App shell ───────────────────────────────────────────────────
function AppShell() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-hv-bg">
      <Navbar />
      <JobAlertPopup />
      {/* Floating sidebar - shown for all authenticated users */}
      {user && <Sidebar />}
      {/* Main content - offset for sidebar when authenticated */}
      <main className={user ? 'pl-20 lg:pl-24 min-h-[calc(100vh-64px)]' : 'min-h-[calc(100vh-64px)]'}>
        <AnimatedRoutes />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </Router>
  );
}

export default App;
