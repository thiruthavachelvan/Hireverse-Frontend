import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, ThumbsUp, MessageSquare, UserPlus, UserMinus,
  Building, CheckCircle2, Send, Sparkles, Plus
} from 'lucide-react';
import { SkeletonPostCard } from '../components/SkeletonLoader';

const ProfessionalFeed = () => {
  const { user, handleFollowToggle } = useAuth();
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [requestedIds, setRequestedIds] = useState([]);

  useEffect(() => {
    fetchFeedData();
  }, []);

  const fetchFeedData = async () => {
    try {
      setLoading(true);
      const [postsRes, usersRes] = await Promise.all([
        api.get('/posts'),
        api.get('/auth/users')
      ]);
      setPosts(postsRes.data);
      setSuggestedUsers(usersRes.data);
    } catch (err) {
      setError('Failed to fetch feed data.');
    }
    setLoading(false);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    setActionLoading(true);
    try {
      const res = await api.post('/posts', { content: postContent });
      setPosts([res.data, ...posts]);
      setPostContent('');
    } catch (err) {
      setError('Failed to create post.');
    }
    setActionLoading(false);
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await api.put(`/posts/${postId}/like`);
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data.likes } : p));
    } catch { /* ignore */ }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const text = commentTexts[postId] || '';
    if (!text.trim()) return;
    try {
      const res = await api.post(`/posts/${postId}/comment`, { text });
      setPosts(posts.map(p => p._id === postId ? res.data : p));
      setCommentTexts({ ...commentTexts, [postId]: '' });
    } catch { /* ignore */ }
  };

  const handleFollowChange = async (targetId, isFollowing) => {
    if (requestedIds.includes(targetId)) return;
    try {
      const url = isFollowing ? `/auth/unfollow/${targetId}` : `/auth/follow/${targetId}`;
      const res = await api.post(url);
      if (res.data.requestPending) {
        setRequestedIds(prev => [...prev, targetId]);
      } else if (res.data.following) {
        handleFollowToggle(res.data.following);
      }
    } catch (err) {
      if (err.response?.status === 400 && err.response.data.message.includes('pending')) {
        setRequestedIds(prev => [...prev, targetId]);
      }
    }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 relative">
      <div className="mesh-blob-1 animate-blob-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="mesh-blob-2 animate-blob-2" style={{ bottom: '-10%', right: '-10%' }} />

      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-center text-sm font-semibold flex justify-between items-center z-10 relative">
          <span>{error}</span>
          <button className="underline font-bold text-xs" onClick={() => setError('')}>Dismiss</button>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* Left: Mini Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden mb-4 relative flex-shrink-0">
              <img
                src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <Link to="/profile" className="text-lg font-black text-hv-text hover:text-hv-violet transition-colors">{user.name}</Link>
            <p className="text-xs font-semibold text-hv-muted mt-1 leading-snug">{user.headline || 'Add a headline to your profile'}</p>
            
            {user.employmentStatus && (
              <span className={`mt-3 text-[10px] uppercase font-bold chip ${
                user.employmentStatus === 'employed' ? 'chip-success' :
                user.employmentStatus === 'recently_left' ? 'chip-warning' :
                'chip-blue'
              }`}>
                {user.employmentStatus === 'employed' ? 'Employed' :
                 user.employmentStatus === 'recently_left' ? 'Recently Left' : 'Open to work'}
              </span>
            )}

            <div className="w-full h-px bg-gray-100 my-4" />
            
            <div className="flex justify-around w-full text-center">
              <div>
                <p className="text-lg font-black text-hv-text">{(user.followers || []).length}</p>
                <p className="text-[10px] font-bold text-hv-subtle uppercase tracking-wider">Followers</p>
              </div>
              <div>
                <p className="text-lg font-black text-hv-text">{(user.following || []).length}</p>
                <p className="text-[10px] font-bold text-hv-subtle uppercase tracking-wider">Following</p>
              </div>
            </div>

            <Link to="/profile" className="btn-ghost w-full py-2.5 mt-6 text-xs flex items-center justify-center gap-1 font-bold">
              Edit Workspace <Sparkles size={12} />
            </Link>
          </div>
        </div>

        {/* Center: Composer + Feed */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Post composer */}
          <div className="card p-5">
            <form onSubmit={handleCreatePost}>
              <div className="flex gap-3 items-start">
                <img
                  src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
                  alt="avatar"
                  className="w-10 h-10 rounded-xl object-cover border border-gray-100 bg-gray-50 flex-shrink-0"
                />
                <textarea
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="Share what's happening on your career journey..."
                  className="input-field min-h-[90px] text-sm resize-none pt-2"
                  required
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={actionLoading || !postContent.trim()}
                  className="btn-primary py-2 text-xs"
                >
                  {actionLoading ? 'Sharing...' : <><Send size={12} /> Share Update</>}
                </button>
              </div>
            </form>
          </div>

          {/* Posts list */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonPostCard key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="card p-12 text-center text-hv-muted space-y-2">
              <Users size={40} className="mx-auto text-hv-subtle animate-float" />
              <p className="font-bold text-hv-text">Your feed is quiet</p>
              <p className="text-sm">Be the first to post an update or follow people to get started!</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05 } }
              }}
              className="space-y-5"
            >
              {posts.map(post => {
                const isLiked = post.likes?.includes(user._id);
                const isCompanyPost = post.userId?.accountType === 'company';
                return (
                  <motion.div
                    key={post._id}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      show: { opacity: 1, y: 0 }
                    }}
                    className="card p-5 space-y-4"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.userId?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(post.userId?.name || '')}`}
                          alt=""
                          className={`w-10 h-10 rounded-xl object-cover border bg-gray-50 flex-shrink-0 ${
                            isCompanyPost ? 'border-hv-coral/40' : 'border-hv-violet/30'
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link to={`/profile/${post.userId?._id}`} className="font-extrabold text-hv-text text-sm hover:text-hv-violet transition-colors">
                              {post.userId?.name}
                            </Link>
                            {isCompanyPost && (
                              <span className="chip chip-coral text-[9px] px-1 py-0">Company</span>
                            )}
                            {isCompanyPost && post.userId?.verificationStatus === 'verified' && (
                              <CheckCircle2 size={13} className="text-emerald-500" />
                            )}
                          </div>
                          <p className="text-xs text-hv-muted font-medium line-clamp-1 max-w-[200px] sm:max-w-[300px]">
                            {isCompanyPost 
                              ? (post.userId?.companyDetails?.industry || 'Technology Partner')
                              : (post.userId?.headline || 'Member of HireVerse')}
                          </p>
                        </div>
                      </div>

                      {/* Follow Button */}
                      {post.userId?._id !== user._id && (
                        <button
                          onClick={() => handleFollowChange(post.userId?._id, user.following?.includes(post.userId?._id))}
                          className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                            requestedIds.includes(post.userId?._id)
                              ? 'border-gray-200 bg-gray-50 text-hv-subtle cursor-not-allowed'
                              : user.following?.includes(post.userId?._id)
                              ? 'border-gray-200 bg-white text-hv-muted hover:border-gray-300'
                              : 'btn-secondary text-[10px] px-3 py-1.5 border-none'
                          }`}
                          disabled={requestedIds.includes(post.userId?._id)}
                        >
                          {user.following?.includes(post.userId?._id) 
                            ? 'Following' 
                            : requestedIds.includes(post.userId?._id) 
                            ? 'Requested' 
                            : '+ Follow'}
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    <p className="text-sm text-hv-text leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    
                    {/* Likes & Comments bar */}
                    <div className="flex items-center gap-6 pt-3 border-t border-gray-50 text-xs text-hv-muted font-semibold">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLikePost(post._id)}
                        className={`flex items-center gap-1.5 hover:text-hv-text transition-colors cursor-pointer ${
                          isLiked ? 'text-hv-violet font-bold' : ''
                        }`}
                      >
                        <ThumbsUp size={14} className={isLiked ? 'fill-current' : ''} />
                        <span>{isLiked ? 'Liked' : 'Like'} ({post.likes.length})</span>
                      </motion.button>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare size={14} />
                        <span>Comments ({post.comments?.length || 0})</span>
                      </div>
                    </div>

                    {/* Comments list */}
                    <div className="space-y-3 pt-2">
                      <AnimatePresence>
                        {(post.comments || []).map(comment => (
                          <motion.div
                            key={comment._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-2.5 items-start text-xs bg-gray-50/70 p-3 rounded-xl border border-gray-100"
                          >
                            <img
                              src={comment.userId?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(comment.userId?.name || '')}`}
                              alt=""
                              className="w-7 h-7 rounded-lg object-cover border border-gray-200 bg-white flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-hv-text">{comment.userId?.name}</span>
                              <span className="text-hv-subtle block text-[10px] mt-0.5 font-medium line-clamp-1">{comment.userId?.headline}</span>
                              <p className="text-hv-text mt-1.5 leading-relaxed">{comment.text}</p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {/* Add comment form */}
                      <form onSubmit={e => handleCommentSubmit(e, post._id)} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={commentTexts[post._id] || ''}
                          onChange={e => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })}
                          placeholder="Write an encouraging comment..."
                          className="input-field py-1.5 text-xs flex-grow"
                        />
                        <button type="submit" className="btn-secondary py-2 px-4 text-xs font-bold border-none bg-hv-violet/10 text-hv-violet hover:bg-hv-violet/15 flex items-center justify-center">
                          Send
                        </button>
                      </form>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Right: Suggested follows */}
        <div className="lg:col-span-1 space-y-6">
          {/* People Suggestions */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-hv-text mb-4 flex items-center gap-1.5">
              <Users size={16} className="text-hv-violet" /> Professionals
            </h3>
            <div className="space-y-3">
              {suggestedUsers
                .filter(u => u.accountType === 'professional' && u._id !== user._id)
                .slice(0, 4)
                .map(recUser => {
                  const isFollowing = user.following?.includes(recUser._id);
                  const isPending = requestedIds.includes(recUser._id);
                  return (
                    <div key={recUser._id} className="flex items-center justify-between gap-2 text-xs pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={recUser.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(recUser.name)}`}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover border border-gray-100 bg-gray-50 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <Link to={`/profile/${recUser._id}`} className="block font-bold text-hv-text truncate hover:text-hv-violet transition-colors">{recUser.name}</Link>
                          <p className="text-[10px] text-hv-muted truncate">{recUser.headline || 'Professional'}</p>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleFollowChange(recUser._id, isFollowing)}
                        disabled={isPending}
                        className={`p-1.5 rounded-lg border transition-colors flex-shrink-0 cursor-pointer ${
                          isFollowing 
                            ? 'border-gray-200 bg-white text-hv-muted hover:border-gray-300' 
                            : isPending
                            ? 'border-gray-100 bg-gray-50 text-hv-subtle cursor-not-allowed'
                            : 'btn-secondary p-1.5 border-none'
                        }`}
                        title={isFollowing ? 'Unfollow' : isPending ? 'Requested' : 'Follow'}
                      >
                        {isFollowing ? <UserMinus size={13} /> : isPending ? <CheckCircle2 size={13} className="text-hv-subtle" /> : <UserPlus size={13} />}
                      </motion.button>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Companies Suggestions */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-hv-text mb-4 flex items-center gap-1.5">
              <Building size={16} className="text-hv-coral" /> Companies
            </h3>
            <div className="space-y-3">
              {suggestedUsers
                .filter(u => u.accountType === 'company')
                .slice(0, 4)
                .map(company => {
                  const isFollowing = user.following?.includes(company._id);
                  return (
                    <div key={company._id} className="flex items-center justify-between gap-2 text-xs pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={company.profileImage}
                          alt=""
                          className="w-8 h-8 rounded border border-gray-100 bg-gray-50 object-contain flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-hv-text truncate flex items-center gap-0.5">
                            <Link to={`/companies/${company._id}`} className="hover:text-hv-violet transition-colors">{company.name}</Link>
                            {company.verificationStatus === 'verified' && (
                              <CheckCircle2 size={11} className="text-emerald-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-hv-muted truncate">{company.companyDetails?.industry || 'Technology'}</p>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleFollowChange(company._id, isFollowing)}
                        className={`p-1.5 rounded-lg border transition-colors flex-shrink-0 cursor-pointer ${
                          isFollowing 
                            ? 'border-gray-200 bg-white text-hv-muted hover:border-gray-300' 
                            : 'btn-secondary p-1.5 border-none'
                        }`}
                        title={isFollowing ? 'Unfollow' : 'Follow'}
                      >
                        {isFollowing ? <UserMinus size={13} /> : <Plus size={13} />}
                      </motion.button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalFeed;
