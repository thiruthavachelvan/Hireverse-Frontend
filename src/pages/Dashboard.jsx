import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
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
    <div className="flex min-h-screen items-center justify-center bg-brand-dark text-white">
      <div>Invalid account type.</div>
    </div>
  );
};

export default Dashboard;
