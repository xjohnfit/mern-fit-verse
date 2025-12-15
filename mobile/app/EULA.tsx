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
import EULAStyles from '@/styles/onboarding/EULAStyles';

const EULA = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = EULAStyles;

    const openEmail = () => {
        Linking.openURL('mailto:contact@codewithxjohn.com');
    };

    return (
        <SafeScreen>
            <View
                style={[
                    styles.container,
                    isDark ? styles.darkBackground : styles.lightBackground,
                ]}
            >
                {/* Header */}
                <View
                    style={[
                        styles.header,
                        isDark ? styles.headerDark : styles.headerLight,
                    ]}
                >
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={[
                                styles.backButton,
                                isDark ? styles.backButtonDark : styles.backButtonLight,
                            ]}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={22}
                                color={isDark ? '#FFFFFF' : '#1A1A1A'}
                            />
                        </TouchableOpacity>
                        <View style={styles.headerTextContainer}>
                            <Text
                                style={[
                                    styles.headerTitle,
                                    isDark ? styles.headerTitleDark : styles.headerTitleLight,
                                ]}
                            >
                                End User License Agreement
                            </Text>
                            <Text
                                style={[
                                    styles.headerSubtitle,
                                    isDark ? styles.headerSubtitleDark : styles.headerSubtitleLight,
                                ]}
                            >
                                Last Updated: December 15, 2025
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Notice Banner */}
                    <View
                        style={[
                            styles.noticeBanner,
                            isDark ? styles.noticeBannerDark : styles.noticeBannerLight,
                        ]}
                    >
                        <View style={styles.noticeBannerRow}>
                            <View
                                style={[
                                    styles.noticeIconContainer,
                                    isDark
                                        ? styles.noticeIconContainerDark
                                        : styles.noticeIconContainerLight,
                                ]}
                            >
                                <Ionicons
                                    name="shield-checkmark"
                                    size={28}
                                    color={isDark ? '#FFB74D' : '#E65100'}
                                />
                            </View>
                            <View style={styles.noticeTextContainer}>
                                <Text
                                    style={[
                                        styles.noticeTitle,
                                        isDark ? styles.noticeTitleDark : styles.noticeTitleLight,
                                    ]}
                                >
                                    Agreement Notice
                                </Text>
                                <Text
                                    style={[
                                        styles.noticeText,
                                        isDark ? styles.noticeTextDark : styles.noticeTextLight,
                                    ]}
                                >
                                    By downloading, accessing, or using FitVerse, you agree to be bound by
                                    this End User License Agreement. If you do not agree, you may not use the App.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Section 1: User-Generated Content */}
                    <View style={[
                        styles.section,
                        isDark ? styles.sectionDark : styles.sectionLight,
                    ]}>
                        <View style={[
                            styles.sectionHeader,
                            isDark ? styles.sectionHeaderBorderDark : styles.sectionHeaderBorderLight,
                        ]}>
                            <View style={[
                                styles.sectionIconContainer,
                                isDark ? styles.greenIconBgDark : styles.greenIconBg,
                            ]}>
                                <Ionicons
                                    name="create-outline"
                                    size={20}
                                    color="#4CAF50"
                                />
                            </View>
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
                                ]}
                            >
                                1. User-Generated Content
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.bodyText,
                                isDark ? styles.bodyTextDark : styles.bodyTextLight,
                            ]}
                        >
                            FitVerse allows users to create, post, upload, share, or otherwise make available
                            content, including but not limited to text, images, comments, workout logs,
                            nutrition entries, or other materials ("User Content").{'\n\n'}
                            <Text style={[styles.emphasizedText, isDark ? styles.bodyTextDark : styles.bodyTextLight]}>
                                You are solely responsible for any User Content you submit and for your
                                interactions with other users.
                            </Text>
                        </Text>
                    </View>

                    {/* Section 2: Prohibited Content and Conduct */}
                    <View style={[
                        styles.section,
                        isDark ? styles.sectionDark : styles.sectionLight,
                    ]}>
                        <View style={[
                            styles.sectionHeader,
                            isDark ? styles.sectionHeaderBorderDark : styles.sectionHeaderBorderLight,
                        ]}>
                            <View style={[
                                styles.sectionIconContainer,
                                isDark ? styles.redIconBgDark : styles.redIconBg,
                            ]}>
                                <Ionicons
                                    name="close-circle-outline"
                                    size={20}
                                    color="#F44336"
                                />
                            </View>
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
                                ]}
                            >
                                2. Prohibited Content and Conduct (Zero Tolerance Policy)
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.bodyText,
                                isDark ? styles.bodyTextDark : styles.bodyTextLight,
                            ]}
                        >
                            <Text style={[styles.emphasizedText, isDark ? styles.dangerTextDark : styles.dangerText]}>
                                FitVerse has zero tolerance for objectionable or abusive content or behavior.
                            </Text>
                            {'\n\n'}
                            You agree not to create, post, upload, transmit, or share any content that:{'\n\n'}
                            ✗ Is abusive, harassing, threatening, or defamatory{'\n'}
                            ✗ Contains hate speech, discrimination, or violence toward individuals or groups{'\n'}
                            ✗ Is sexually explicit, pornographic, or exploits minors{'\n'}
                            ✗ Promotes illegal activity or self-harm{'\n'}
                            ✗ Is misleading, spam, or impersonates another person or entity{'\n'}
                            ✗ Violates any applicable law or regulation{'\n\n'}
                            <Text style={styles.emphasizedText}>
                                Any violation of this policy may result in immediate removal of content and
                                suspension or permanent termination of your account.
                            </Text>
                        </Text>
                    </View>

                    {/* Section 3: Content Moderation and Enforcement */}
                    <View style={[
                        styles.section,
                        isDark ? styles.sectionDark : styles.sectionLight,
                    ]}>
                        <View style={[
                            styles.sectionHeader,
                            isDark ? styles.sectionHeaderBorderDark : styles.sectionHeaderBorderLight,
                        ]}>
                            <View style={[
                                styles.sectionIconContainer,
                                isDark ? styles.orangeIconBgDark : styles.orangeIconBg,
                            ]}>
                                <Ionicons
                                    name="eye-outline"
                                    size={20}
                                    color="#FF9800"
                                />
                            </View>
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
                                ]}
                            >
                                3. Content Moderation and Enforcement
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.bodyText,
                                isDark ? styles.bodyTextDark : styles.bodyTextLight,
                            ]}
                        >
                            We reserve the right, but are not obligated, to:{'\n\n'}
                            ✓ Review, monitor, and moderate User Content{'\n'}
                            ✓ Remove any content that violates this Agreement or is deemed objectionable{'\n'}
                            ✓ Suspend or permanently ban users who engage in abusive behavior{'\n\n'}
                            <Text style={styles.emphasizedText}>
                                We commit to acting on valid reports of objectionable content within 24 hours,
                                including removing offending content and ejecting users who violate this Agreement.
                            </Text>
                        </Text>
                    </View>

                    {/* Section 4: Reporting Objectionable Content */}
                    <View style={[
                        styles.section,
                        isDark ? styles.sectionDark : styles.sectionLight,
                    ]}>
                        <View style={[
                            styles.sectionHeader,
                            isDark ? styles.sectionHeaderBorderDark : styles.sectionHeaderBorderLight,
                        ]}>
                            <View style={[
                                styles.sectionIconContainer,
                                isDark ? styles.purpleIconBgDark : styles.purpleIconBg,
                            ]}>
                                <Ionicons
                                    name="flag-outline"
                                    size={20}
                                    color="#9C27B0"
                                />
                            </View>
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
                                ]}
                            >
                                4. Reporting Objectionable Content
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.bodyText,
                                isDark ? styles.bodyTextDark : styles.bodyTextLight,
                            ]}
                        >
                            FitVerse provides a mechanism for users to flag or report objectionable content
                            or abusive behavior.{'\n\n'}
                            By submitting a report, you acknowledge that:{'\n\n'}
                            ✓ Reports will be reviewed promptly{'\n'}
                            ✓ Appropriate action will be taken if a violation is confirmed{'\n'}
                            ✓ Abuse of the reporting system may itself result in account action
                        </Text>
                    </View>

                    {/* Section 5: Blocking Users */}
                    <View style={[
                        styles.section,
                        isDark ? styles.sectionDark : styles.sectionLight,
                    ]}>
                        <View style={[
                            styles.sectionHeader,
                            isDark ? styles.sectionHeaderBorderDark : styles.sectionHeaderBorderLight,
                        ]}>
                            <View style={[
                                styles.sectionIconContainer,
                                isDark ? styles.pinkIconBgDark : styles.pinkIconBg,
                            ]}>
                                <Ionicons
                                    name="ban-outline"
                                    size={20}
                                    color="#E91E63"
                                />
                            </View>
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
                                ]}
                            >
                                5. Blocking Users
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.bodyText,
                                isDark ? styles.bodyTextDark : styles.bodyTextLight,
                            ]}
                        >
                            FitVerse provides a mechanism for users to block other users. Blocking prevents
                            further interaction or communication with the blocked user within the App.
                        </Text>
                    </View>

                    {/* Section 6: Filtering of Content */}
                    <View style={[
                        styles.section,
                        isDark ? styles.sectionDark : styles.sectionLight,
                    ]}>
                        <View style={[
                            styles.sectionHeader,
                            isDark ? styles.sectionHeaderBorderDark : styles.sectionHeaderBorderLight,
                        ]}>
                            <View style={[
                                styles.sectionIconContainer,
                                isDark ? styles.cyanIconBgDark : styles.cyanIconBg,
                            ]}>
                                <Ionicons
                                    name="funnel-outline"
                                    size={20}
                                    color="#00BCD4"
                                />
                            </View>
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
                                ]}
                            >
                                6. Filtering of Content
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.bodyText,
                                isDark ? styles.bodyTextDark : styles.bodyTextLight,
                            ]}
                        >
                            FitVerse includes measures to filter or limit objectionable content, which may
                            include automated systems, manual review, or user controls.{'\n\n'}
                            While no system is perfect, we actively work to reduce exposure to harmful content.
                        </Text>
                    </View>

                    {/* Section 7: Termination */}
                    <View style={[
                        styles.section,
                        isDark ? styles.sectionDark : styles.sectionLight,
                    ]}>
                        <View style={[
                            styles.sectionHeader,
                            isDark ? styles.sectionHeaderBorderDark : styles.sectionHeaderBorderLight,
                        ]}>
                            <View style={[
                                styles.sectionIconContainer,
                                isDark ? styles.redIconBgDark : styles.redIconBg,
                            ]}>
                                <Ionicons
                                    name="power-outline"
                                    size={20}
                                    color="#DC2626"
                                />
                            </View>
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
                                ]}
                            >
                                7. Termination
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.bodyText,
                                isDark ? styles.bodyTextDark : styles.bodyTextLight,
                            ]}
                        >
                            We may suspend or terminate your access to FitVerse at any time, without notice,
                            if you violate this Agreement or engage in behavior that is harmful to other
                            users or the platform.
                        </Text>
                    </View>

                    {/* Section 8: Disclaimer */}
                    <View style={[
                        styles.section,
                        isDark ? styles.sectionDark : styles.sectionLight,
                    ]}>
                        <View style={[
                            styles.sectionHeader,
                            isDark ? styles.sectionHeaderBorderDark : styles.sectionHeaderBorderLight,
                        ]}>
                            <View style={[
                                styles.sectionIconContainer,
                                isDark ? styles.blueIconBgDark : styles.blueIconBg,
                            ]}>
                                <Ionicons
                                    name="information-circle-outline"
                                    size={20}
                                    color="#2196F3"
                                />
                            </View>
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
                                ]}
                            >
                                8. Disclaimer
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.bodyText,
                                isDark ? styles.bodyTextDark : styles.bodyTextLight,
                            ]}
                        >
                            We are not responsible for User Content posted by users. However, we take reports
                            seriously and enforce this Agreement to maintain a safe environment.
                        </Text>
                    </View>

                    {/* Section 9: Changes to This Agreement */}
                    <View style={[
                        styles.section,
                        isDark ? styles.sectionDark : styles.sectionLight,
                    ]}>
                        <View style={[
                            styles.sectionHeader,
                            isDark ? styles.sectionHeaderBorderDark : styles.sectionHeaderBorderLight,
                        ]}>
                            <View style={[
                                styles.sectionIconContainer,
                                isDark ? styles.tealIconBgDark : styles.tealIconBg,
                            ]}>
                                <Ionicons
                                    name="refresh-outline"
                                    size={20}
                                    color="#009688"
                                />
                            </View>
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
                                ]}
                            >
                                9. Changes to This Agreement
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.bodyText,
                                isDark ? styles.bodyTextDark : styles.bodyTextLight,
                            ]}
                        >
                            We may update this Agreement from time to time. Continued use of FitVerse
                            constitutes acceptance of any changes.
                        </Text>
                    </View>

                    {/* Section 10: Contact Information */}
                    <View style={[
                        styles.section,
                        isDark ? styles.sectionDark : styles.sectionLight,
                    ]}>
                        <View style={[
                            styles.sectionHeader,
                            isDark ? styles.sectionHeaderBorderDark : styles.sectionHeaderBorderLight,
                        ]}>
                            <View style={[
                                styles.sectionIconContainer,
                                isDark ? styles.blueIconBgDark : styles.blueIconBg,
                            ]}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color="#2196F3"
                                />
                            </View>
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    isDark ? styles.sectionTitleDark : styles.sectionTitleLight,
                                ]}
                            >
                                10. Contact Information
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.bodyText,
                                isDark ? styles.bodyTextDark : styles.bodyTextLight,
                            ]}
                        >
                            If you have questions or concerns about this Agreement or wish to report
                            objectionable content, contact us at:{'\n\n'}
                            <Text
                                style={[styles.linkText, isDark ? styles.linkTextDark : styles.linkText]}
                                onPress={openEmail}
                            >
                                contact@codewithxjohn.com
                            </Text>
                        </Text>
                    </View>

                    {/* Footer */}
                    <View
                        style={[
                            styles.footer,
                            isDark ? styles.footerDark : styles.footerLight,
                        ]}
                    >
                        <Text style={styles.footerEmoji}>🛡️</Text>
                        <Text
                            style={[
                                styles.footerText,
                                isDark ? styles.footerTextDark : styles.footerTextLight,
                            ]}
                        >
                            © 2025 FitVerse. All rights reserved.
                        </Text>
                        <Text
                            style={[
                                styles.footerText,
                                isDark ? styles.footerTextDark : styles.footerTextLight,
                            ]}
                        >
                            This Agreement is effective as of December 15, 2025
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </SafeScreen>
    );
};

export default EULA;
