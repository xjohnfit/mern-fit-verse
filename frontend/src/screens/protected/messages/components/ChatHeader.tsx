import { ArrowLeft, MoreVertical, User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface User {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

interface ChatHeaderProps {
    selectedUser: User;
    onBackClick: () => void;
    onUserClick: () => void;
    onlineUsers: string[];
}

export const ChatHeader = ({ selectedUser, onBackClick, onUserClick, onlineUsers }: ChatHeaderProps) => {
    const isOnline = onlineUsers.includes(selectedUser._id);
    return (
        <div className="p-4 bg-card border-b border-border">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {/* Back button for mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBackClick}
                        className="md:hidden text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={onUserClick}
                    >
                        <div className="relative">
                            <Avatar className="w-10 h-10 shrink-0">
                                {selectedUser.photo ? (
                                    <img
                                        src={selectedUser.photo}
                                        alt={selectedUser.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white">
                                        <User className="w-5 h-5" />
                                    </div>
                                )}
                            </Avatar>
                            {isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">
                                {selectedUser.name}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                {isOnline ? (
                                    <>
                                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                        <span className="text-green-600 dark:text-green-500 font-medium">Online</span>
                                    </>
                                ) : (
                                    <span>@{selectedUser.username}</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                >
                    <MoreVertical className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};
