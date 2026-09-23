import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { InterestGroup, UserWithPosts } from '../types/aggregation';
import { aggregationService } from '../services/aggregationService';
import { Alert } from '../components/Alert';
import { Modal } from '../components/Modal';
import {
  Sparkles,
  Plus,
  RefreshCw,
  Layers,
  BarChart3,
  User as UserIcon,
  Mail,
  Calendar,
  FileText,
  Search,
  Check,
} from 'lucide-react';

export const AggregationsPage: React.FC = () => {
  const { user } = useAuth();

  const [activeScenario, setActiveScenario] = useState<'interests' | 'posts'>('interests');

  // Scenario 1 State: Group by Interests
  const [interestGroups, setInterestGroups] = useState<InterestGroup[]>([]);
  const [loadingInterests, setLoadingInterests] = useState(false);
  const [errorInterests, setErrorInterests] = useState<string | null>(null);

  // Scenario 2 State: User Posts ($lookup)
  const [userWithPosts, setUserWithPosts] = useState<UserWithPosts | null>(null);
  const [targetUserId, setTargetUserId] = useState<string>(user?._id || '');
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);

  // Quick Post Creation Modal for Scenario 2 testing
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);

  // Fetch Scenario 1
  const fetchGroupedByInterests = async () => {
    try {
      setLoadingInterests(true);
      setErrorInterests(null);
      const data = await aggregationService.getGroupedByInterests();
      setInterestGroups(data);
    } catch (err: any) {
      setErrorInterests(err.message || 'Failed to load interest aggregations.');
    } finally {
      setLoadingInterests(false);
    }
  };

  // Fetch Scenario 2
  const fetchUserPosts = async (uid: string) => {
    if (!uid) return;
    try {
      setLoadingPosts(true);
      setErrorPosts(null);
      const data = await aggregationService.getUserPosts(uid);
      setUserWithPosts(data);
    } catch (err: any) {
      setErrorPosts(err.message || 'Failed to load user posts via aggregation lookup.');
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (activeScenario === 'interests') {
      fetchGroupedByInterests();
    } else if (activeScenario === 'posts') {
      if (user?._id) {
        setTargetUserId(user._id);
        fetchUserPosts(user._id);
      }
    }
  }, [activeScenario, user]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    try {
      setCreatingPost(true);
      await aggregationService.createPost({
        title: postTitle.trim(),
        content: postContent.trim(),
      });
      setPostSuccess('Post published to Posts collection.');
      setPostTitle('');
      setPostContent('');
      setIsCreatePostOpen(false);
      if (targetUserId) {
        fetchUserPosts(targetUserId);
      }
    } catch (err: any) {
      setErrorPosts(err.message || 'Failed to create post.');
    } finally {
      setCreatingPost(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </span>
            Aggregation
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time execution of evaluated single-pipeline aggregation queries.
          </p>
        </div>

        {/* Scenario Toggle */}
        <div className="inline-flex items-center gap-1.5 p-1 bg-gray-100/90 border border-gray-200 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveScenario('interests')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeScenario === 'interests'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeScenario === 'interests' ? 'text-white' : 'text-purple-600'}`} />
            Group by Interests
          </button>
          <button
            onClick={() => setActiveScenario('posts')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeScenario === 'posts'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
          >
            <Layers className={`w-3.5 h-3.5 ${activeScenario === 'posts' ? 'text-white' : 'text-blue-600'}`} />
            User Post
          </button>
        </div>
      </div>

      {/* SCENARIO 1: Group by Interests */}
      {activeScenario === 'interests' && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs text-purple-900 flex items-start justify-between">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>Groups users by their interest tags.
              </div>
            </div>
            <button
              onClick={fetchGroupedByInterests}
              disabled={loadingInterests}
              className="btn-icon btn-icon-purple"
              style={{ width: '2rem', height: '2rem' }}
              title="Re-run Aggregation"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingInterests ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {errorInterests && (
            <Alert type="error" message={errorInterests} onClose={() => setErrorInterests(null)} />
          )}

          {loadingInterests && interestGroups.length === 0 ? (
            <div className="py-20 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mb-2" />
              <p className="text-sm text-gray-500">Executing aggregation pipeline...</p>
            </div>
          ) : interestGroups.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500">
              No interests found across user profiles.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {interestGroups.map((group) => (
                <div
                  key={group._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div className="px-5 py-4 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between">
                    <span className="font-bold text-gray-900 capitalize text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      {group.interest || group._id}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                      {group.count} {group.count === 1 ? 'user' : 'users'}
                    </span>
                  </div>

                  <div className="p-5 divide-y divide-gray-100">
                    {group.users.map((u) => (
                      <div key={u._id} className="py-2.5 first:pt-0 last:pb-0">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                          <UserIcon className="w-3.5 h-3.5 text-indigo-500 inline" />
                          {u.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-blue-500 inline" />
                          {u.email}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SCENARIO 2: User Posts ($lookup) */}
      {activeScenario === 'posts' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <Layers className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>Retrieves all posts belonging to a particular user using a single aggregation pipeline.</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Write Post
              </button>
            </div>
          </div>

          {/* User ID Selector / Input */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-blue-500" />
                Target User ID:
              </label>
              <input
                type="text"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                placeholder="Paste User ObjectId here..."
                className="flex-1 max-w-md px-3 py-1.5 text-xs font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => fetchUserPosts(targetUserId)}
                disabled={loadingPosts || !targetUserId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-medium shadow-sm hover:shadow disabled:opacity-50 transition-all cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-blue-400" />
                Query Aggregation
              </button>
            </div>

            {user && (
              <button
                onClick={() => {
                  setTargetUserId(user._id);
                  fetchUserPosts(user._id);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1 cursor-pointer"
              >
                <UserIcon className="w-3 h-3 text-blue-500" />
                Use My User ID
              </button>
            )}
          </div>

          {postSuccess && (
            <Alert type="success" message={postSuccess} onClose={() => setPostSuccess(null)} />
          )}
          {errorPosts && (
            <Alert type="error" message={errorPosts} onClose={() => setErrorPosts(null)} />
          )}

          {/* Aggregation Results Display */}
          {loadingPosts ? (
            <div className="py-20 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mb-2" />
              <p className="text-sm text-gray-500">Executing $lookup pipeline...</p>
            </div>
          ) : userWithPosts ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-6">
              {/* User Overview */}
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      {userWithPosts.name ? userWithPosts.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{userWithPosts.name}</h2>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-blue-500" />
                        {userWithPosts.email}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
                    {userWithPosts.postCount || userWithPosts.posts?.length || 0} Joined Posts
                  </span>
                </div>
              </div>

              {/* Joined Posts list */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Posts retrieved via $lookup stage:
                </h3>

                {(!userWithPosts.posts || userWithPosts.posts.length === 0) ? (
                  <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-xs text-gray-500">
                    No posts linked to this user yet. Click "Write Post" above to add one.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userWithPosts.posts.map((post) => (
                      <div
                        key={post._id}
                        className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-blue-500" />
                            {post.title}
                          </h4>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-500" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">
                          {post.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Quick Post Create Modal */}
          <Modal
            isOpen={isCreatePostOpen}
            onClose={() => setIsCreatePostOpen(false)}
            title="Create Post in Posts Collection"
          >
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Post Title</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="e.g. MongoDB Aggregation Insights"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Post Content</label>
                <textarea
                  required
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Write post content visible to everyone..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-5">
                <button
                  type="button"
                  onClick={() => setIsCreatePostOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingPost}
                  className="btn-blue"
                >
                  <Check className="w-4 h-4" />
                  <span>{creatingPost ? 'Publishing...' : 'Publish Post'}</span>
                </button>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </div>
  );
};
