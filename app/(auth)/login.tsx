// import React, { useState } from 'react';
// import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Image } from 'react-native';
// import { useRouter } from 'expo-router';
// import { colors, spacing, typography, radius } from '../../src/theme';
// import { Button } from '../../src/components/ui/Button';
// import { Input } from '../../src/components/ui/Input';
// import { supabase } from '../../src/lib/supabase';
// import { useAuthStore } from '../../src/store/authStore';
// import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// export default function Login() {
//   const router = useRouter();
//   const setUser = useAuthStore((state) => state.setUser);

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please enter both email and password.');
//       return;
//     }

//     setLoading(true);
//     if (useAuthStore.getState().isDummy) {
//       setTimeout(() => {
//         setUser({ id: 'dummy-123', email, role: 'customer' });
//         router.replace('/(customer)/home');
//         setLoading(false);
//       }, 1000);
//       return;
//     }

//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       Alert.alert('Login Failed', error.message);
//     } else {
//       setUser(data.user);
//       router.replace('/(customer)/home');
//     }
//     setLoading(false);
//   };

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

//         <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.card}>
//           <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.logoContainer}>
//             <Image 
//               source={require('../../assets/branding/logo.png')} 
//               style={styles.logo} 
//               resizeMode="contain"
//             />
//           </Animated.View>

//           <View style={styles.header}>
//             <Text style={styles.title}>Welcome Back</Text>
//             <Text style={styles.subtitle}>Sign in to continue to Bhairahawa Light House.</Text>
//           </View>

//           <View style={styles.form}>
//             <Input
//               label="Email Address"
//               placeholder="name@example.com"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               value={email}
//               onChangeText={setEmail}
//             />
//             <Input
//               label="Password"
//               placeholder="Enter your password"
//               isPassword
//               value={password}
//               onChangeText={setPassword}
//             />

//             <View style={styles.forgotPasswordContainer}>
//               <Text 
//                 style={styles.forgotPasswordText} 
//                 onPress={() => router.push('/(auth)/forgot-password')}
//               >
//                 Forgot Password?
//               </Text>
//             </View>

//             <Button 
//               title="Sign In" 
//               onPress={handleLogin} 
//               loading={loading} 
//               style={styles.mainButton}
//             />

//             <View style={styles.divider}>
//               <View style={styles.dividerLine} />
//               <Text style={styles.dividerText}>OR</Text>
//               <View style={styles.dividerLine} />
//             </View>

//             <Button 
//               title="Sign in with Google" 
//               variant="outline"
//               onPress={() => Alert.alert('Info', 'Google Sign-In will be implemented shortly.')} 
//             />
//           </View>

//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Don't have an account? </Text>
//             <Text 
//               style={styles.link} 
//               onPress={() => router.push('/(auth)/register')}
//             >
//               Sign Up
//             </Text>
//           </View>
//         </Animated.View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F3F4F6', // Slightly darker background for contrast
//   },
//   scroll: {
//     flexGrow: 1,
//     padding: spacing.lg,
//     justifyContent: 'center',
//     paddingVertical: spacing.xxl,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: spacing.md,
//   },
//   logo: {
//     width: 120,
//     height: 80,
//   },
//   card: {
//     backgroundColor: colors.surface,
//     borderRadius: radius.xl,
//     padding: spacing.xl,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.05,
//     shadowRadius: 20,
//     elevation: 5,
//     marginBottom: spacing.xl,
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
//     marginBottom: spacing.lg,
//   },
//   forgotPasswordContainer: {
//     alignItems: 'flex-end',
//     marginBottom: spacing.lg,
//     marginTop: -spacing.xs,
//   },
//   forgotPasswordText: {
//     ...typography.caption,
//     color: colors.textSecondary,
//     fontWeight: '500',
//   },
//   mainButton: {
//     marginTop: spacing.xs,
//   },
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: spacing.xl,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: colors.border,
//   },
//   dividerText: {
//     ...typography.caption,
//     color: colors.textSecondary,
//     paddingHorizontal: spacing.md,
//     fontWeight: '600',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: spacing.md,
//   },
//   footerText: {
//     ...typography.body,
//     color: colors.textSecondary,
//   },
//   link: {
//     ...typography.body,
//     color: colors.secondary,
//     fontWeight: '700',
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  Pressable,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/store/authStore';
import Animated, { FadeInDown, FadeInUp, FadeIn, useSharedValue, withTiming, withSequence } from 'react-native-reanimated';
import { InteractiveLamp } from '../../src/components/auth/InteractiveLamp';

