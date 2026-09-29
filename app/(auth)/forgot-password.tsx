// import React, { useState } from 'react';
// import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Image, StatusBar } from 'react-native';
// import { useRouter } from 'expo-router';
// import { colors, spacing, typography, radius } from '../../src/theme';
// import { Button } from '../../src/components/ui/Button';
// import { Input } from '../../src/components/ui/Input';
// import { supabase } from '../../src/lib/supabase';
// import { useAuthStore } from '../../src/store/authStore';
// import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// export default function ForgotPassword() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleReset = async () => {
//     if (!email) {
//       Alert.alert('Error', 'Please enter your email.');
//       return;
//     }

//     setLoading(true);
//     if (useAuthStore.getState().isDummy) {
//       setTimeout(() => {
//         Alert.alert('Success', 'Dummy reset email sent!');
//         router.back();
//         setLoading(false);
//       }, 1000);
//       return;
//     }

//     const { error } = await supabase.auth.resetPasswordForEmail(email);

//     if (error) {
//       Alert.alert('Failed', error.message);
//     } else {
//       Alert.alert('Success', 'Password reset instructions sent to your email.');
//       router.back();
//     }
//     setLoading(false);
//   };

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <StatusBar barStyle="light-content" />

//       {/* Background Decorative Circles */}
//       <View style={styles.bottomCircle1} />
//       <View style={styles.bottomCircle2} />

//       <ScrollView 
//         contentContainerStyle={styles.scroll} 
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//         bounces={false}
//       >
//         {/* Hero */}
//         <View style={[styles.hero, { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + spacing.md : 56 }]}>
//           <View style={styles.circleLarge} />
//           <View style={styles.circleSmall} />

//           <Animated.Text entering={FadeInUp.delay(300)} style={styles.brand}>
//             Account Recovery
//           </Animated.Text>
//           <Animated.Text entering={FadeInUp.delay(400)} style={styles.tagline}>
//             We'll help you get back in
//           </Animated.Text>
//         </View>

//         {/* Card */}
//         <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.card}>
//           <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.logoContainer}>
//             <Image 
//               source={require('../../assets/branding/logo.png')} 
//               style={styles.logo} 
//               resizeMode="contain"
//             />
//           </Animated.View>

//           <View style={styles.header}>
//             <Text style={styles.title}>Reset Password</Text>
//             <Text style={styles.subtitle}>Enter your email to receive instructions</Text>
//           </View>

