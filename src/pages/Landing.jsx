import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserFriends, FaBriefcase, FaChartLine, FaShareAlt } from 'react-icons/fa';

const Landing = () => {
  const { user } = useAuth();

  // Redirect to dashboard if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: <FaShareAlt className="text-3xl text-brand-purple" />,
      title: 'Professional Feed',
      desc: 'Share updates, achievements, ideas, and connect with other industry professionals.',
    },
    {
      icon: <FaBriefcase className="text-3xl text-brand-purple" />,
      title: 'Seamless Job Applying',
      desc: 'Browse openings posted directly by companies and apply with a single click.',
    },
    {
      icon: <FaChartLine className="text-3xl text-brand-purple" />,
      title: 'Application Tracker',
      desc: 'Track your hiring stage in real-time from application submission to final selection.',
    },
    {
      icon: <FaUserFriends className="text-3xl text-brand-purple" />,
      title: 'Follow & Network',
      desc: 'Follow professionals or companies to view their latest activities and job listings.',
    },
  ];

  return (
    <div className="min-h-screen gradient-bg text-white flex flex-col justify-between">
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 py-20 text-center flex-grow flex flex-col justify-center items-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full glassmorphism text-xs font-semibold uppercase tracking-wider text-brand-accent">
          🚀 Next Gen Professional Network
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl">
          Connect. Grow.<br />
          <span className="gradient-text">Get Hired.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
          The professional network where opportunities meet talent. Share updates, build connections, apply for jobs, and progress through interactive recruitment dashboards.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link
            to="/register"
            className="bg-brand-purple hover:bg-opacity-90 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-brand-purple/20 transition-all text-center"
          >
            Start Your Journey
          </Link>
          <Link
            to="/login"
            className="glassmorphism hover:bg-brand-medium/50 text-white font-bold px-8 py-4 rounded-xl transition-all text-center"
          >
            Login to Account
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-7xl w-full">
          {features.map((feat, index) => (
            <div
              key={index}
              className="glassmorphism p-6 rounded-2xl text-left hover:border-brand-purple/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 bg-brand-medium rounded-lg inline-block mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-400">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Footer */}
      <footer className="border-t border-brand-medium py-6 px-6 text-center text-gray-500 text-sm bg-brand-dark">
        <p>© 2026 HireVerse Inc. Created for professional growth and interactive recruitment.</p>
      </footer>
    </div>
  );
};

export default Landing;
