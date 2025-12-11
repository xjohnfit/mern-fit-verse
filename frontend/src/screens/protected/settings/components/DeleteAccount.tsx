import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteUserMutation } from '@/slices/usersApiSlice';
import { clearCredentials } from '@/slices/authSlice';

const DeleteAccount = () => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [deleteUser, { isLoading }] = useDeleteUserMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        if (confirmText !== 'DELETE') {
            toast.error('Please type DELETE to confirm');
            return;
        }

        try {
            await deleteUser().unwrap();
            dispatch(clearCredentials());
            toast.success('Account deleted successfully');
            navigate('/login');
        } catch (err: any) {
            const errorMessage = err?.data?.message || err?.message || 'Failed to delete account';
            toast.error(errorMessage);
        }
    };

    return (
        <div className='space-y-4'>
            <div className='flex items-center space-x-3 mb-4'>
                <div className='p-2 bg-red-500 rounded-lg'>
                    <AlertTriangle className='w-5 h-5 text-white' />
                </div>
                <div>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-gray-100'>
                        Danger Zone
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Irreversible and destructive actions
                    </p>
                </div>
            </div>

            <div className='bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-xl p-6'>
                <div className='flex items-start space-x-4'>
                    <div className='p-3 bg-red-100 dark:bg-red-900/30 rounded-lg'>
                        <Trash2 className='w-6 h-6 text-red-600 dark:text-red-400' />
                    </div>
                    <div className='flex-1'>
                        <h4 className='text-lg font-semibold text-red-900 dark:text-red-100 mb-2'>
                            Delete Account
                        </h4>
                        <p className='text-sm text-red-700 dark:text-red-300 mb-4'>
                            Once you delete your account, there is no going back. This will permanently delete:
                        </p>
                        <ul className='text-sm text-red-700 dark:text-red-300 space-y-1 mb-6 ml-4 list-disc'>
                            <li>Your profile and personal information</li>
                            <li>All your workouts and workout templates</li>
                            <li>Your nutrition data and goals</li>
                            <li>All posts and social interactions</li>
                            <li>Messages and notifications</li>
                            <li>Custom categories and exercises</li>
                        </ul>
                        <button
                            type='button'
                            onClick={() => setShowConfirmDialog(true)}
                            disabled={isLoading}
                            className='px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Delete My Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4'>
                        <div className='flex items-center space-x-3'>
                            <div className='p-3 bg-red-100 dark:bg-red-900/30 rounded-full'>
                                <AlertTriangle className='w-6 h-6 text-red-600 dark:text-red-400' />
                            </div>
                            <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                                Confirm Account Deletion
                            </h3>
                        </div>

                        <p className='text-gray-600 dark:text-gray-400'>
                            This action cannot be undone. All your data will be permanently deleted from our servers.
                        </p>

                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Type <span className='font-bold text-red-600'>DELETE</span> to confirm:
                            </label>
                            <input
                                type='text'
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder='DELETE'
                                className='w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            />
                        </div>

                        <div className='flex space-x-3 pt-4'>
                            <button
                                type='button'
                                onClick={() => {
                                    setShowConfirmDialog(false);
                                    setConfirmText('');
                                }}
                                disabled={isLoading}
                                className='flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors disabled:opacity-50'
                            >
                                Cancel
                            </button>
                            <button
                                type='button'
                                onClick={handleDeleteAccount}
                                disabled={isLoading || confirmText !== 'DELETE'}
                                className='flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {isLoading ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteAccount;

