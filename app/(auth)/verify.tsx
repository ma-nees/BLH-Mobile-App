import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Button } from '../../src/components/ui/Button';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

const TOP_PADDING =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + spacing.md : 56;

function PulseRing({ delay }: { delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 2400, easing: Easing.out(Easing.quad) }),
        -1,
        false
      )
    );
  }, [delay, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.35 * (1 - progress.value),
    transform: [{ scale: 1 + progress.value * 0.9 }],
  }));

  return <Animated.View style={[styles.ring, style]} />;
}

export default function Verify() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Decorative Circles */}
      <View style={styles.bottomCircle1} />
      <View style={styles.bottomCircle2} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { paddingTop: TOP_PADDING }]}>
          <View style={styles.circleLarge} />
          <View style={styles.circleSmall} />
          
          <Animated.Text entering={FadeInUp.delay(300)} style={styles.brand}>
            Almost There
          </Animated.Text>
          <Animated.Text entering={FadeInUp.delay(400)} style={styles.tagline}>
            Just one last step to get started
          </Animated.Text>
        </View>

        {/* Pulsing badge */}
        <View style={styles.badgeWrap}>
          <PulseRing delay={0} />
          <PulseRing delay={800} />
          <PulseRing delay={1600} />
          <Animated.View entering={FadeIn.delay(200)} style={styles.badge}>
            <Ionicons name="mail-unread-outline" size={44} color={colors.primary} />
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.springify()} style={styles.body}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We've sent a verification link to your email address. Please verify your account to continue.
          </Text>

          <View style={styles.panel}>
            <Button title="Continue to Login" onPress={() => router.replace('/(auth)/login')} />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  hero: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingBottom: 110,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  circleLarge: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -80,
    right: -70,
  },
  circleSmall: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -30,
    left: -40,
  },
  bottomCircle1: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.primary,
    opacity: 0.15,
    bottom: -60,
    left: -80,
  },
  bottomCircle2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.secondary,
    opacity: 0.2,
    bottom: 40,
    right: -50,
  },
  brand: {
    ...typography.h2,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  tagline: {
    ...typography.body,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  // Badge
  badgeWrap: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -100,
    marginBottom: spacing.sm,
  },
  ring: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
  },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 10,
  },

  // Content
  body: {
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 22,
  },
  panel: {
    alignSelf: 'stretch',
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 5,
    marginHorizontal: spacing.lg,
  },
});
