import { Button } from '@/components/ui/button';
import type { UserTableProps } from '../admin.types';

const UserTable = ({ users, currentUserId, onRoleUpdate, isLoading }: UserTableProps) => {
    if (isLoading) {
        return <div className="text-center py-8 text-muted-foreground">Loading users...</div>;
    }

    if (users.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">No users found</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-border bg-muted/50">
                        <th className="hidden md:table-cell text-left p-3 font-semibold text-foreground">Name</th>
                        <th className="hidden md:table-cell text-left p-3 font-semibold text-foreground">Username</th>
                        <th className="text-left p-3 font-semibold text-sm md:text-base text-foreground">Email</th>
                        <th className="text-left p-3 font-semibold text-sm md:text-base text-foreground">Role</th>
                        <th className="text-left p-3 font-semibold text-sm md:text-base text-foreground">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                            <td className="hidden md:table-cell p-3 text-foreground">{user.name}</td>
                            <td className="hidden md:table-cell p-3 text-muted-foreground">@{user.username}</td>
                            <td className="p-3 text-sm md:text-base text-foreground">{user.email}</td>
                            <td className="p-3 text-sm md:text-base">
                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.admin
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                        }`}
                                >
                                    {user.admin ? 'Admin' : 'User'}
                                </span>
                            </td>
                            <td className="p-3 text-sm md:text-base">
                                <Button
                                    size="sm"
                                    variant={user.admin ? 'destructive' : 'default'}
                                    onClick={() => onRoleUpdate(user._id, user.admin)}
                                    disabled={user._id === currentUserId}
                                >
                                    {user.admin ? 'Remove Admin' : 'Make Admin'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
