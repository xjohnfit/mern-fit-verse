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
import FeatureCard from "@/components/dashboard/FeatureCard";

export default function LandingPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Redirect authenticated users to home
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <LinearGradient
      colors={["#1e3a8a", "#3b82f6", "#60a5fa"]}
      className="flex-1"
    >
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <View style={{ height: insets.top }} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 30 + insets.bottom,
        }}
      >
        {/* Header */}
        <View className="pt-20 px-6">
          <View className="items-center mb-8">
            <View>
              <Image
                source={require("../assets/fit-verse-logo-no-bg.png")}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
            </View>
            <Text className="text-5xl font-bold text-white mb-2">
              FitVerse
            </Text>
            <Text className="text-xl text-blue-100 text-center">
              Your Complete Fitness Universe
            </Text>
          </View>
        </View>

        {/* Hero Section */}
        <View className="px-6 mt-8">
          <Text className="text-white text-lg text-center mb-12 leading-relaxed">
            Transform your fitness journey with personalized workouts, nutrition
            tracking, and a supportive community.
          </Text>

          {/* Features Grid */}
          <View className="space-y-4 mb-12 gap-5">
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
        <View className="px-6 pb-12">
          <TouchableOpacity
            onPress={() => router.push("/register")}
            className="bg-white rounded-full py-4 mb-4 shadow-lg"
            activeOpacity={0.8}
          >
            <Text className="text-blue-600 text-center text-lg font-bold">
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="bg-white/20 rounded-full py-4 border-2 border-white"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Sign In
            </Text>
          </TouchableOpacity>

          <Text className="text-blue-100 text-center mt-6 text-sm">
            Join thousands of users achieving their fitness goals
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}