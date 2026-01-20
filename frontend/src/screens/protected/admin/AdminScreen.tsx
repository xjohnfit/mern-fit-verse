// React imports
import { useEffect } from 'react';

// Third-party library imports
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

// Component imports
import { Tabs } from '@/components/ui/tabs';

// Local component imports
import ExerciseManagementTab from '@/screens/protected/admin/components/ExerciseManagementTab';
import UserManagementTab from '@/screens/protected/admin/components/UserManagementTab';
import ReportsManagementTab from '@/screens/protected/admin/components/ReportsManagementTab';
import SupportManagementTab from '@/screens/protected/admin/components/SupportManagementTab';

// Type imports
import type { RootState } from '@/screens/protected/admin/admin.types';

const AdminScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // Check if user is admin
  useEffect(() => {
    if (!userInfo?.admin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  if (!userInfo?.admin) {
    return null;
  }

  const tabs = [
    {
      title: 'Users',
      value: 'users',
      content: <UserManagementTab currentUserId={userInfo._id} isAdmin={userInfo.admin} />,
    },
    {
      title: 'Exercises',
      value: 'exercises',
      content: <ExerciseManagementTab />,
    },
    {
      title: 'Reports',
      value: 'reports',
      content: <ReportsManagementTab />,
    },
    {
      title: 'Support',
      value: 'support',
      content: <SupportManagementTab />,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-base">
            Manage users, exercises, reports, and support tickets
          </p>
        </div>

        <Tabs
          tabs={tabs}
          defaultValue="users"
          containerClassName="mb-8 justify-center"
          activeTabClassName="bg-linear-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700"
          tabClassName="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        />
      </div>
    </div>
  );
};

export default AdminScreen;