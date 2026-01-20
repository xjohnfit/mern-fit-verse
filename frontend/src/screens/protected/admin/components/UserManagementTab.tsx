import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllUsersQuery, useUpdateUserRoleMutation } from '@/slices/usersApiSlice';
import SearchInput from './SearchInput';
import UserTable from './UserTable';
import type { User, UserManagementTabProps } from '../admin.types';

const UserManagementTab = ({ currentUserId, isAdmin }: UserManagementTabProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: usersData, isLoading: usersLoading, refetch: refetchUsers, error: usersError } = useGetAllUsersQuery(undefined, {
        skip: !isAdmin,
    });
    const [updateUserRole] = useUpdateUserRoleMutation();

    console.log('Users data:', usersData);
    console.log('Users loading:', usersLoading);
    console.log('Users error:', usersError);

    // Handle user role update
    const handleRoleUpdate = async (userId: string, currentAdmin: boolean) => {
        try {
            const result = await updateUserRole({ userId, admin: !currentAdmin }).unwrap();
            toast.success(result.message || 'User role updated successfully');
            refetchUsers();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update user role');
        }
    };

    // Filter users based on search
    const filteredUsers = usersData?.data?.filter((user: User) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="w-full">
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user roles and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search users by name, username, or email..."
                    />

                    <UserTable
                        users={filteredUsers}
                        currentUserId={currentUserId}
                        onRoleUpdate={handleRoleUpdate}
                        isLoading={usersLoading}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default UserManagementTab;
