import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CompanyDashboard from './CompanyDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.accountType === 'professional') {
    return <Navigate to="/feed" replace />;
  }

  if (user.accountType === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (user.accountType === 'company') {
    return <CompanyDashboard />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hv-bg p-6">
      <div className="card max-w-sm w-full p-8 text-center space-y-4">
        <h2 className="text-xl font-black gradient-text">Configuration Error</h2>
        <p className="text-sm text-hv-muted">Invalid account type detected. Please sign out and try again.</p>
      </div>
    </div>
  );
};

export default Dashboard;
