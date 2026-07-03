import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import {
  FaBuilding, FaUsers, FaBriefcase, FaClipboardList,
  FaCheckCircle, FaClock, FaTimesCircle, FaSearch,
  FaShieldAlt, FaUserTie, FaStar,
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    whileHover={{ y: -3, scale: 1.01 }}
    className="glassmorphism rounded-2xl p-5 flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-hv-muted text-sm">{label}</p>
      <p className="text-hv-text text-2xl font-black">{value ?? '—'}</p>
    </div>
  </motion.div>
);

const StatusBadge = ({ status }) => {
  const config = {
    verified: { cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: <FaCheckCircle />, label: 'Verified' },
    pending: { cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: <FaClock />, label: 'Pending' },
    rejected: { cls: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <FaTimesCircle />, label: 'Rejected' },
  }[status] || { cls: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: null, label: status };

  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-full ${config.cls}`}>
      {config.icon} {config.label}
    </span>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('companies');
  const [companies, setCompanies] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, companiesRes, profRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/companies'),
        api.get('/admin/professionals'),
      ]);
      setStats(statsRes.data);
      setCompanies(companiesRes.data);
      setProfessionals(profRes.data);
    } catch (err) {
      showToast('Failed to load admin data', 'error');
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleVerify = async (companyId, status) => {
    setActionLoading(prev => ({ ...prev, [companyId]: true }));
    try {
      await api.put(`/admin/companies/${companyId}/verify`, { status });
      setCompanies(prev =>
        prev.map(c => c._id === companyId ? { ...c, verificationStatus: status } : c)
      );
      setStats(prev => prev ? {
        ...prev,
        verifiedCompanies: status === 'verified' ? prev.verifiedCompanies + 1 : Math.max(0, prev.verifiedCompanies - 1),
        pendingCompanies: status === 'pending' ? prev.pendingCompanies + 1 : Math.max(0, prev.pendingCompanies - 1),
      } : prev);
      showToast(`Company ${status === 'verified' ? 'verified' : status === 'rejected' ? 'rejected' : 'moved to pending'} successfully`);
    } catch {
      showToast('Action failed. Try again.', 'error');
    }
    setActionLoading(prev => ({ ...prev, [companyId]: false }));
  };

  const filteredCompanies = companies.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const matchFilter = filterStatus === 'all' || c.verificationStatus === filterStatus;
    return matchSearch && matchFilter;
  });

  const filteredProfessionals = professionals.filter(p => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
  });

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-hv-bg px-4 py-8 admin-dashboard-shell relative overflow-hidden">
      <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl transition-all ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4"
        >
          <div className="p-3 bg-violet-500/20 rounded-2xl">
            <FaShieldAlt className="w-7 h-7 text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-hv-text">Admin Dashboard</h1>
            <p className="text-hv-muted text-sm mt-1">Manage and verify companies on the HireVerse platform</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="glassmorphism rounded-2xl h-24 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard icon={FaBuilding} label="Total Companies" value={stats?.totalCompanies} color="bg-violet-500/30" />
            <StatCard icon={FaCheckCircle} label="Verified" value={stats?.verifiedCompanies} color="bg-emerald-500/30" />
            <StatCard icon={FaClock} label="Pending" value={stats?.pendingCompanies} color="bg-amber-500/30" />
            <StatCard icon={FaUserTie} label="Professionals" value={stats?.totalProfessionals} color="bg-blue-500/30" />
            <StatCard icon={FaBriefcase} label="Total Jobs" value={stats?.totalJobs} color="bg-pink-500/30" />
            <StatCard icon={FaClipboardList} label="Applications" value={stats?.totalApplications} color="bg-cyan-500/30" />
          </div>
        )}

        {/* Tabs + Search + Filter */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="glassmorphism rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 flex-wrap gap-4">
            <div className="flex gap-2">
              {[
                { id: 'companies', label: 'Companies', icon: FaBuilding },
                { id: 'professionals', label: 'Professionals', icon: FaUsers },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(''); setFilterStatus('all'); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 w-48"
                />
              </div>
              {activeTab === 'companies' && (
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              )}
            </div>
          </div>

          {/* Companies Table */}
          {activeTab === 'companies' && (
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading companies...</div>
              ) : filteredCompanies.length === 0 ? (
                <div className="p-12 text-center">
                  <FaBuilding className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No companies found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Company</th>
                      <th className="px-6 py-3">Industry</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Registered</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredCompanies.map(company => (
                      <tr key={company._id} className="hover:bg-white/3 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={company.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${company.name}`}
                              alt={company.name}
                              className="w-9 h-9 rounded-lg border border-white/10"
                            />
                            <div>
                              <p className="text-white font-medium text-sm flex items-center gap-1.5">
                                {company.name}
                                {company.verificationStatus === 'verified' && (
                                  <MdVerified className="text-emerald-400 w-4 h-4" />
                                )}
                              </p>
                              <p className="text-gray-500 text-xs">{company.companyDetails?.size || 'N/A'} employees</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{company.companyDetails?.industry || '—'}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{company.email}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(company.createdAt)}</td>
                        <td className="px-6 py-4"><StatusBadge status={company.verificationStatus} /></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {company.verificationStatus !== 'verified' && (
                              <button
                                onClick={() => handleVerify(company._id, 'verified')}
                                disabled={actionLoading[company._id]}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                              >
                                {actionLoading[company._id] ? '...' : 'Verify'}
                              </button>
                            )}
                            {company.verificationStatus !== 'rejected' && (
                              <button
                                onClick={() => handleVerify(company._id, 'rejected')}
                                disabled={actionLoading[company._id]}
                                className="px-3 py-1.5 bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                              >
                                Reject
                              </button>
                            )}
                            {company.verificationStatus !== 'pending' && (
                              <button
                                onClick={() => handleVerify(company._id, 'pending')}
                                disabled={actionLoading[company._id]}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-gray-300 text-xs font-medium rounded-lg transition-colors border border-white/10"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Professionals Table */}
          {activeTab === 'professionals' && (
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading professionals...</div>
              ) : filteredProfessionals.length === 0 ? (
                <div className="p-12 text-center">
                  <FaUsers className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No professionals found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Professional</th>
                      <th className="px-6 py-3">Headline</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Skills</th>
                      <th className="px-6 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProfessionals.map(p => (
                      <tr key={p._id} className="hover:bg-white/3 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${p.name}`}
                              alt={p.name}
                              className="w-9 h-9 rounded-full border border-white/10"
                            />
                            <p className="text-white font-medium text-sm">{p.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{p.headline || '—'}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{p.email}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(p.skills || []).slice(0, 3).map(s => (
                              <span key={s} className="text-xs bg-violet-500/15 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/20">{s}</span>
                            ))}
                            {p.skills?.length > 3 && <span className="text-xs text-gray-500">+{p.skills.length - 3}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(p.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
