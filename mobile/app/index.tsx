import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useAppSelector } from "../hooks/useRedux";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FeatureCard from "@/components/onboarding/FeatureCard";
import LandingStyles from "@/styles/onboarding/landingStyles";

export default function LandingPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = LandingStyles();

  // Redirect authenticated users to home
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return (
    <LinearGradient
      colors={["#0f172a", "#1e3a8a", "#3b82f6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={{ height: insets.top }} />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 20 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/fit-verse-logo-no-bg.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>
            FitVerse
          </Text>
          <Text style={styles.subtitle}>
            Your Complete Fitness Universe
          </Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroText}>
            Transform your fitness journey with personalized workouts, nutrition
            tracking, and a supportive community.
          </Text>

          {/* Features Grid */}
          <View style={styles.featuresContainer}>
            <FeatureCard
              icon="barbell"
              title="Custom Workouts"
              description="Create and track personalized workout routines"
            />
            <FeatureCard
              icon="nutrition"
              title="Nutrition Tracking"
              description="Monitor your daily meals and calories"
            />
            <FeatureCard
              icon="people"
              title="Community"
              description="Connect with fitness enthusiasts worldwide"
            />
            <FeatureCard
              icon="stats-chart"
              title="Progress Analytics"
              description="Visualize your fitness journey with detailed stats"
            />
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            onPress={() => router.push("/register")}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.secondaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>
              Sign In
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Join thousands of users achieving their fitness goals
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}