import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Building2, MapPin, Users, ArrowRight, Search, CheckCircle } from 'lucide-react';

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await api.get('/auth/users');
        // Filter only verified company accounts
        const verifiedCompanies = data.filter(
          (u) => u.accountType === 'company' && u.verificationStatus === 'verified'
        );
        setCompanies(verifiedCompanies);
      } catch (err) {
        setError('Failed to load companies.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const query = searchQuery.toLowerCase();
    return (
      company.name?.toLowerCase().includes(query) ||
      company.companyDetails?.industry?.toLowerCase().includes(query) ||
      company.companyDetails?.location?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 relative">
      <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        
        {/* Header */}
        <div className="border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-black text-hv-text">Explore Companies</h1>
          <p className="text-sm text-hv-muted mt-1 font-medium">Discover registered and verified employers on HireVerse.</p>
        </div>

        {/* Search */}
        <div className="card-static p-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hv-subtle w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, industry, location..."
              className="input-field pl-10"
            />
          </div>
          <span className="text-xs font-bold text-hv-muted whitespace-nowrap bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
            {filteredCompanies.length} partner{filteredCompanies.length !== 1 ? 's' : ''} active
          </span>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Companies Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-60 rounded-2xl" />
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="card p-16 text-center max-w-md mx-auto space-y-4">
            <Building2 className="w-16 h-16 text-hv-subtle mx-auto animate-float" />
            <div>
              <p className="text-lg font-bold text-hv-text">No companies found</p>
              <p className="text-sm text-hv-muted mt-1">Try refining your search terms.</p>
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
            {filteredCompanies.map((company) => (
              <motion.div
                key={company._id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 }
                }}
                onClick={() => navigate(`/companies/${company._id}`)}
                className="card p-6 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Logo + Name */}
                  <div className="flex items-start gap-3.5 mb-4">
                    <img
                      src={company.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(company.name)}`}
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
                      <p className="text-xs font-bold text-hv-violet mt-1">
                        {company.companyDetails?.industry || 'Industry unspecified'}
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-center gap-2 text-hv-muted">
                      <MapPin size={13} className="text-hv-subtle flex-shrink-0" />
                      <span>{company.companyDetails?.location || 'Remote / Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-hv-muted">
                      <Users size={13} className="text-hv-subtle flex-shrink-0" />
                      <span>Size: {company.companyDetails?.size || 'Not Specified'}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-hv-muted leading-relaxed line-clamp-3 mb-4">
                    {company.companyDetails?.description || company.bio || 'No description provided.'}
                  </p>
                </div>

                {/* View Details bottom */}
                <div className="flex items-center justify-between text-xs font-semibold pt-3 border-t border-gray-50 text-hv-subtle group-hover:text-hv-violet transition-colors">
                  <span>{company.followers?.length || 0} follower{(company.followers?.length !== 1) ? 's' : ''}</span>
                  <span className="flex items-center gap-1">
                    View Profile <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Companies;
