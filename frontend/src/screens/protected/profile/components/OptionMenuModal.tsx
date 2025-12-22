import { useState } from 'react';
import { Flag, Ban, ChevronRight, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AlertModal from '@/components/modals/AlertModal';
import { useReportUserMutation } from '@/slices/reportsApiSlice';
import { useBlockUserMutation } from '@/slices/blockApiSlice';
import { toast } from 'sonner';

interface OptionMenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    userId: string;
}

const reportReasons = [
    { value: 'harassment', label: 'Harassment' },
    { value: 'hate_speech', label: 'Hate Speech' },
    { value: 'spam', label: 'Spam' },
    { value: 'inappropriate_content', label: 'Inappropriate Content' },
    { value: 'violence', label: 'Violence' },
    { value: 'other', label: 'Other' },
];

export const OptionMenuModal = ({ isOpen, onClose, userName, userId }: OptionMenuModalProps) => {
    const [showReportReasons, setShowReportReasons] = useState(false);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);
    const [reportUser, { isLoading: isReporting }] = useReportUserMutation();
    const [blockUser] = useBlockUserMutation();

    const handleReportClick = () => {
        onClose();
        setShowReportReasons(true);
    };

    const handleBlockClick = () => {
        onClose();
        setShowBlockConfirm(true);
    };

    const submitReport = async (reason: string) => {
        try {
            const response = await reportUser({
                reportedUserId: userId,
                reason,
            }).unwrap();

            toast.success(response.message || 'Thank you for your report. We will review it within 24 hours.');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to submit report. Please try again.');
        }
        setShowReportReasons(false);
    };

    const confirmBlock = async () => {
        try {
            const response = await blockUser(userId).unwrap();
            toast.success(response.message || `${userName} has been blocked.`);
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to block user. Please try again.');
        }
        setShowBlockConfirm(false);
    };

    return (
        <>
            {/* Main Options Menu */}
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden">
                    <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            User Options
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Manage your interaction with @{userName}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-4">
                        {/* Report Option */}
                        <button
                            onClick={handleReportClick}
                            className="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
                        >
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0">
                                <Flag className="w-5 h-5 text-red-600 dark:text-red-500" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                    Report User
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                                    Report inappropriate behavior
                                </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors" />
                        </button>

                        {/* Divider */}
                        <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>

                        {/* Block Option */}
                        <button
                            onClick={handleBlockClick}
                            className="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
                        >
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0">
                                <Ban className="w-5 h-5 text-red-700 dark:text-red-600" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                    Block User
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                                    Stop all interactions
                                </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors" />
                        </button>
                    </div>

                    <div className="px-4 pb-4">
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            className="w-full h-10 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Report Reasons Dialog */}
            <Dialog open={showReportReasons} onOpenChange={setShowReportReasons}>
                <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden">
                    <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-b border-red-200 dark:border-red-900">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                    Report User
                                </DialogTitle>
                                <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                    Why are you reporting @{userName}?
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="px-4 py-3 max-h-[380px] overflow-y-auto">
                        <div className="space-y-1.5">
                            {reportReasons.map((reason) => (
                                <button
                                    key={reason.value}
                                    onClick={() => submitReport(reason.value)}
                                    disabled={isReporting}
                                    className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                >
                                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                        {reason.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            onClick={() => setShowReportReasons(false)}
                            variant="ghost"
                            className="w-full h-10 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            disabled={isReporting}
                        >
                            {isReporting ? 'Submitting...' : 'Cancel'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Block Confirmation */}
            <AlertModal
                isOpen={showBlockConfirm}
                onClose={() => setShowBlockConfirm(false)}
                onConfirm={confirmBlock}
                title="Block User"
                message={`Are you sure you want to block @${userName}? You will no longer see their posts and they won't be able to interact with you.`}
                confirmText="Block"
                cancelText="Cancel"
                variant="danger"
            />
        </>
    );
};
