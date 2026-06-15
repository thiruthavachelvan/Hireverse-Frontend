import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaBuilding, FaMapMarkerAlt, FaUsers, FaArrowRight, FaSearch } from 'react-icons/fa';

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

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-brand-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white px-4 md:px-8 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-brand-medium/50 pb-4">
          <h1 className="text-3xl font-extrabold text-white">Explore Companies</h1>
          <p className="text-sm text-gray-400 mt-1">Discover verified organizations hiring on HireVerse.</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, industry, location..."
            className="block w-full pl-9 pr-3 py-2.5 bg-brand-medium/30 border border-brand-medium rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-purple text-sm"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Companies Grid */}
        {filteredCompanies.length === 0 ? (
          <div className="glassmorphism p-12 rounded-2xl text-center text-gray-400">
            <FaBuilding className="w-10 h-10 mx-auto mb-3 text-gray-600" />
            <p className="text-lg font-bold">No companies found</p>
            <p className="text-sm mt-1">Try broadening your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company._id}
                onClick={() => navigate(`/companies/${company._id}`)}
                className="glassmorphism p-6 rounded-2xl flex flex-col justify-between hover:border-violet-500/30 transition-all cursor-pointer group hover:scale-[1.02]"
              >
                <div>
                  {/* Logo + Name */}
                  <div className="flex items-start space-x-3 mb-4">
                    <img
                      src={company.profileImage || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(company.name)}`}
                      alt={company.name}
                      className="w-12 h-12 rounded-xl border border-brand-purple bg-brand-medium object-contain"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-extrabold text-white leading-tight group-hover:text-violet-300 transition-colors truncate">
                        {company.name}
                      </h3>
                      <p className="text-xs text-brand-accent font-medium mt-1">
                        {company.companyDetails?.industry || 'Industry unspecified'}
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2 mb-4 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-brand-purple w-3.5 h-3.5 shrink-0" />
                      <span>{company.companyDetails?.location || 'Remote / Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-blue-400 w-3.5 h-3.5 shrink-0" />
                      <span>Size: {company.companyDetails?.size || 'Not Specified'}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 mb-4">
                    {company.companyDetails?.description || company.bio || 'No description provided.'}
                  </p>
                </div>

                {/* View Details button */}
                <div className="flex items-center justify-between text-xs font-semibold text-violet-400 pt-3 border-t border-white/5 group-hover:text-violet-300 transition-colors">
                  <span>{company.followers?.length || 0} Follower{(company.followers?.length !== 1) ? 's' : ''}</span>
                  <span className="flex items-center gap-1">
                    View Profile <FaArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
