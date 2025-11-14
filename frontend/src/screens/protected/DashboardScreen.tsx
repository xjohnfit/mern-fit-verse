import { useSelector } from "react-redux";
import { useGetSuggestedUsersQuery, useFollowUnfollowUserMutation } from "@/slices/usersApiSlice";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { getInitials } from "@/lib/getInitials";
import { useNavigate } from "react-router";

interface SuggestedUser {
  _id: string;
  name: string;
  username: string;
  photo?: string;
}

const DashboardScreen = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const { data: suggestedUsers, isLoading: isLoadingSuggested, refetch } = useGetSuggestedUsersQuery({});
  const [followUnfollowUser] = useFollowUnfollowUserMutation();

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

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Welcome back, {userInfo?.name}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Your fitness dashboard is currently under construction.
                  Check out the suggested users to connect with other fitness enthusiasts!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Posts Feed
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Coming soon - Share your fitness journey
                    </p>
                  </div>

                  <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      Workout Tracking
                    </h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Coming soon - Log your workouts
                    </p>
                  </div>

                  <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                      Nutrition Goals
                    </h3>
                    <p className="text-purple-700 dark:text-purple-300 text-sm">
                      Coming soon - Track your nutrition
                    </p>
                  </div>

                  <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                      Progress Analytics
                    </h3>
                    <p className="text-orange-700 dark:text-orange-300 text-sm">
                      Coming soon - Visualize your progress
                    </p>
                  </div>
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