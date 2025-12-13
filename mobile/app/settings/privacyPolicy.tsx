import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
    Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SafeScreen from '@/components/layout/SafeScreen';
import privacyPolicyStyles from '@/styles/settings/privacyPolicyStyles';

const PrivacyPolicy = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const openLink = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <SafeScreen>
            <View
                style={[
                    privacyPolicyStyles.container,
                    isDark
                        ? privacyPolicyStyles.darkBackground
                        : privacyPolicyStyles.lightBackground,
                ]}
            >
                {/* Header */}
                <View
                    style={[
                        privacyPolicyStyles.header,
                        isDark ? privacyPolicyStyles.headerDark : privacyPolicyStyles.headerLight,
                    ]}
                >
                    <View style={privacyPolicyStyles.headerRow}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={privacyPolicyStyles.backButton}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color={isDark ? '#FFFFFF' : '#111827'}
                            />
                        </TouchableOpacity>
                        <View style={privacyPolicyStyles.headerTextContainer}>
                            <Text
                                style={[
                                    privacyPolicyStyles.headerTitle,
                                    isDark
                                        ? privacyPolicyStyles.headerTitleDark
                                        : privacyPolicyStyles.headerTitleLight,
                                ]}
                            >
                                Privacy Policy
                            </Text>
                            <Text
                                style={[
                                    privacyPolicyStyles.headerSubtitle,
                                    isDark
                                        ? privacyPolicyStyles.headerSubtitleDark
                                        : privacyPolicyStyles.headerSubtitleLight,
                                ]}
                            >
                                Last Updated: December 11, 2025
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <ScrollView
                    style={privacyPolicyStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Notice Banner */}
                    <View
                        style={[
                            privacyPolicyStyles.noticeBanner,
                            isDark
                                ? privacyPolicyStyles.noticeBannerDark
                                : privacyPolicyStyles.noticeBannerLight,
                        ]}
                    >
                        <View style={privacyPolicyStyles.noticeBannerRow}>
                            <View
                                style={[
                                    privacyPolicyStyles.noticeIconContainer,
                                    isDark
                                        ? privacyPolicyStyles.noticeIconContainerDark
                                        : privacyPolicyStyles.noticeIconContainerLight,
                                ]}
                            >
                                <Ionicons name="shield-checkmark" size={24} color="#10b981" />
                            </View>
                            <View style={privacyPolicyStyles.noticeTextContainer}>
                                <Text
                                    style={[
                                        privacyPolicyStyles.noticeTitle,
                                        isDark
                                            ? privacyPolicyStyles.noticeTitleDark
                                            : privacyPolicyStyles.noticeTitleLight,
                                    ]}
                                >
                                    Your Privacy Matters
                                </Text>
                                <Text
                                    style={[
                                        privacyPolicyStyles.noticeText,
                                        isDark
                                            ? privacyPolicyStyles.noticeTextDark
                                            : privacyPolicyStyles.noticeTextLight,
                                    ]}
                                >
                                    This Privacy Policy explains how MERN FitVerse collects, uses, and
                                    protects your personal information. We are committed to transparency and
                                    protecting your data privacy.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Section 1: Information We Collect */}
                    <View style={privacyPolicyStyles.section}>
                        <View style={privacyPolicyStyles.sectionHeader}>
                            <Ionicons
                                name="folder-open-outline"
                                size={24}
                                color="#3b82f6"
                                style={privacyPolicyStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    privacyPolicyStyles.sectionTitle,
                                    isDark
                                        ? privacyPolicyStyles.sectionTitleDark
                                        : privacyPolicyStyles.sectionTitleLight,
                                ]}
                            >
                                1. Information We Collect
                            </Text>
                        </View>

                        <Text
                            style={[
                                privacyPolicyStyles.subsectionTitle,
                                isDark
                                    ? privacyPolicyStyles.subsectionTitleDark
                                    : privacyPolicyStyles.subsectionTitleLight,
                            ]}
                        >
                            Account Information:
                        </Text>
                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            • Username and display name{'\n'}
                            • Email address{'\n'}
                            • Password (encrypted and hashed){'\n'}
                            • Profile information (bio, location, gender, date of birth){'\n'}
                            • Profile photo (stored via Cloudinary)
                        </Text>

                        <Text
                            style={[
                                privacyPolicyStyles.subsectionTitle,
                                isDark
                                    ? privacyPolicyStyles.subsectionTitleDark
                                    : privacyPolicyStyles.subsectionTitleLight,
                            ]}
                        >
                            Fitness Data:
                        </Text>
                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            • Workout logs and exercise history{'\n'}
                            • Workout templates and custom exercises{'\n'}
                            • Nutrition entries and daily intake logs{'\n'}
                            • Custom meal categories{'\n'}
                            • Nutritional goals and preferences{'\n'}
                            • Posts, comments, and social interactions
                        </Text>

                        <Text
                            style={[
                                privacyPolicyStyles.subsectionTitle,
                                isDark
                                    ? privacyPolicyStyles.subsectionTitleDark
                                    : privacyPolicyStyles.subsectionTitleLight,
                            ]}
                        >
                            Usage Information:
                        </Text>
                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            • Login activity and session data{'\n'}
                            • Feature usage and interaction patterns{'\n'}
                            • Device information and app version
                        </Text>
                    </View>

                    {/* Section 2: How We Use Your Information */}
                    <View style={privacyPolicyStyles.section}>
                        <View style={privacyPolicyStyles.sectionHeader}>
                            <Ionicons
                                name="eye-outline"
                                size={24}
                                color="#8b5cf6"
                                style={privacyPolicyStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    privacyPolicyStyles.sectionTitle,
                                    isDark
                                        ? privacyPolicyStyles.sectionTitleDark
                                        : privacyPolicyStyles.sectionTitleLight,
                                ]}
                            >
                                2. How We Use Your Information
                            </Text>
                        </View>

                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            We use your information to:{'\n\n'}
                            • Provide and maintain the Platform's functionality{'\n'}
                            • Authenticate your account and manage sessions{'\n'}
                            • Display your profile and fitness data{'\n'}
                            • Enable social features (following, posts, notifications){'\n'}
                            • Track your nutrition and fitness progress{'\n'}
                            • Improve and optimize the Platform{'\n'}
                            • Communicate important updates or security notices{'\n'}
                            • Prevent fraud and ensure Platform security
                        </Text>

                        <Text
                            style={[
                                privacyPolicyStyles.subsectionTitle,
                                isDark
                                    ? privacyPolicyStyles.subsectionTitleDark
                                    : privacyPolicyStyles.subsectionTitleLight,
                            ]}
                        >
                            We do NOT:
                        </Text>
                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            • Sell your personal information to third parties{'\n'}
                            • Share your data for advertising purposes{'\n'}
                            • Use your fitness data for any purpose other than providing services
                        </Text>
                    </View>

                    {/* Section 3: Data Storage and Security */}
                    <View style={privacyPolicyStyles.section}>
                        <View style={privacyPolicyStyles.sectionHeader}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={24}
                                color="#ef4444"
                                style={privacyPolicyStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    privacyPolicyStyles.sectionTitle,
                                    isDark
                                        ? privacyPolicyStyles.sectionTitleDark
                                        : privacyPolicyStyles.sectionTitleLight,
                                ]}
                            >
                                3. Data Storage and Security
                            </Text>
                        </View>

                        <Text
                            style={[
                                privacyPolicyStyles.subsectionTitle,
                                isDark
                                    ? privacyPolicyStyles.subsectionTitleDark
                                    : privacyPolicyStyles.subsectionTitleLight,
                            ]}
                        >
                            Database Storage:
                        </Text>
                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            Your data is stored in MongoDB databases with appropriate security measures:
                            {'\n\n'}
                            • Passwords are hashed using bcrypt encryption{'\n'}
                            • Secure database connections with authentication{'\n'}
                            • Regular security updates and patches
                        </Text>

                        <Text
                            style={[
                                privacyPolicyStyles.subsectionTitle,
                                isDark
                                    ? privacyPolicyStyles.subsectionTitleDark
                                    : privacyPolicyStyles.subsectionTitleLight,
                            ]}
                        >
                            Image Storage:
                        </Text>
                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            Profile photos and post images are stored using Cloudinary's secure cloud
                            storage infrastructure with appropriate access controls.
                        </Text>

                        <Text
                            style={[
                                privacyPolicyStyles.subsectionTitle,
                                isDark
                                    ? privacyPolicyStyles.subsectionTitleDark
                                    : privacyPolicyStyles.subsectionTitleLight,
                            ]}
                        >
                            Authentication:
                        </Text>
                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            We use JSON Web Tokens (JWT) stored securely for session management and
                            authentication.
                        </Text>
                    </View>

                    {/* Section 4: Third-Party Services */}
                    <View style={privacyPolicyStyles.section}>
                        <View style={privacyPolicyStyles.sectionHeader}>
                            <Ionicons
                                name="cloud-outline"
                                size={24}
                                color="#6366f1"
                                style={privacyPolicyStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    privacyPolicyStyles.sectionTitle,
                                    isDark
                                        ? privacyPolicyStyles.sectionTitleDark
                                        : privacyPolicyStyles.sectionTitleLight,
                                ]}
                            >
                                4. Third-Party Services
                            </Text>
                        </View>

                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            We integrate with the following third-party services:{'\n'}
                        </Text>

                        <Text
                            style={[
                                privacyPolicyStyles.subsectionTitle,
                                isDark
                                    ? privacyPolicyStyles.subsectionTitleDark
                                    : privacyPolicyStyles.subsectionTitleLight,
                            ]}
                        >
                            FatSecret API:
                        </Text>
                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            Used to provide nutritional information for food items. Your search queries are
                            sent to FatSecret to retrieve nutritional data.
                        </Text>
                        <TouchableOpacity onPress={() => openLink('https://www.fatsecret.com/privacy')}>
                            <Text style={privacyPolicyStyles.linkText}>View FatSecret's Privacy Policy →</Text>
                        </TouchableOpacity>

                        <Text
                            style={[
                                privacyPolicyStyles.subsectionTitle,
                                isDark
                                    ? privacyPolicyStyles.subsectionTitleDark
                                    : privacyPolicyStyles.subsectionTitleLight,
                            ]}
                        >
                            Cloudinary:
                        </Text>
                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            Used for image hosting and optimization. Your uploaded images are stored on
                            Cloudinary's servers.
                        </Text>
                        <TouchableOpacity onPress={() => openLink('https://cloudinary.com/privacy')}>
                            <Text style={privacyPolicyStyles.linkText}>View Cloudinary's Privacy Policy →</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Section 5: Your Data Rights */}
                    <View style={privacyPolicyStyles.section}>
                        <View style={privacyPolicyStyles.sectionHeader}>
                            <Ionicons
                                name="shield-outline"
                                size={24}
                                color="#10b981"
                                style={privacyPolicyStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    privacyPolicyStyles.sectionTitle,
                                    isDark
                                        ? privacyPolicyStyles.sectionTitleDark
                                        : privacyPolicyStyles.sectionTitleLight,
                                ]}
                            >
                                5. Your Data Rights
                            </Text>
                        </View>

                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            You have the right to:{'\n\n'}
                            • Access: View your personal data stored on the Platform{'\n'}
                            • Update: Modify your profile information and settings{'\n'}
                            • Delete: Request deletion of your account and associated data{'\n'}
                            • Export: Download your data in a portable format{'\n'}
                            • Object: Opt-out of certain data processing activities
                        </Text>
                    </View>

                    {/* Section 6: Data Retention */}
                    <View style={privacyPolicyStyles.section}>
                        <View style={privacyPolicyStyles.sectionHeader}>
                            <Ionicons
                                name="time-outline"
                                size={24}
                                color="#f59e0b"
                                style={privacyPolicyStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    privacyPolicyStyles.sectionTitle,
                                    isDark
                                        ? privacyPolicyStyles.sectionTitleDark
                                        : privacyPolicyStyles.sectionTitleLight,
                                ]}
                            >
                                6. Data Retention
                            </Text>
                        </View>

                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            We retain your personal information for as long as your account is active or as
                            needed to provide Platform services.{'\n\n'}
                            When you delete your account, we will permanently remove your personal data within
                            30 days, except where retention is required for legal compliance or legitimate
                            business purposes.
                        </Text>
                    </View>

                    {/* Section 7: Children's Privacy */}
                    <View style={privacyPolicyStyles.section}>
                        <View style={privacyPolicyStyles.sectionHeader}>
                            <Ionicons
                                name="people-outline"
                                size={24}
                                color="#ec4899"
                                style={privacyPolicyStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    privacyPolicyStyles.sectionTitle,
                                    isDark
                                        ? privacyPolicyStyles.sectionTitleDark
                                        : privacyPolicyStyles.sectionTitleLight,
                                ]}
                            >
                                7. Children's Privacy
                            </Text>
                        </View>

                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            The Platform is not intended for users under the age of 13. We do not knowingly
                            collect personal information from children under 13. If you believe we have
                            inadvertently collected such information, please contact us immediately.
                        </Text>
                    </View>

                    {/* Section 8: Changes to This Policy */}
                    <View style={privacyPolicyStyles.section}>
                        <View style={privacyPolicyStyles.sectionHeader}>
                            <Ionicons
                                name="refresh-outline"
                                size={24}
                                color="#8b5cf6"
                                style={privacyPolicyStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    privacyPolicyStyles.sectionTitle,
                                    isDark
                                        ? privacyPolicyStyles.sectionTitleDark
                                        : privacyPolicyStyles.sectionTitleLight,
                                ]}
                            >
                                8. Changes to This Policy
                            </Text>
                        </View>

                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            We may update this Privacy Policy from time to time. We will notify you of any
                            changes by updating the "Last Updated" date and posting the new policy.{'\n\n'}
                            Continued use of the Platform after changes constitutes acceptance of the updated
                            policy.
                        </Text>
                    </View>

                    {/* Section 9: Contact Us */}
                    <View style={[privacyPolicyStyles.section, { marginBottom: 32 }]}>
                        <View style={privacyPolicyStyles.sectionHeader}>
                            <Ionicons
                                name="mail-outline"
                                size={24}
                                color="#3b82f6"
                                style={privacyPolicyStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    privacyPolicyStyles.sectionTitle,
                                    isDark
                                        ? privacyPolicyStyles.sectionTitleDark
                                        : privacyPolicyStyles.sectionTitleLight,
                                ]}
                            >
                                9. Contact Us
                            </Text>
                        </View>

                        <Text
                            style={[
                                privacyPolicyStyles.bodyText,
                                isDark
                                    ? privacyPolicyStyles.bodyTextDark
                                    : privacyPolicyStyles.bodyTextLight,
                            ]}
                        >
                            If you have questions about this Privacy Policy or how we handle your data, please
                            contact us:
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                openLink('https://github.com/xjohnfit/mern-fit-verse/issues')
                            }
                            style={privacyPolicyStyles.contactButton}
                        >
                            <Ionicons
                                name="logo-github"
                                size={20}
                                color={isDark ? '#fff' : '#111827'}
                            />
                            <Text
                                style={[
                                    privacyPolicyStyles.contactButtonText,
                                    isDark
                                        ? privacyPolicyStyles.contactButtonTextDark
                                        : privacyPolicyStyles.contactButtonTextLight,
                                ]}
                            >
                                Report Privacy Concern
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => openLink('https://github.com/xjohnfit/mern-fit-verse')}
                            style={privacyPolicyStyles.contactButton}
                        >
                            <Ionicons
                                name="logo-github"
                                size={20}
                                color={isDark ? '#fff' : '#111827'}
                            />
                            <Text
                                style={[
                                    privacyPolicyStyles.contactButtonText,
                                    isDark
                                        ? privacyPolicyStyles.contactButtonTextDark
                                        : privacyPolicyStyles.contactButtonTextLight,
                                ]}
                            >
                                GitHub Repository
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeScreen>
    );
};

export default PrivacyPolicy;