const TOP_PADDING =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + spacing.lg : 64;

export default function Login() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    if (useAuthStore.getState().isDummy) {
      setTimeout(() => {
        const testEmail = email.toLowerCase();
        if (testEmail === 'admin@blh.com') {
           setUser({ id: 'dummy-admin', email, role: 'admin' });
           router.replace('/(admin)/dashboard');
        } else if (testEmail === 'store@blh.com') {
           setUser({ id: 'dummy-store', email, role: 'store' });
           router.replace('/(store)/dashboard');
        } else if (testEmail === 'pending@blh.com') {
           setUser({ id: 'dummy-pending', email, role: 'store' });
           router.replace('/(store)/pending');
        } else if (testEmail === 'rejected@blh.com') {
           setUser({ id: 'dummy-rejected', email, role: 'store' });
           router.replace('/(store)/rejected');
        } else {
           setUser({ id: 'dummy-customer', email, role: 'customer' });
           router.replace('/(customer)/home');
        }
        setLoading(false);
      }, 1000);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Login Failed', error.message);
      flicker();
    } else {
      setUser(data.user);
      router.replace('/(customer)/home');
    }
    setLoading(false);
  };

  const glow = useSharedValue(0);
  const target = (email.trim() ? 0.5 : 0) + (password ? 0.5 : 0);

  useEffect(() => {
    glow.value = withTiming(target, { duration: 500 });
  }, [target, glow]);

  const flicker = () => {
    glow.value = withSequence(
      withTiming(0.1, { duration: 70 }),
      withTiming(1, { duration: 70 }),
      withTiming(0.05, { duration: 110 }),
      withTiming(0.8, { duration: 90 }),
      withTiming(0.1, { duration: 150 }),
      withTiming(target, { duration: 400 })
    );
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
        <View style={[styles.hero, { paddingTop: TOP_PADDING + 20 }]}>
          <InteractiveLamp glow={glow} />
          
          <View style={styles.circleLarge} />
          <View style={styles.circleSmall} />

          <Animated.Text entering={FadeIn.delay(300)} style={styles.brand}>
            Bhairahawa Light House
          </Animated.Text>
          <Animated.Text entering={FadeIn.delay(400)} style={styles.tagline}>
            Everything electrical, one tap away
          </Animated.Text>
        </View>

        {/* Card */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.card}>
          <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.logoBadge}>
            <Image
              source={require('../../assets/branding/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue shopping</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email Address"
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              isPassword
              value={password}
              onChangeText={setPassword}
            />

            <Pressable
              style={styles.forgotPasswordContainer}
              hitSlop={8}
              onPress={() => router.push('/(auth)/forgot-password')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>

            <Button
              title="Sign In"
              onPress={() => {
                flicker();
                handleLogin();
              }}
              loading={loading}
              style={styles.mainButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title="Sign in with Google"
              variant="outline"
              onPress={() => Alert.alert('Info', 'Google Sign-In will be implemented shortly.')}
            />
          </View>
        </Animated.View>

        {/* Dummy Testing Info */}
        <Animated.View entering={FadeIn.delay(500)} style={styles.dummyInfo}>
          <Text style={styles.dummyInfoTitle}>Testing UI Flows (Dummy Mode):</Text>
          <Text style={styles.dummyInfoText}>Admin: admin@blh.com</Text>
          <Text style={styles.dummyInfoText}>Approved Store: store@blh.com</Text>
          <Text style={styles.dummyInfoText}>Pending Store: pending@blh.com</Text>
          <Text style={styles.dummyInfoText}>Rejected Store: rejected@blh.com</Text>
          <Text style={styles.dummyInfoText}>Customer: (any other email)</Text>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeIn.delay(600)} style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Pressable hitSlop={8} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.link}>Sign Up</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },

  // Hero
  hero: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingBottom: 90,
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
  logoBadge: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 120,
    height: 80,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginTop: -60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {},
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.xs,
  },
  forgotPasswordText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
  },
  mainButton: {
    marginTop: spacing.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    fontWeight: '600',
    letterSpacing: 0.8,
    fontSize: 11,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
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
  dummyInfo: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    alignItems: 'center',
  },
  dummyInfoTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dummyInfoText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  }
});



