import { Link } from 'react-router';
import { Shield, Lock, Eye, Database, Cookie, AlertCircle, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-950'>
            {/* Header Section */}
            <div className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'>
                <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
                    <div className='max-w-4xl mx-auto text-center'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-6'>
                            <Shield className='w-8 h-8 text-green-600 dark:text-green-400' />
                        </div>
                        <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
                            Privacy Policy
                        </h1>
                        <p className='text-lg text-gray-600 dark:text-gray-400'>
                            Last Updated: November 18, 2025
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <div className='max-w-4xl mx-auto'>
                    {/* Notice Banner */}
                    <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8'>
                        <div className='flex gap-3'>
                            <AlertCircle className='w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5' />
                            <div>
                                <h3 className='font-semibold text-green-900 dark:text-green-100 mb-2'>
                                    Your Privacy Matters
                                </h3>
                                <p className='text-sm text-green-800 dark:text-green-200'>
                                    This Privacy Policy explains how FitVerse collects, uses, and protects
                                    your personal information. We are committed to transparency and protecting
                                    your data privacy.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Content */}
                    <div className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 space-y-8'>
                        {/* Section 1 */}
                        <section>
                            <div className='flex items-center gap-3 mb-4'>
                                <Database className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    1. Information We Collect
                                </h2>
                            </div>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <div>
                                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                        Account Information:
                                    </h3>
                                    <ul className='list-disc list-inside space-y-1 ml-4'>
                                        <li>Username and display name</li>
                                        <li>Email address</li>
                                        <li>Password (encrypted and hashed)</li>
                                        <li>Profile information (bio, location, gender, date of birth)</li>
                                        <li>Profile photo (stored via Cloudinary)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                        Fitness Data:
                                    </h3>
                                    <ul className='list-disc list-inside space-y-1 ml-4'>
                                        <li>Nutrition entries and daily intake logs</li>
                                        <li>Custom meal categories</li>
                                        <li>Nutritional goals and preferences</li>
                                        <li>Workout logs (when feature is available)</li>
                                        <li>Posts, comments, and social interactions</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                        Usage Information:
                                    </h3>
                                    <ul className='list-disc list-inside space-y-1 ml-4'>
                                        <li>Login activity and session data</li>
                                        <li>Feature usage and interaction patterns</li>
                                        <li>Browser type and device information</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <div className='flex items-center gap-3 mb-4'>
                                <Eye className='w-6 h-6 text-purple-600 dark:text-purple-400' />
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    2. How We Use Your Information
                                </h2>
                            </div>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>We use your information to:</p>
                                <ul className='list-disc list-inside space-y-2 ml-4'>
                                    <li>Provide and maintain the Platform's functionality</li>
                                    <li>Authenticate your account and manage sessions</li>
                                    <li>Display your profile and fitness data to you and other users</li>
                                    <li>Enable social features (following, posts, comments, notifications)</li>
                                    <li>Track your nutrition and fitness progress</li>
                                    <li>Improve and optimize the Platform's performance</li>
                                    <li>Communicate important updates or security notices</li>
                                    <li>Prevent fraud and ensure Platform security</li>
                                </ul>
                                <p className='pt-4'>
                                    <strong className='text-gray-900 dark:text-white'>We do NOT:</strong>
                                </p>
                                <ul className='list-disc list-inside space-y-2 ml-4'>
                                    <li>Sell your personal information to third parties</li>
                                    <li>Share your data for advertising purposes</li>
                                    <li>Use your fitness data for any purpose other than providing Platform services</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <div className='flex items-center gap-3 mb-4'>
                                <Lock className='w-6 h-6 text-red-600 dark:text-red-400' />
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    3. Data Storage and Security
                                </h2>
                            </div>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <div>
                                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                        Database Storage:
                                    </h3>
                                    <p>
                                        Your data is stored in MongoDB databases with appropriate security measures:
                                    </p>
                                    <ul className='list-disc list-inside space-y-1 ml-4 mt-2'>
                                        <li>Passwords are hashed using bcrypt encryption</li>
                                        <li>Secure database connections with authentication</li>
                                        <li>Regular security updates and patches</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                        Image Storage:
                                    </h3>
                                    <p>
                                        Profile photos and post images are stored using Cloudinary's secure cloud storage
                                        infrastructure with appropriate access controls.
                                    </p>
                                </div>
                                <div>
                                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                        Authentication:
                                    </h3>
                                    <p>
                                        We use JSON Web Tokens (JWT) stored in HTTP-only cookies for secure session
                                        management and authentication.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <div className='flex items-center gap-3 mb-4'>
                                <Cookie className='w-6 h-6 text-orange-600 dark:text-orange-400' />
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    4. Cookies and Tracking
                                </h2>
                            </div>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>We use cookies and similar technologies for:</p>
                                <ul className='list-disc list-inside space-y-2 ml-4'>
                                    <li>
                                        <strong className='text-gray-900 dark:text-white'>Authentication Cookies:</strong>
                                        {' '}Secure HTTP-only cookies to maintain your login session
                                    </li>
                                    <li>
                                        <strong className='text-gray-900 dark:text-white'>Preference Cookies:</strong>
                                        {' '}Theme settings (dark/light mode) and other user preferences
                                    </li>
                                    <li>
                                        <strong className='text-gray-900 dark:text-white'>Local Storage:</strong>
                                        {' '}Storing non-sensitive data like UI preferences and modal dismissals
                                    </li>
                                </ul>
                                <p>
                                    You can control cookie settings through your browser, but disabling cookies may
                                    limit Platform functionality.
                                </p>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section>
                            <div className='flex items-center gap-3 mb-4'>
                                <Database className='w-6 h-6 text-indigo-600 dark:text-indigo-400' />
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    5. Third-Party Services
                                </h2>
                            </div>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>We integrate with the following third-party services:</p>
                                <div>
                                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                        FatSecret API:
                                    </h3>
                                    <p>
                                        Used to provide nutritional information for food items. Your search queries
                                        are sent to FatSecret to retrieve nutritional data. Please review{' '}
                                        <a
                                            href='https://www.fatsecret.com/privacy'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-blue-600 dark:text-blue-400 hover:underline'
                                        >
                                            FatSecret's Privacy Policy
                                        </a>.
                                    </p>
                                </div>
                                <div>
                                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                        Cloudinary:
                                    </h3>
                                    <p>
                                        Used for image hosting and optimization. Your uploaded images are stored on
                                        Cloudinary's servers. Please review{' '}
                                        <a
                                            href='https://cloudinary.com/privacy'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-blue-600 dark:text-blue-400 hover:underline'
                                        >
                                            Cloudinary's Privacy Policy
                                        </a>.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 6 */}
                        <section>
                            <div className='flex items-center gap-3 mb-4'>
                                <Shield className='w-6 h-6 text-green-600 dark:text-green-400' />
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    6. Your Data Rights
                                </h2>
                            </div>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>You have the right to:</p>
                                <ul className='list-disc list-inside space-y-2 ml-4'>
                                    <li>
                                        <strong className='text-gray-900 dark:text-white'>Access:</strong>
                                        {' '}View your personal data stored on the Platform
                                    </li>
                                    <li>
                                        <strong className='text-gray-900 dark:text-white'>Update:</strong>
                                        {' '}Modify your profile information and settings at any time
                                    </li>
                                    <li>
                                        <strong className='text-gray-900 dark:text-white'>Delete:</strong>
                                        {' '}Request deletion of your account and associated data
                                    </li>
                                    <li>
                                        <strong className='text-gray-900 dark:text-white'>Export:</strong>
                                        {' '}Download your data in a portable format (feature coming soon)
                                    </li>
                                    <li>
                                        <strong className='text-gray-900 dark:text-white'>Object:</strong>
                                        {' '}Opt-out of certain data processing activities
                                    </li>
                                </ul>
                                <p className='pt-2'>
                                    To exercise these rights, please contact us through our{' '}
                                    <a
                                        href='https://github.com/xjohnfit/mern-fit-verse/issues'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-blue-600 dark:text-blue-400 hover:underline'
                                    >
                                        GitHub repository
                                    </a>.
                                </p>
                            </div>
                        </section>

                        {/* Section 7 */}
                        <section>
                            <div className='flex items-center gap-3 mb-4'>
                                <Eye className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    7. Data Sharing and Public Information
                                </h2>
                            </div>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p className='font-semibold text-gray-900 dark:text-white'>
                                    Public Information:
                                </p>
                                <p>
                                    The following information is visible to other Platform users:
                                </p>
                                <ul className='list-disc list-inside space-y-1 ml-4'>
                                    <li>Username and display name</li>
                                    <li>Profile photo and bio</li>
                                    <li>Posts and comments you create</li>
                                    <li>Your followers and following lists</li>
                                    <li>Activity timestamps</li>
                                </ul>
                                <p className='pt-4'>
                                    <strong className='text-gray-900 dark:text-white'>Private Information:</strong>
                                </p>
                                <p>
                                    Your email address, password, nutrition goals, and detailed fitness data are
                                    kept private and not shared with other users.
                                </p>
                            </div>
                        </section>

                        {/* Section 8 */}
                        <section>
                            <div className='flex items-center gap-3 mb-4'>
                                <AlertCircle className='w-6 h-6 text-yellow-600 dark:text-yellow-400' />
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    8. Data Retention
                                </h2>
                            </div>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>
                                    We retain your personal information for as long as your account is active or as
                                    needed to provide Platform services.
                                </p>
                                <p>
                                    When you delete your account, we will permanently remove your personal data within
                                    30 days, except where retention is required for legal compliance or legitimate
                                    business purposes.
                                </p>
                            </div>
                        </section>

                        {/* Section 9 */}
                        <section>
                            <div className='flex items-center gap-3 mb-4'>
                                <Shield className='w-6 h-6 text-red-600 dark:text-red-400' />
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    9. Children's Privacy
                                </h2>
                            </div>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>
                                    The Platform is not intended for users under the age of 13. We do not knowingly
                                    collect personal information from children under 13. If you believe we have
                                    inadvertently collected such information, please contact us immediately.
                                </p>
                            </div>
                        </section>

                        {/* Section 10 */}
                        <section>
                            <div className='flex items-center gap-3 mb-4'>
                                <Database className='w-6 h-6 text-purple-600 dark:text-purple-400' />
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    10. Changes to This Policy
                                </h2>
                            </div>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>
                                    We may update this Privacy Policy from time to time. We will notify you of any
                                    changes by updating the "Last Updated" date and posting the new policy on this page.
                                </p>
                                <p>
                                    Continued use of the Platform after changes constitutes acceptance of the updated policy.
                                </p>
                            </div>
                        </section>

                        {/* Section 11 */}
                        <section>
                            <div className='flex items-center gap-3 mb-4'>
                                <Mail className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    11. Contact Us
                                </h2>
                            </div>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>
                                    If you have questions about this Privacy Policy or how we handle your data,
                                    please contact us:
                                </p>
                                <ul className='list-disc list-inside space-y-2 ml-4'>
                                    <li>
                                        GitHub Issues:{' '}
                                        <a
                                            href='https://github.com/xjohnfit/mern-fit-verse/issues'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-blue-600 dark:text-blue-400 hover:underline'
                                        >
                                            Report Privacy Concern
                                        </a>
                                    </li>
                                    <li>
                                        Project Repository:{' '}
                                        <a
                                            href='https://github.com/xjohnfit/mern-fit-verse'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-blue-600 dark:text-blue-400 hover:underline'
                                        >
                                            GitHub
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Bottom Navigation */}
                    <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center'>
                        <Link
                            to='/'
                            className='text-blue-600 dark:text-blue-400 hover:underline'
                        >
                            ← Back to Home
                        </Link>
                        <Link
                            to='/terms-of-service'
                            className='text-blue-600 dark:text-blue-400 hover:underline'
                        >
                            View Terms of Service →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;