//         <View style={styles.form}>
//           <Input
//             label="Email"
//             placeholder="Enter your email"
//             keyboardType="email-address"
//             autoCapitalize="none"
//             value={email}
//             onChangeText={setEmail}
//           />
//           <Button 
//             title="Send Instructions" 
//             onPress={handleReset} 
//             loading={loading} 
//           />
//           <Button 
//             title="Back to Login" 
//             variant="outline"
//             onPress={() => router.back()} 
//           />
//         </View>
//         </Animated.View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F3F4F6',
//   },
//   scroll: {
//     flexGrow: 1,
//     paddingBottom: spacing.xl,
//   },
//   hero: {
//     backgroundColor: colors.primary,
//     alignItems: 'center',
//     paddingBottom: 80,
//     paddingHorizontal: spacing.lg,
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//     overflow: 'hidden',
//   },
//   circleLarge: {
//     position: 'absolute',
//     width: 260,
//     height: 260,
//     borderRadius: 130,
//     backgroundColor: 'rgba(255,255,255,0.08)',
//     top: -80,
//     right: -70,
//   },
//   circleSmall: {
//     position: 'absolute',
//     width: 140,
//     height: 140,
//     borderRadius: 70,
//     backgroundColor: 'rgba(255,255,255,0.06)',
//     bottom: -30,
//     left: -40,
//   },
//   bottomCircle1: {
//     position: 'absolute',
//     width: 240,
//     height: 240,
//     borderRadius: 120,
//     backgroundColor: colors.primary,
//     opacity: 0.15,
//     bottom: -60,
//     left: -80,
//   },
//   bottomCircle2: {
//     position: 'absolute',
//     width: 160,
//     height: 160,
//     borderRadius: 80,
//     backgroundColor: colors.secondary,
//     opacity: 0.2,
//     bottom: 40,
//     right: -50,
//   },
//   brand: {
//     ...typography.h2,
//     color: '#FFFFFF',
//     fontWeight: '800',
//     textAlign: 'center',
//     letterSpacing: 0.3,
//   },
//   tagline: {
//     ...typography.body,
//     color: 'rgba(255,255,255,0.75)',
//     textAlign: 'center',
//     marginTop: spacing.xs,
//   },
//   card: {
//     backgroundColor: colors.surface,
//     borderRadius: radius.xl,
//     padding: spacing.xl,
//     marginHorizontal: spacing.lg,
//     marginTop: -50,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.05,
//     shadowRadius: 20,
//     elevation: 5,
//     marginBottom: spacing.xl,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: spacing.md,
//   },
//   logo: {
//     width: 100,
//     height: 70,
//   },
//   header: {
//     marginBottom: spacing.xl,
//     alignItems: 'center',
//   },
//   title: {
//     ...typography.h2,
//     color: colors.primary,
//     marginBottom: spacing.xs,
//     fontWeight: '700',
//   },
//   subtitle: {
//     ...typography.body,
//     color: colors.textSecondary,
//     textAlign: 'center',
//   },
//   form: {
//     marginBottom: spacing.xl,
//   },
// });


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Pressable,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/store/authStore';
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

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    if (useAuthStore.getState().isDummy) {
      setTimeout(() => {
        setSent(true);
        setLoading(false);
      }, 1000);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(trimmed);

    if (error) {
      Alert.alert('Failed', error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Background Decorative Circles */}
      <View style={styles.bottomCircle1} />
      <View style={styles.bottomCircle2} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { paddingTop: TOP_PADDING }]}>
          <View style={styles.circleLarge} />
          <View style={styles.circleSmall} />
          
          <Pressable style={styles.backPill} hitSlop={8} onPress={() => router.back()}>
            <Text style={styles.backText}>‹  Back</Text>
          </Pressable>

          <Animated.Text entering={FadeInUp.delay(300)} style={styles.brand}>
            Account Recovery
          </Animated.Text>
          <Animated.Text entering={FadeInUp.delay(400)} style={styles.tagline}>
            We'll help you get back in
          </Animated.Text>
        </View>

        {/* Pulsing badge */}
        <View style={styles.badgeWrap}>
          <PulseRing delay={0} />
          <PulseRing delay={800} />
          <PulseRing delay={1600} />
          <View style={styles.badge}>
            <Animated.View key={sent ? 'mail' : 'key'} entering={FadeIn}>
              <Ionicons name={sent ? 'mail-outline' : 'key-outline'} size={44} color={colors.primary} />
            </Animated.View>
          </View>
        </View>

        {!sent ? (
          <Animated.View key="form" entering={FadeInDown.springify()} style={styles.body}>
            <Text style={styles.title}>Forgot your password?</Text>
            <Text style={styles.subtitle}>
              No worries. Enter the email linked to your account and we'll send you a reset link.
            </Text>

            <View style={styles.panel}>
              <Input
                label="Email Address"
                placeholder="name@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <Button title="Send Reset Link" onPress={handleReset} loading={loading} />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Remembered it? </Text>
              <Pressable hitSlop={8} onPress={() => router.back()}>
                <Text style={styles.link}>Sign In</Text>
              </Pressable>
            </View>
          </Animated.View>
        ) : (
          <Animated.View key="sent" entering={FadeInDown.springify()} style={styles.body}>
            <Text style={styles.title}>Check your inbox</Text>
            <Text style={styles.subtitle}>We've sent a password reset link to</Text>
            <View style={styles.emailChip}>
              <Text style={styles.emailChipText}>{email.trim()}</Text>
            </View>

            <View style={styles.panel}>
              <Button title="Back to Login" onPress={() => router.back()} />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Didn't get it? </Text>
              <Pressable hitSlop={8} onPress={handleReset} disabled={loading}>
                <Text style={styles.link}>{loading ? 'Sending...' : 'Resend'}</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  backPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: spacing.lg,
  },
  backText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '700',
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
  badgeEmoji: {
    fontSize: 40,
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
    paddingHorizontal: spacing.md,
  },
  emailChip: {
    marginTop: spacing.sm,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emailChipText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
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
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  link: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: '700',
  },
});