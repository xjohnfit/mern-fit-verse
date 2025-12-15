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
import termsOfServiceStyles from '@/styles/onboarding/termsOfServiceStyles';

const TermsOfService = () => {
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
                    termsOfServiceStyles.container,
                    isDark
                        ? termsOfServiceStyles.darkBackground
                        : termsOfServiceStyles.lightBackground,
                ]}
            >
                {/* Header */}
                <View
                    style={[
                        termsOfServiceStyles.header,
                        isDark ? termsOfServiceStyles.headerDark : termsOfServiceStyles.headerLight,
                    ]}
                >
                    <View style={termsOfServiceStyles.headerRow}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={termsOfServiceStyles.backButton}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color={isDark ? '#FFFFFF' : '#111827'}
                            />
                        </TouchableOpacity>
                        <View style={termsOfServiceStyles.headerTextContainer}>
                            <Text
                                style={[
                                    termsOfServiceStyles.headerTitle,
                                    isDark
                                        ? termsOfServiceStyles.headerTitleDark
                                        : termsOfServiceStyles.headerTitleLight,
                                ]}
                            >
                                Terms of Service
                            </Text>
                            <Text
                                style={[
                                    termsOfServiceStyles.headerSubtitle,
                                    isDark
                                        ? termsOfServiceStyles.headerSubtitleDark
                                        : termsOfServiceStyles.headerSubtitleLight,
                                ]}
                            >
                                Last Updated: November 18, 2025
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <ScrollView
                    style={termsOfServiceStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Notice Banner */}
                    <View
                        style={[
                            termsOfServiceStyles.noticeBanner,
                            isDark
                                ? termsOfServiceStyles.noticeBannerDark
                                : termsOfServiceStyles.noticeBannerLight,
                        ]}
                    >
                        <View style={termsOfServiceStyles.noticeBannerRow}>
                            <View
                                style={[
                                    termsOfServiceStyles.noticeIconContainer,
                                    isDark
                                        ? termsOfServiceStyles.noticeIconContainerDark
                                        : termsOfServiceStyles.noticeIconContainerLight,
                                ]}
                            >
                                <Ionicons name="alert-circle" size={24} color="#3b82f6" />
                            </View>
                            <View style={termsOfServiceStyles.noticeTextContainer}>
                                <Text
                                    style={[
                                        termsOfServiceStyles.noticeTitle,
                                        isDark
                                            ? termsOfServiceStyles.noticeTitleDark
                                            : termsOfServiceStyles.noticeTitleLight,
                                    ]}
                                >
                                    Important Notice
                                </Text>
                                <Text
                                    style={[
                                        termsOfServiceStyles.noticeText,
                                        isDark
                                            ? termsOfServiceStyles.noticeTextDark
                                            : termsOfServiceStyles.noticeTextLight,
                                    ]}
                                >
                                    MERN FitVerse is currently in active development. By using this platform,
                                    you acknowledge that features may change and the service is provided &quot;as is&quot;
                                    for educational and demonstration purposes.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Section 1: Acceptance of Terms */}
                    <View style={termsOfServiceStyles.section}>
                        <View style={termsOfServiceStyles.sectionHeader}>
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={24}
                                color="#10b981"
                                style={termsOfServiceStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    termsOfServiceStyles.sectionTitle,
                                    isDark
                                        ? termsOfServiceStyles.sectionTitleDark
                                        : termsOfServiceStyles.sectionTitleLight,
                                ]}
                            >
                                1. Acceptance of Terms
                            </Text>
                        </View>

                        <Text
                            style={[
                                termsOfServiceStyles.bodyText,
                                isDark
                                    ? termsOfServiceStyles.bodyTextDark
                                    : termsOfServiceStyles.bodyTextLight,
                            ]}
                        >
                            By accessing and using MERN FitVerse ("the Platform"), you accept and agree to be
                            bound by these Terms of Service. If you do not agree to these terms, please do not
                            use the Platform.{'\n\n'}
                            This Platform is a demonstration project built with the MERN stack (MongoDB,
                            Express, React, Node.js) for educational purposes and portfolio showcase.
                        </Text>
                    </View>

                    {/* Section 2: User Accounts */}
                    <View style={termsOfServiceStyles.section}>
                        <View style={termsOfServiceStyles.sectionHeader}>
                            <Ionicons
                                name="person-circle-outline"
                                size={24}
                                color="#3b82f6"
                                style={termsOfServiceStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    termsOfServiceStyles.sectionTitle,
                                    isDark
                                        ? termsOfServiceStyles.sectionTitleDark
                                        : termsOfServiceStyles.sectionTitleLight,
                                ]}
                            >
                                2. User Accounts
                            </Text>
                        </View>

                        <Text
                            style={[
                                termsOfServiceStyles.bodyText,
                                isDark
                                    ? termsOfServiceStyles.bodyTextDark
                                    : termsOfServiceStyles.bodyTextLight,
                            ]}
                        >
                            To access certain features of the Platform, you must create an account. You agree
                            to:{'\n\n'}
                            ✓ Provide accurate and complete registration information{'\n'}
                            ✓ Maintain the security of your password and account{'\n'}
                            ✓ Accept responsibility for all activities under your account{'\n'}
                            ✓ Notify us immediately of any unauthorized access
                        </Text>
                    </View>

                    {/* Section 3: User Content and Conduct */}
                    <View style={termsOfServiceStyles.section}>
                        <View style={termsOfServiceStyles.sectionHeader}>
                            <Ionicons
                                name="document-text-outline"
                                size={24}
                                color="#8b5cf6"
                                style={termsOfServiceStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    termsOfServiceStyles.sectionTitle,
                                    isDark
                                        ? termsOfServiceStyles.sectionTitleDark
                                        : termsOfServiceStyles.sectionTitleLight,
                                ]}
                            >
                                3. User Content and Conduct
                            </Text>
                        </View>

                        <Text
                            style={[
                                termsOfServiceStyles.bodyText,
                                isDark
                                    ? termsOfServiceStyles.bodyTextDark
                                    : termsOfServiceStyles.bodyTextLight,
                            ]}
                        >
                            You retain ownership of content you post on the Platform. By posting content, you
                            grant us a non-exclusive license to use, display, and distribute your content
                            within the Platform.
                        </Text>

                        <Text
                            style={[
                                termsOfServiceStyles.subsectionTitle,
                                isDark
                                    ? termsOfServiceStyles.subsectionTitleDark
                                    : termsOfServiceStyles.subsectionTitleLight,
                            ]}
                        >
                            You agree NOT to:
                        </Text>
                        <Text
                            style={[
                                termsOfServiceStyles.bodyText,
                                isDark
                                    ? termsOfServiceStyles.bodyTextDark
                                    : termsOfServiceStyles.bodyTextLight,
                            ]}
                        >
                            • Post harmful, offensive, or inappropriate content{'\n'}
                            • Impersonate others or misrepresent your identity{'\n'}
                            • Engage in spam or unauthorized advertising{'\n'}
                            • Violate any applicable laws or regulations{'\n'}
                            • Attempt to compromise the Platform's security{'\n'}
                            • Harvest or collect user data without permission
                        </Text>
                    </View>

                    {/* Section 4: Fitness and Health Disclaimer */}
                    <View style={termsOfServiceStyles.section}>
                        <View style={termsOfServiceStyles.sectionHeader}>
                            <Ionicons
                                name="fitness-outline"
                                size={24}
                                color="#f59e0b"
                                style={termsOfServiceStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    termsOfServiceStyles.sectionTitle,
                                    isDark
                                        ? termsOfServiceStyles.sectionTitleDark
                                        : termsOfServiceStyles.sectionTitleLight,
                                ]}
                            >
                                4. Fitness and Health Disclaimer
                            </Text>
                        </View>

                        <View
                            style={[
                                termsOfServiceStyles.warningBox,
                                isDark
                                    ? termsOfServiceStyles.warningBoxDark
                                    : termsOfServiceStyles.warningBoxLight,
                            ]}
                        >
                            <Ionicons name="warning" size={20} color="#f59e0b" />
                            <Text
                                style={[
                                    termsOfServiceStyles.warningText,
                                    isDark
                                        ? termsOfServiceStyles.warningTextDark
                                        : termsOfServiceStyles.warningTextLight,
                                ]}
                            >
                                Important Health Notice
                            </Text>
                        </View>

                        <Text
                            style={[
                                termsOfServiceStyles.bodyText,
                                isDark
                                    ? termsOfServiceStyles.bodyTextDark
                                    : termsOfServiceStyles.bodyTextLight,
                            ]}
                        >
                            The Platform provides fitness tracking and nutritional information for educational
                            purposes only. This information is NOT medical advice and should not replace
                            professional medical consultation.{'\n\n'}
                            Before starting any fitness program or making dietary changes, consult with
                            qualified healthcare professionals. We are not responsible for any health issues
                            that may arise from using the Platform.
                        </Text>
                    </View>

                    {/* Section 5: Third-Party Services */}
                    <View style={termsOfServiceStyles.section}>
                        <View style={termsOfServiceStyles.sectionHeader}>
                            <Ionicons
                                name="link-outline"
                                size={24}
                                color="#6366f1"
                                style={termsOfServiceStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    termsOfServiceStyles.sectionTitle,
                                    isDark
                                        ? termsOfServiceStyles.sectionTitleDark
                                        : termsOfServiceStyles.sectionTitleLight,
                                ]}
                            >
                                5. Third-Party Services
                            </Text>
                        </View>

                        <Text
                            style={[
                                termsOfServiceStyles.bodyText,
                                isDark
                                    ? termsOfServiceStyles.bodyTextDark
                                    : termsOfServiceStyles.bodyTextLight,
                            ]}
                        >
                            The Platform integrates with third-party services including:{'\n\n'}
                            • FatSecret API for nutritional data{'\n'}
                            • Cloudinary for image storage and management{'\n\n'}
                            Your use of these services is subject to their respective terms and conditions. We
                            are not responsible for third-party service availability or accuracy.
                        </Text>
                    </View>

                    {/* Section 6: Intellectual Property */}
                    <View style={termsOfServiceStyles.section}>
                        <View style={termsOfServiceStyles.sectionHeader}>
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={24}
                                color="#ec4899"
                                style={termsOfServiceStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    termsOfServiceStyles.sectionTitle,
                                    isDark
                                        ? termsOfServiceStyles.sectionTitleDark
                                        : termsOfServiceStyles.sectionTitleLight,
                                ]}
                            >
                                6. Intellectual Property
                            </Text>
                        </View>

                        <Text
                            style={[
                                termsOfServiceStyles.bodyText,
                                isDark
                                    ? termsOfServiceStyles.bodyTextDark
                                    : termsOfServiceStyles.bodyTextLight,
                            ]}
                        >
                            This Platform is an open-source project licensed under the ISC License. The source
                            code is available on GitHub.{'\n\n'}
                            All original content, features, and functionality are owned by the project
                            maintainers. Third-party libraries and services are subject to their respective
                            licenses.
                        </Text>

                        <TouchableOpacity
                            onPress={() => openLink('https://github.com/xjohnfit/mern-fit-verse')}
                        >
                            <Text style={termsOfServiceStyles.linkText}>View on GitHub →</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Section 7: Limitation of Liability */}
                    <View style={termsOfServiceStyles.section}>
                        <View style={termsOfServiceStyles.sectionHeader}>
                            <Ionicons
                                name="alert-circle-outline"
                                size={24}
                                color="#ef4444"
                                style={termsOfServiceStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    termsOfServiceStyles.sectionTitle,
                                    isDark
                                        ? termsOfServiceStyles.sectionTitleDark
                                        : termsOfServiceStyles.sectionTitleLight,
                                ]}
                            >
                                7. Limitation of Liability
                            </Text>
                        </View>

                        <View
                            style={[
                                termsOfServiceStyles.warningBox,
                                isDark
                                    ? termsOfServiceStyles.warningBoxDark
                                    : termsOfServiceStyles.warningBoxLight,
                            ]}
                        >
                            <Text
                                style={[
                                    termsOfServiceStyles.warningTextBold,
                                    isDark
                                        ? termsOfServiceStyles.warningTextDark
                                        : termsOfServiceStyles.warningTextLight,
                                ]}
                            >
                                THE PLATFORM IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND.
                            </Text>
                        </View>

                        <Text
                            style={[
                                termsOfServiceStyles.bodyText,
                                isDark
                                    ? termsOfServiceStyles.bodyTextDark
                                    : termsOfServiceStyles.bodyTextLight,
                            ]}
                        >
                            To the maximum extent permitted by law, we shall not be liable for any indirect,
                            incidental, special, consequential, or punitive damages resulting from your use or
                            inability to use the Platform.{'\n\n'}
                            This includes, but is not limited to, data loss, service interruptions, or any
                            health-related issues arising from platform usage.
                        </Text>
                    </View>

                    {/* Section 8: Service Modifications */}
                    <View style={termsOfServiceStyles.section}>
                        <View style={termsOfServiceStyles.sectionHeader}>
                            <Ionicons
                                name="construct-outline"
                                size={24}
                                color="#14b8a6"
                                style={termsOfServiceStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    termsOfServiceStyles.sectionTitle,
                                    isDark
                                        ? termsOfServiceStyles.sectionTitleDark
                                        : termsOfServiceStyles.sectionTitleLight,
                                ]}
                            >
                                8. Service Modifications and Termination
                            </Text>
                        </View>

                        <Text
                            style={[
                                termsOfServiceStyles.bodyText,
                                isDark
                                    ? termsOfServiceStyles.bodyTextDark
                                    : termsOfServiceStyles.bodyTextLight,
                            ]}
                        >
                            We reserve the right to:{'\n\n'}
                            • Modify or discontinue the Platform at any time{'\n'}
                            • Suspend or terminate accounts that violate these terms{'\n'}
                            • Update features and functionality without notice{'\n'}
                            • Change these Terms of Service with reasonable notice
                        </Text>
                    </View>

                    {/* Section 9: Data and Privacy */}
                    <View style={termsOfServiceStyles.section}>
                        <View style={termsOfServiceStyles.sectionHeader}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={24}
                                color="#8b5cf6"
                                style={termsOfServiceStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    termsOfServiceStyles.sectionTitle,
                                    isDark
                                        ? termsOfServiceStyles.sectionTitleDark
                                        : termsOfServiceStyles.sectionTitleLight,
                                ]}
                            >
                                9. Data and Privacy
                            </Text>
                        </View>

                        <Text
                            style={[
                                termsOfServiceStyles.bodyText,
                                isDark
                                    ? termsOfServiceStyles.bodyTextDark
                                    : termsOfServiceStyles.bodyTextLight,
                            ]}
                        >
                            Your use of the Platform is also governed by our Privacy Policy, which describes
                            how we collect, use, and protect your information.
                        </Text>

                        <TouchableOpacity onPress={() => router.push('/settings/privacyPolicy')}>
                            <Text style={termsOfServiceStyles.linkText}>View Privacy Policy →</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Section 10: Contact Information */}
                    <View style={[termsOfServiceStyles.section, { marginBottom: 32 }]}>
                        <View style={termsOfServiceStyles.sectionHeader}>
                            <Ionicons
                                name="mail-outline"
                                size={24}
                                color="#3b82f6"
                                style={termsOfServiceStyles.sectionIcon}
                            />
                            <Text
                                style={[
                                    termsOfServiceStyles.sectionTitle,
                                    isDark
                                        ? termsOfServiceStyles.sectionTitleDark
                                        : termsOfServiceStyles.sectionTitleLight,
                                ]}
                            >
                                10. Contact Information
                            </Text>
                        </View>

                        <Text
                            style={[
                                termsOfServiceStyles.bodyText,
                                isDark
                                    ? termsOfServiceStyles.bodyTextDark
                                    : termsOfServiceStyles.bodyTextLight,
                            ]}
                        >
                            For questions about these Terms of Service, please contact us through:
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                openLink('https://github.com/xjohnfit/mern-fit-verse/issues')
                            }
                            style={termsOfServiceStyles.contactButton}
                        >
                            <Ionicons
                                name="logo-github"
                                size={20}
                                color={isDark ? '#fff' : '#111827'}
                            />
                            <Text
                                style={[
                                    termsOfServiceStyles.contactButtonText,
                                    isDark
                                        ? termsOfServiceStyles.contactButtonTextDark
                                        : termsOfServiceStyles.contactButtonTextLight,
                                ]}
                            >
                                Report an Issue
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => openLink('https://github.com/xjohnfit/mern-fit-verse')}
                            style={termsOfServiceStyles.contactButton}
                        >
                            <Ionicons
                                name="logo-github"
                                size={20}
                                color={isDark ? '#fff' : '#111827'}
                            />
                            <Text
                                style={[
                                    termsOfServiceStyles.contactButtonText,
                                    isDark
                                        ? termsOfServiceStyles.contactButtonTextDark
                                        : termsOfServiceStyles.contactButtonTextLight,
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

export default TermsOfService;

