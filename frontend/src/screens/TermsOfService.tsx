import { Link } from 'react-router';
import { ScrollText, AlertCircle, CheckCircle } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-950'>
            {/* Header Section */}
            <div className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'>
                <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
                    <div className='max-w-4xl mx-auto text-center'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6'>
                            <ScrollText className='w-8 h-8 text-blue-600 dark:text-blue-400' />
                        </div>
                        <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
                            Terms of Service
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
                    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8'>
                        <div className='flex gap-3'>
                            <AlertCircle className='w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5' />
                            <div>
                                <h3 className='font-semibold text-blue-900 dark:text-blue-100 mb-2'>
                                    Important Notice
                                </h3>
                                <p className='text-sm text-blue-800 dark:text-blue-200'>
                                    MERN FitVerse is currently in active development. By using this platform,
                                    you acknowledge that features may change and the service is provided "as is"
                                    for educational and demonstration purposes.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Terms Content */}
                    <div className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 space-y-8'>
                        {/* Section 1 */}
                        <section>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                1. Acceptance of Terms
                            </h2>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>
                                    By accessing and using MERN FitVerse ("the Platform"), you accept and agree
                                    to be bound by these Terms of Service. If you do not agree to these terms,
                                    please do not use the Platform.
                                </p>
                                <p>
                                    This Platform is a demonstration project built with the MERN stack (MongoDB,
                                    Express, React, Node.js) for educational purposes and portfolio showcase.
                                </p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                2. User Accounts
                            </h2>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>
                                    To access certain features of the Platform, you must create an account. You agree to:
                                </p>
                                <ul className='list-none space-y-2 ml-4'>
                                    <li className='flex items-start gap-2'>
                                        <CheckCircle className='w-4 h-4 text-green-600 dark:text-green-400 mt-1 shrink-0' />
                                        <span>Provide accurate and complete registration information</span>
                                    </li>
                                    <li className='flex items-start gap-2'>
                                        <CheckCircle className='w-4 h-4 text-green-600 dark:text-green-400 mt-1 shrink-0' />
                                        <span>Maintain the security of your password and account</span>
                                    </li>
                                    <li className='flex items-start gap-2'>
                                        <CheckCircle className='w-4 h-4 text-green-600 dark:text-green-400 mt-1 shrink-0' />
                                        <span>Accept responsibility for all activities under your account</span>
                                    </li>
                                    <li className='flex items-start gap-2'>
                                        <CheckCircle className='w-4 h-4 text-green-600 dark:text-green-400 mt-1 shrink-0' />
                                        <span>Notify us immediately of any unauthorized access</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                3. User Content and Conduct
                            </h2>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>
                                    You retain ownership of content you post on the Platform. By posting content,
                                    you grant us a non-exclusive license to use, display, and distribute your content
                                    within the Platform.
                                </p>
                                <p className='font-semibold text-gray-900 dark:text-white'>
                                    You agree NOT to:
                                </p>
                                <ul className='list-disc list-inside space-y-2 ml-4'>
                                    <li>Post harmful, offensive, or inappropriate content</li>
                                    <li>Impersonate others or misrepresent your identity</li>
                                    <li>Engage in spam or unauthorized advertising</li>
                                    <li>Violate any applicable laws or regulations</li>
                                    <li>Attempt to compromise the Platform's security</li>
                                    <li>Harvest or collect user data without permission</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                4. Fitness and Health Disclaimer
                            </h2>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p className='font-semibold text-orange-600 dark:text-orange-400'>
                                    Important Health Notice:
                                </p>
                                <p>
                                    The Platform provides fitness tracking and nutritional information for educational
                                    purposes only. This information is NOT medical advice and should not replace
                                    professional medical consultation.
                                </p>
                                <p>
                                    Before starting any fitness program or making dietary changes, consult with
                                    qualified healthcare professionals. We are not responsible for any health issues
                                    that may arise from using the Platform.
                                </p>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                5. Third-Party Services
                            </h2>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>
                                    The Platform integrates with third-party services including:
                                </p>
                                <ul className='list-disc list-inside space-y-2 ml-4'>
                                    <li>FatSecret API for nutritional data</li>
                                    <li>Cloudinary for image storage and management</li>
                                </ul>
                                <p>
                                    Your use of these services is subject to their respective terms and conditions.
                                    We are not responsible for third-party service availability or accuracy.
                                </p>
                            </div>
                        </section>

                        {/* Section 6 */}
                        <section>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                6. Intellectual Property
                            </h2>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>
                                    This Platform is an open-source project licensed under the ISC License.
                                    The source code is available on{' '}
                                    <a
                                        href='https://github.com/xjohnfit/mern-fit-verse'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-blue-600 dark:text-blue-400 hover:underline'
                                    >
                                        GitHub
                                    </a>.
                                </p>
                                <p>
                                    All original content, features, and functionality are owned by the project
                                    maintainers. Third-party libraries and services are subject to their respective licenses.
                                </p>
                            </div>
                        </section>

                        {/* Section 7 */}
                        <section>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                7. Limitation of Liability
                            </h2>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p className='font-semibold text-gray-900 dark:text-white'>
                                    THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.
                                </p>
                                <p>
                                    To the maximum extent permitted by law, we shall not be liable for any indirect,
                                    incidental, special, consequential, or punitive damages resulting from your use
                                    or inability to use the Platform.
                                </p>
                                <p>
                                    This includes, but is not limited to, data loss, service interruptions, or
                                    any health-related issues arising from platform usage.
                                </p>
                            </div>
                        </section>

                        {/* Section 8 */}
                        <section>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                8. Service Modifications and Termination
                            </h2>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>
                                    We reserve the right to:
                                </p>
                                <ul className='list-disc list-inside space-y-2 ml-4'>
                                    <li>Modify or discontinue the Platform at any time</li>
                                    <li>Suspend or terminate accounts that violate these terms</li>
                                    <li>Update features and functionality without notice</li>
                                    <li>Change these Terms of Service with reasonable notice</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 9 */}
                        <section>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                9. Data and Privacy
                            </h2>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>
                                    Your use of the Platform is also governed by our{' '}
                                    <Link
                                        to='/privacy-policy'
                                        className='text-blue-600 dark:text-blue-400 hover:underline'
                                    >
                                        Privacy Policy
                                    </Link>, which describes how we collect, use, and protect your information.
                                </p>
                            </div>
                        </section>

                        {/* Section 10 */}
                        <section>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                10. Contact Information
                            </h2>
                            <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                                <p>
                                    For questions about these Terms of Service, please contact us through:
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
                                            Report an Issue
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
                            to='/privacy-policy'
                            className='text-blue-600 dark:text-blue-400 hover:underline'
                        >
                            View Privacy Policy →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;