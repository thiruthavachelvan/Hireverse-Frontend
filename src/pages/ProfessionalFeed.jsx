import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import {
  FaUserFriends, FaThumbsUp, FaCommentAlt,
  FaUserPlus, FaUserMinus, FaBuilding, FaCheck
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

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
      setError('Failed to fetch dashboard data.');
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
        alert('Connection request sent!');
      } else if (res.data.following) {
        handleFollowToggle(res.data.following);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        if (err.response.data.message.includes('pending')) {
          setRequestedIds(prev => [...prev, targetId]);
        }
        alert(err.response.data.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-brand-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white px-4 md:px-8 py-8">
      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center text-sm">
          {error}
          <button className="ml-4 underline" onClick={() => setError('')}>Dismiss</button>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glassmorphism p-6 rounded-2xl text-center flex flex-col items-center">
            <img
              src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
              alt={user.name}
              className="w-20 h-20 rounded-full border-2 border-brand-purple mb-4 bg-brand-medium"
            />
            <Link to="/profile" className="text-xl font-bold hover:text-brand-accent transition-colors">{user.name}</Link>
            <p className="text-sm text-gray-400 mt-1">{user.headline || 'Add a headline to your profile'}</p>
            
            {user.employmentStatus && (
              <span className={`mt-2 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                user.employmentStatus === 'employed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                user.employmentStatus === 'recently_left' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                'bg-blue-500/20 text-blue-400 border-blue-500/30'
              }`}>
                {user.employmentStatus === 'employed' ? 'Employed' :
                 user.employmentStatus === 'recently_left' ? 'Recently Left' : 'Unemployed'}
              </span>
            )}

            <div className="w-full border-t border-brand-medium my-4" />
            
            <div className="flex justify-around w-full text-center">
              <div>
                <div className="text-lg font-bold text-white">{(user.followers || []).length}</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">{(user.following || []).length}</div>
                <div className="text-xs text-gray-400">Following</div>
              </div>
            </div>

            <Link to="/profile" className="mt-6 w-full text-center text-xs font-semibold py-2 rounded-xl bg-brand-medium hover:bg-brand-medium/70 transition-colors">
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glassmorphism p-5 rounded-2xl">
            <form onSubmit={handleCreatePost}>
              <div className="flex space-x-3 items-start">
                <img
                  src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border border-brand-purple bg-brand-medium"
                />
                <textarea
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="What professional update do you want to share?"
                  className="w-full bg-brand-medium/30 border border-brand-medium rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-purple min-h-[90px] resize-none"
                  required
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={actionLoading || !postContent.trim()}
                  className="px-5 py-2 text-sm font-semibold bg-brand-purple hover:bg-opacity-90 transition-all rounded-xl disabled:opacity-50"
                >
                  {actionLoading ? 'Posting...' : 'Post Update'}
                </button>
              </div>
            </form>
          </div>

          {posts.length === 0 ? (
            <div className="glassmorphism p-10 rounded-2xl text-center text-gray-400">
              <p className="text-lg">No updates in your feed yet.</p>
              <p className="text-sm mt-1">Be the first to share a post!</p>
            </div>
          ) : posts.map(post => {
            const isLiked = post.likes?.includes(user._id);
            const isCompanyPost = post.userId?.accountType === 'company';
            return (
              <div key={post._id} className="glassmorphism p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.userId?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.userId?.name}`}
                      alt={post.userId?.name}
                      className={`w-10 h-10 rounded-full border bg-brand-medium ${isCompanyPost ? 'border-brand-accent' : 'border-brand-purple'}`}
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-white text-sm">{post.userId?.name}</span>
                        {isCompanyPost && (
                          <span className="text-[10px] bg-brand-purple/30 text-brand-accent px-1.5 py-0.2 rounded border border-brand-purple/40">Company</span>
                        )}
                        {isCompanyPost && post.userId?.verificationStatus === 'verified' && (
                          <MdVerified className="text-brand-accent w-4 h-4" title="Verified Company" />
                        )}
                      </div>
                      <div className="text-xs text-gray-400 truncate max-w-[250px] sm:max-w-[350px]">
                        {isCompanyPost 
                          ? (post.userId?.companyDetails?.industry || 'Company')
                          : (post.userId?.headline || 'Member of HireVerse')}
                      </div>
                    </div>
                  </div>
                  {post.userId?._id !== user._id && (
                    <button
                      onClick={() => handleFollowChange(post.userId?._id, user.following?.includes(post.userId?._id))}
                      className={`px-3 py-1.5 rounded-lg border border-brand-purple/40 text-[10px] font-bold transition-colors ${
                        requestedIds.includes(post.userId?._id) ? 'text-gray-400 bg-brand-medium cursor-not-allowed' : 'text-brand-accent hover:bg-brand-purple hover:text-white'
                      }`}
                      disabled={requestedIds.includes(post.userId?._id)}
                    >
                      {user.following?.includes(post.userId?._id) ? 'Following' : requestedIds.includes(post.userId?._id) ? 'Requested' : '+ Follow'}
                    </button>
                  )}
                </div>
                <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{post.content}</div>
                <div className="flex items-center space-x-6 pt-2 border-t border-brand-medium/50 text-xs text-gray-400">
                  <button onClick={() => handleLikePost(post._id)} className={`flex items-center space-x-1 hover:text-white transition-colors ${isLiked ? 'text-brand-purple font-semibold' : ''}`}>
                    <FaThumbsUp /><span>{isLiked ? 'Liked' : 'Like'} ({post.likes.length})</span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <FaCommentAlt /><span>Comments ({post.comments?.length || 0})</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {(post.comments || []).map(comment => (
                    <div key={comment._id} className="flex space-x-2.5 items-start text-xs bg-brand-medium/30 p-2.5 rounded-xl">
                      <img
                        src={comment.userId?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${comment.userId?.name}`}
                        alt={comment.userId?.name}
                        className="w-7 h-7 rounded-full border border-brand-purple bg-brand-medium"
                      />
                      <div className="flex-1">
                        <span className="font-bold text-white">{comment.userId?.name}</span>
                        <span className="text-gray-400 block text-[10px]">{comment.userId?.headline}</span>
                        <p className="text-gray-200 mt-1">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  <form onSubmit={e => handleCommentSubmit(e, post._id)} className="flex space-x-2 items-center">
                    <input
                      type="text"
                      value={commentTexts[post._id] || ''}
                      onChange={e => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })}
                      placeholder="Write a comment..."
                      className="flex-grow bg-brand-medium/20 border border-brand-medium rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-purple"
                    />
                    <button type="submit" className="px-3 py-1.5 text-xs font-semibold bg-brand-purple rounded-xl hover:bg-opacity-90 transition-colors">Send</button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggestions Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* People Suggestions */}
          <div className="glassmorphism p-5 rounded-2xl">
            <h3 className="text-md font-bold mb-4 flex items-center space-x-2">
              <FaUserFriends className="text-brand-purple" /><span>Professionals to Follow</span>
            </h3>
            <div className="space-y-4">
              {suggestedUsers
                .filter(u => u.accountType === 'professional' && u._id !== user._id)
                .slice(0, 4)
                .map(recUser => {
                  const isFollowing = user.following?.includes(recUser._id);
                  return (
                    <div key={recUser._id} className="flex items-center justify-between text-xs py-2 border-b border-brand-medium/30 last:border-0">
                      <div className="flex items-center space-x-2">
                        <img
                          src={recUser.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${recUser.name}`}
                          alt={recUser.name}
                          className="w-8 h-8 rounded-full border border-brand-purple bg-brand-medium"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-white truncate max-w-[100px]">{recUser.name}</div>
                          <div className="text-[10px] text-gray-400 truncate max-w-[100px]">{recUser.headline || 'Professional'}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollowChange(recUser._id, isFollowing)}
                        disabled={requestedIds.includes(recUser._id)}
                        className={`p-1.5 rounded-lg border transition-colors flex-shrink-0 ${
                          isFollowing 
                            ? 'border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white' 
                            : requestedIds.includes(recUser._id)
                            ? 'border-gray-500 text-gray-400 bg-brand-medium cursor-not-allowed'
                            : 'border-brand-medium text-white bg-brand-purple/20 hover:bg-brand-purple'
                        }`}
                        title={isFollowing ? 'Unfollow' : requestedIds.includes(recUser._id) ? 'Requested' : 'Follow'}
                      >
                        {isFollowing ? <FaUserMinus /> : requestedIds.includes(recUser._id) ? <FaCheck className="w-3.5 h-3.5" /> : <FaUserPlus />}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Companies Suggestions */}
          <div className="glassmorphism p-5 rounded-2xl">
            <h3 className="text-md font-bold mb-4 flex items-center space-x-2">
              <FaBuilding className="text-brand-accent" /><span>Featured Companies</span>
            </h3>
            <div className="space-y-4">
              {suggestedUsers
                .filter(u => u.accountType === 'company')
                .slice(0, 4)
                .map(company => {
                  const isFollowing = user.following?.includes(company._id);
                  return (
                    <div key={company._id} className="flex items-center justify-between text-xs py-2 border-b border-brand-medium/30 last:border-0">
                      <div className="flex items-center space-x-2 min-w-0">
                        <img
                          src={company.profileImage}
                          alt={company.name}
                          className="w-8 h-8 rounded border border-brand-accent bg-brand-medium object-contain flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate max-w-[100px] flex items-center gap-0.5">
                            <span>{company.name}</span>
                            {company.verificationStatus === 'verified' && (
                              <MdVerified className="text-brand-accent flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400 truncate max-w-[100px]">{company.companyDetails?.industry || 'Technology'}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollowChange(company._id, isFollowing)}
                        className={`p-1.5 rounded-lg border transition-colors flex-shrink-0 ${
                          isFollowing 
                            ? 'border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white' 
                            : 'border-brand-medium text-white bg-brand-purple/20 hover:bg-brand-purple'
                        }`}
                        title={isFollowing ? 'Unfollow' : 'Follow'}
                      >
                        {isFollowing ? <FaUserMinus /> : <FaUserPlus />}
                      </button>
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
