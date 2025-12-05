import { View, Text, Dimensions, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const workout = () => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#f59e0b', '#d97706', '#b45309']}
        style={styles.gradient}
      >
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {/* Animated Icon Container */}
              <View style={styles.iconContainer}>
                {/* Main Icon Circle */}
                <LinearGradient
                  colors={['#ffffff', '#f0f0f0']}
                  style={styles.iconCircle}
                >
                  <Ionicons name="barbell" size={80} color="#f59e0b" />

                  {/* Coming Soon Badge */}
                  <LinearGradient
                    colors={['#ec4899', '#a855f7']}
                    style={styles.badge}
                  >
                    <Text style={styles.badgeText}>SOON</Text>
                  </LinearGradient>
                </LinearGradient>

                {/* Floating Dots */}
                <View style={[styles.dot, { top: -16, left: -16, width: 12, height: 12 }]} />
                <View style={[styles.dot, { bottom: -8, right: -24, width: 16, height: 16, opacity: 0.4 }]} />
                <View style={[styles.dot, { top: '50%', left: -32, width: 8, height: 8, opacity: 0.6 }]} />
              </View>

              {/* Main Title */}
              <Text style={styles.title}>Workouts</Text>
              <Text style={styles.subtitle}>Coming Soon to Mobile</Text>

              {/* Feature Card */}
              <View style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <View style={styles.rocketIcon}>
                    <Ionicons name="rocket" size={24} color="#f59e0b" />
                  </View>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>
                      We're Building Something Great
                    </Text>
                  </View>
                </View>

                <Text style={styles.description}>
                  Workout tracking is being crafted with care for an amazing mobile experience.
                </Text>

                {/* Feature List */}
                <View>
                  <View style={styles.featureItem}>
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark" size={16} color="#10b981" />
                    </View>
                    <Text style={styles.featureText}>Create custom workouts</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark" size={16} color="#10b981" />
                    </View>
                    <Text style={styles.featureText}>Track sets, reps & weights</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark" size={16} color="#10b981" />
                    </View>
                    <Text style={styles.featureText}>Exercise library & templates</Text>
                  </View>
                </View>
              </View>

              {/* CTA Box */}
              <View style={styles.ctaBox}>
                <View style={styles.ctaContent}>
                  <Ionicons name="laptop-outline" size={24} color="white" />
                  <Text style={styles.ctaText}>Available now on web</Text>
                  <Ionicons name="arrow-forward-circle" size={24} color="white" />
                </View>
              </View>

              {/* Bottom Text */}
              <View style={styles.bottomContainer}>
                <View style={styles.pulseDot} />
                <Text style={styles.bottomText}>Stay tuned for updates</Text>
                <View style={styles.pulseDot} />
              </View>
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 48,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dot: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 999,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 32,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    width: '100%',
    maxWidth: width - 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  rocketIcon: {
    backgroundColor: '#fef3c7',
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  description: {
    color: '#4b5563',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIcon: {
    backgroundColor: '#d1fae5',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    color: '#374151',
    flex: 1,
    fontSize: 15,
  },
  ctaBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
  },
  bottomContainer: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 4,
  },
  bottomText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginHorizontal: 8,
    fontWeight: '500',
  },
});

export default workout;