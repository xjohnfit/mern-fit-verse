import { Search, MessageCircle, User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface User {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

interface UsersSidebarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredUsers: User[] | undefined;
    isLoading: boolean;
    selectedUser: User | null;
    onUserClick: (user: User) => void;
    onlineUsers: string[];
}

export const UsersSidebar = ({
    searchQuery,
    setSearchQuery,
    filteredUsers,
    isLoading,
    selectedUser,
    onUserClick,
    onlineUsers
}: UsersSidebarProps) => {
    return (
        <div className={`w-full md:w-80 bg-card md:border-r border-border flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
            {/* Header */}
            <div className="p-4 border-b border-border">
                <h1 className="text-xl font-bold text-foreground mb-4">
                    Messages
                </h1>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-muted/50 border-0"
                    />
                </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-4 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="animate-pulse flex items-center space-x-3">
                                <div className="w-12 h-12 bg-muted rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-muted rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredUsers && filteredUsers.length > 0 ? (
                    <div>
                        {filteredUsers.map((user: User) => (
                            <div
                                key={user._id}
                                onClick={() => onUserClick(user)}
                                className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${selectedUser?._id === user._id
                                    ? 'bg-primary/10'
                                    : ''
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <Avatar className="w-12 h-12 shrink-0">
                                            {user.photo ? (
                                                <img
                                                    src={user.photo}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white">
                                                    <User className="w-5 h-5" />
                                                </div>
                                            )}
                                        </Avatar>
                                        {onlineUsers.includes(user._id) && (
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-foreground truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <MessageCircle className="w-16 h-16 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground font-medium">
                            {searchQuery ? 'No users found' : 'No conversations yet'}
                        </p>
                        <p className="text-sm text-muted-foreground/70 mt-2">
                            {searchQuery
                                ? 'Try searching for a different user'
                                : 'Start following people to message them'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
