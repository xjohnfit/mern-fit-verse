import { ArrowLeft, MoreVertical } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/getInitials';

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
}

export const ChatHeader = ({ selectedUser, onBackClick, onUserClick }: ChatHeaderProps) => {
    return (
        <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {/* Back button for mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBackClick}
                        className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={onUserClick}
                    >
                        <Avatar className="w-10 h-10 shrink-0">
                            {selectedUser.photo ? (
                                <img
                                    src={selectedUser.photo}
                                    alt={selectedUser.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold">
                                    {getInitials(selectedUser.name)}
                                </div>
                            )}
                        </Avatar>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {selectedUser.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                @{selectedUser.username}
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <MoreVertical className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};
