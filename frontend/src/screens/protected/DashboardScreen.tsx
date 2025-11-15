import { useSelector } from "react-redux";
import { useGetSuggestedUsersQuery, useFollowUnfollowUserMutation } from "@/slices/usersApiSlice";
import { useGetFollowedUsersPostsQuery, useLikeUnlikePostMutation, useAddCommentMutation } from "@/slices/postsApiSlice";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Heart, MessageCircle, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { getInitials } from "@/lib/getInitials";
import { useNavigate } from "react-router";
import { useState } from "react";

interface SuggestedUser {
  _id: string;
  name: string;
  username: string;
  photo?: string;
}

interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    username: string;
    photo?: string;
  };
  content: string;
  image?: string;
  likes: string[];
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
      username: string;
      photo?: string;
    };
    comment: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const DashboardScreen = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const { data: suggestedUsers, isLoading: isLoadingSuggested, refetch } = useGetSuggestedUsersQuery({});
  const { data: followedPosts, isLoading: isLoadingPosts, refetch: refetchPosts } = useGetFollowedUsersPostsQuery({});
  const [followUnfollowUser] = useFollowUnfollowUserMutation();
  const [likeUnlikePost] = useLikeUnlikePostMutation();
  const [addComment] = useAddCommentMutation();

  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string; }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean; }>({});

  const handleFollow = async (username: string) => {
    try {
      const result = await followUnfollowUser(username).unwrap();
      toast.success(result.message);
      refetch(); // Refresh suggested users list
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to follow user');
    }
  };

  const handleUserClick = (username: string) => {
    navigate(`/profile/view/${username}`);
  };

  const handleLikePost = async (postId: string) => {
    try {
      await likeUnlikePost(postId).unwrap();
      refetchPosts();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to like post');
    }
  };

  const handleAddComment = async (postId: string) => {
    const commentText = commentTexts[postId]?.trim();
    if (!commentText) return;

    try {
      await addComment({ postId, comment: commentText }).unwrap();
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
      refetchPosts();
      toast.success('Comment added successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add comment');
    }
  };

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Suggested Users */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Suggested Users
                </h2>
              </div>

              {isLoadingSuggested ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : suggestedUsers && suggestedUsers.length > 0 ? (
                <div className="space-y-3">
                  {suggestedUsers.slice(0, 5).map((user: SuggestedUser) => (
                    <div key={user._id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Avatar
                        className="w-10 h-10 cursor-pointer"
                        onClick={() => handleUserClick(user.username)}
                      >
                        <AvatarImage src={user.photo} alt={user.name} />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleUserClick(user.username)}
                      >
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          @{user.username}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFollow(user.username)}
                        className="px-3 py-1 text-xs"
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        Follow
                      </Button>
                    </div>
                  ))}

                  {suggestedUsers.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-blue-600 dark:text-blue-400"
                      onClick={() => {/* Could navigate to a full suggested users page */ }}
                    >
                      See more suggestions
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No suggestions available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Posts Feed */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Welcome Header */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Welcome back, {userInfo?.name}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Stay up to date with your fitness community
                </p>
              </div>

              {/* Posts Feed */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Posts from People You Follow
                  </h2>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoadingPosts ? (
                    <div className="p-8 text-center">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
                    </div>
                  ) : !followedPosts || followedPosts.length === 0 ? (
                    <div className="p-8 text-center">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No posts yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Follow some users to see their posts in your feed
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Check out the suggested users on the left to get started!
                      </p>
                    </div>
                  ) : (
                    followedPosts.map((post: Post) => (
                      <div key={post._id} className="p-6">
                        {/* Post Header */}
                        <div className="flex items-center space-x-3 mb-4">
                          <Avatar
                            className="w-10 h-10 cursor-pointer"
                            onClick={() => handleUserClick(post.user.username)}
                          >
                            <AvatarImage src={post.user.photo} alt={post.user.name} />
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                              {getInitials(post.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p
                                className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:underline"
                                onClick={() => handleUserClick(post.user.username)}
                              >
                                {post.user.name}
                              </p>
                              <span className="text-gray-500 dark:text-gray-400">•</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                @{post.user.username}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{formatRelativeTime(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                          <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap mb-3">
                            {post.content}
                          </p>
                          {post.image && (
                            <img
                              src={post.image}
                              alt="Post image"
                              className="w-full max-h-96 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                          )}
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center space-x-4 mb-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post._id)}
                            className={`flex items-center space-x-2 ${post.likes?.includes(userInfo?._id || '')
                                ? 'text-red-500 hover:text-red-600'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                              }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${post.likes?.includes(userInfo?._id || '') ? 'fill-current' : ''
                                }`}
                            />
                            <span>{post.likes?.length || 0}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleComments(post._id)}
                            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments?.length || 0}</span>
                          </Button>
                        </div>

                        {/* Comments Section */}
                        {showComments[post._id] && (
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            {/* Add Comment */}
                            <div className="flex space-x-3 mb-4">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={userInfo?.photo} alt={userInfo?.name} />
                                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                  {userInfo ? getInitials(userInfo.name) : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 flex space-x-2">
                                <input
                                  type="text"
                                  placeholder="Add a comment..."
                                  value={commentTexts[post._id] || ''}
                                  onChange={(e) =>
                                    setCommentTexts(prev => ({ ...prev, [post._id]: e.target.value }))
                                  }
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddComment(post._id);
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleAddComment(post._id)}
                                  disabled={!commentTexts[post._id]?.trim()}
                                >
                                  <Send className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-3">
                              {post.comments?.map((comment) => (
                                <div key={comment._id} className="flex space-x-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={comment.user.photo} alt={comment.user.name} />
                                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                      {getInitials(comment.user.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <span
                                          className="font-medium text-sm text-gray-900 dark:text-gray-100 cursor-pointer hover:underline"
                                          onClick={() => handleUserClick(comment.user.username)}
                                        >
                                          {comment.user.name}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {formatRelativeTime(comment.createdAt)}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-800 dark:text-gray-200">
                                        {comment.comment}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1 text-sm">
                    Workout Tracking
                  </h3>
                  <p className="text-green-700 dark:text-green-300 text-xs">
                    Coming soon - Log your workouts
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1 text-sm">
                    Nutrition Goals
                  </h3>
                  <p className="text-purple-700 dark:text-purple-300 text-xs">
                    Coming soon - Track your nutrition
                  </p>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1 text-sm">
                    Progress Analytics
                  </h3>
                  <p className="text-orange-700 dark:text-orange-300 text-xs">
                    Coming soon - Visualize your progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardScreen;