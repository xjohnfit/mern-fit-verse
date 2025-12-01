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
        <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {users.map((user) => (
                    <div
                        key={user._id}
                        className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="space-y-3">
                            {/* Name and Role Header */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground text-base truncate">
                                        {user.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground truncate">
                                        @{user.username}
                                    </p>
                                </div>
                                <span
                                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${user.admin
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                        }`}
                                >
                                    {user.admin ? 'Admin' : 'User'}
                                </span>
                            </div>

                            {/* Email */}
                            <div className="pt-2 border-t border-border">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                                    Email
                                </p>
                                <p className="text-sm text-foreground break-all">
                                    {user.email}
                                </p>
                            </div>

                            {/* Action Button */}
                            <div className="pt-2">
                                <Button
                                    size="sm"
                                    variant={user.admin ? 'destructive' : 'default'}
                                    onClick={() => onRoleUpdate(user._id, user.admin)}
                                    disabled={user._id === currentUserId}
                                    className="w-full"
                                >
                                    {user._id === currentUserId
                                        ? 'Current User'
                                        : user.admin
                                            ? 'Remove Admin'
                                            : 'Make Admin'}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-muted/50">
                            <th className="text-left p-3 font-semibold text-foreground">Name</th>
                            <th className="text-left p-3 font-semibold text-foreground">Username</th>
                            <th className="text-left p-3 font-semibold text-foreground">Email</th>
                            <th className="text-left p-3 font-semibold text-foreground">Role</th>
                            <th className="text-left p-3 font-semibold text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                <td className="p-3 text-foreground">{user.name}</td>
                                <td className="p-3 text-muted-foreground">@{user.username}</td>
                                <td className="p-3 text-foreground">{user.email}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.admin
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                            }`}
                                    >
                                        {user.admin ? 'Admin' : 'User'}
                                    </span>
                                </td>
                                <td className="p-3">
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
        </>
    );
};

export default UserTable;
