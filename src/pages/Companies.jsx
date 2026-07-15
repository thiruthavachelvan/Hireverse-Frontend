import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Building2, MapPin, Users, ArrowRight, Search, CheckCircle, Rocket, Calendar } from 'lucide-react';

const CATEGORIES = ['All', 'AI', 'FinTech', 'HealthTech', 'EdTech', 'Gaming', 'SaaS', 'ClimateTech', 'E-Commerce', 'Developer Tools', 'Robotics'];
const STAGES = ['All Stages', 'Bootstrapped', 'Pre-Seed', 'Seed', 'Series A', 'Series B'];

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All Stages');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await api.get('/auth/users');
        // Filter only verified company accounts (which are now exclusively Startups)
        const verifiedCompanies = data.filter(
          (u) => u.accountType === 'company' && u.verificationStatus === 'verified'
        );
        setCompanies(verifiedCompanies);
      } catch (err) {
        setError('Failed to load startup directory.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const query = searchQuery.toLowerCase();
    const details = company.companyDetails || {};

    const matchesQuery = (
      company.name?.toLowerCase().includes(query) ||
      details.industry?.toLowerCase().includes(query) ||
      details.location?.toLowerCase().includes(query)
    );

    const matchesCategory = selectedCategory === 'All' || 
      details.industry?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStage = selectedStage === 'All Stages' || 
      details.startupStage?.toLowerCase() === selectedStage.toLowerCase();

    return matchesQuery && matchesCategory && matchesStage;
  });

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 relative">
      <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        
        {/* Header */}
        <div className="border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-black text-hv-text">Discover Startups</h1>
          <p className="text-sm text-hv-muted mt-1 font-medium">
            Where Startups Meet Builders. Explore verified tech startups building the future.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="card-static p-6 space-y-4">
          {/* Search bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by startup name, location..."
                className="input-field pl-11"
              />
            </div>
            <span className="text-xs font-bold text-hv-violet bg-violet-50/50 border border-violet-100/50 px-3 py-1.5 rounded-xl self-start md:self-auto">
              {filteredCompanies.length} startup{filteredCompanies.length !== 1 ? 's' : ''} matched
            </span>
          </div>

          {/* Industry Category horizontal scroller */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-hv-subtle block">Filter by Domain</span>
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-hv-violet text-white shadow-sm'
                      : 'bg-gray-50 text-hv-muted hover:bg-gray-100 hover:text-hv-text'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stage horizontal scroller */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-hv-subtle block">Filter by Startup Stage</span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {STAGES.map((stg) => (
                <button
                  key={stg}
                  onClick={() => setSelectedStage(stg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedStage === stg
                      ? 'bg-gradient-to-r from-hv-coral to-hv-pink text-white shadow-sm'
                      : 'bg-gray-50 text-hv-muted hover:bg-gray-100 hover:text-hv-text'
                  }`}
                >
                  {stg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Startups Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="card p-16 text-center max-w-md mx-auto space-y-4">
            <Building2 className="w-16 h-16 text-hv-subtle mx-auto animate-float" />
            <div>
              <p className="text-lg font-bold text-hv-text">No startups found</p>
              <p className="text-sm text-hv-muted mt-1">Try resetting the stage or category filters.</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCompanies.map((company) => {
              const details = company.companyDetails || {};
              return (
                <motion.div
                  key={company._id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0 }
                  }}
                  onClick={() => navigate(`/companies/${company._id}`)}
                  className="card p-6 flex flex-col justify-between cursor-pointer group hover:border-violet-200"
                >
                  <div>
                    {/* Header: Logo & Name */}
                    <div className="flex items-start gap-3.5 mb-4">
                      <img
                        src={company.profileImage || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(company.name)}`}
                        alt={company.name}
                        className="w-12 h-12 rounded-2xl border border-gray-100 bg-gray-50 object-contain flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-hv-text leading-snug group-hover:text-hv-violet transition-colors truncate text-base">
                            {company.name}
                          </h3>
                          <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                        </div>
                        <div className="flex gap-1.5 items-center mt-1 flex-wrap">
                          <span className="chip chip-violet font-bold text-[9px] px-2 py-0.5 leading-none">
                            {details.industry || 'Tech'}
                          </span>
                          {details.startupStage && (
                            <span className="chip chip-warning font-bold text-[9px] px-2 py-0.5 leading-none">
                              {details.startupStage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Metadata elements */}
                    <div className="space-y-2 mb-4 text-xs font-semibold">
                      <div className="flex items-center gap-2 text-hv-muted">
                        <MapPin size={13} className="text-hv-subtle flex-shrink-0" />
                        <span>{details.location || 'Remote'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-hv-muted">
                        <Users size={13} className="text-hv-subtle flex-shrink-0" />
                        <span>{details.size || '1-10'} team members</span>
                      </div>
                      {details.foundedYear && (
                        <div className="flex items-center gap-2 text-hv-muted">
                          <Calendar size={13} className="text-hv-subtle flex-shrink-0" />
                          <span>Founded {details.foundedYear}</span>
                        </div>
                      )}
                    </div>

                    {/* Mission bio */}
                    <p className="text-xs text-hv-muted leading-relaxed line-clamp-3 mb-4 font-medium">
                      {details.description || company.bio || 'Ambitious builder building startup solutions.'}
                    </p>
                  </div>

                  {/* Followers & Action */}
                  <div className="flex items-center justify-between text-xs font-semibold pt-3 border-t border-gray-50 text-hv-subtle group-hover:text-hv-violet transition-colors">
                    <span>{company.followers?.length || 0} follower{(company.followers?.length !== 1) ? 's' : ''}</span>
                    <span className="flex items-center gap-1 font-bold">
                      Startup Studio <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Companies;
