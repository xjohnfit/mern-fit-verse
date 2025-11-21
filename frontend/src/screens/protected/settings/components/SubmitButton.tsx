import { ArrowRight } from "lucide-react";
import type { SubmitButtonProps } from "../settings.types";

export const SubmitButton = ({ isLoading, errors, profileData }: SubmitButtonProps) => {
  return (
    <button
                                    disabled={
                                        isLoading ||
                                        Object.values(errors).some(
                                            (error) =>
                                                error && error.trim() !== ''
                                        ) ||
                                        !profileData.name.trim() ||
                                        !profileData.username.trim() ||
                                        !profileData.email.trim()
                                    }
                                    type='submit'
                                    className='w-full group relative overflow-hidden bg-linear-to-r from-blue-500 via-purple-500 to-indigo-500 text-white py-4 px-6 rounded-xl font-semibold text-base hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 min-h-14'>
                                    {isLoading ? (
                                        <div className='flex items-center justify-center space-x-3'>
                                            <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                            <span>
                                                Updating your profile...
                                            </span>
                                        </div>
                                    ) : (
                                        <div className='flex items-center justify-center space-x-2'>
                                            <span>Update Profile</span>
                                            <ArrowRight className='h-5 w-5 group-hover:translate-x-1 transition-transform duration-200' />
                                        </div>
                                    )}
                                </button>
  )
}