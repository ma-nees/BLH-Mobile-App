// import React, { useState } from 'react';
// import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Image } from 'react-native';
// import { useRouter } from 'expo-router';
// import { colors, spacing, typography, radius } from '../../src/theme';
// import { Button } from '../../src/components/ui/Button';
// import { Input } from '../../src/components/ui/Input';
// import { supabase } from '../../src/lib/supabase';
// import { useAuthStore } from '../../src/store/authStore';
// import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// export default function Register() {
//   const router = useRouter();

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async () => {
//     if (!email || !password || !name || !confirmPassword) {
//       Alert.alert('Error', 'Please fill out all fields.');
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match.');
//       return;
//     }

//     setLoading(true);
//     if (useAuthStore.getState().isDummy) {
//       setTimeout(() => {
//         Alert.alert('Success', 'Dummy account created!');
//         router.replace('/(auth)/login');
//         setLoading(false);
//       }, 1000);
//       return;
//     }

//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: { full_name: name, role: 'customer' }
//       }
//     });

//     if (error) {
//       Alert.alert('Registration Failed', error.message);
//     } else {
//       Alert.alert('Success', 'Check your email to verify your account.');
//       router.replace('/(auth)/login');
//     }
//     setLoading(false);
//   };

//   const handleGoogleSignIn = () => {
//     Alert.alert('Info', 'Google Sign-In will be implemented shortly.');
//   };

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView 
//         contentContainerStyle={styles.scroll} 
//         showsVerticalScrollIndicator={false}
//         scrollEnabled={false}
//       >

//         <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.card}>
//           <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.logoContainer}>
//             <Image 
//               source={require('../../assets/branding/logo.png')} 
//               style={styles.logo} 
//               resizeMode="contain"
//             />
//           </Animated.View>

//           <View style={styles.header}>
//             <Text style={styles.title}>Create Account</Text>
//             <Text style={styles.subtitle}>Join us and get started today.</Text>
//           </View>

//           <View style={styles.form}>
//             <Input
//               label="Full Name"
//               placeholder="John Doe"
//               value={name}
//               onChangeText={setName}
//             />
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
//               placeholder="Create a strong password"
//               isPassword
//               value={password}
//               onChangeText={setPassword}
//             />
//             <Input
//               label="Confirm Password"
//               placeholder="Repeat your password"
//               isPassword
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//             />

//             <Text style={styles.termsText}>
//               By registering, you agree to our <Text style={styles.termsLink} onPress={() => router.push('/terms')}>Terms of Service</Text> and <Text style={styles.termsLink} onPress={() => router.push('/privacy')}>Privacy Policy</Text>.
//             </Text>

//             <Button 
//               title="Create Account" 
//               onPress={handleRegister} 
//               loading={loading} 
//             />

//             <View style={styles.divider}>
//               <View style={styles.dividerLine} />
//               <Text style={styles.dividerText}>OR</Text>
//               <View style={styles.dividerLine} />
//             </View>

//             <Button 
//               title="Sign in with Google" 
//               variant="outline"
//               onPress={handleGoogleSignIn} 
//             />
//           </View>

//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Already have an account? </Text>
//             <Text 
//               style={styles.link} 
//               onPress={() => router.push('/(auth)/login')}
//             >
//               Sign In
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
//     backgroundColor: '#F3F4F6',
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
//     width: 100,
//     height: 70,
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
//   termsText: {
//     ...typography.caption,
//     color: colors.textSecondary,
//     marginBottom: spacing.lg,
//     marginTop: spacing.xs,
//     textAlign: 'center',
//     lineHeight: 18,
//   },
//   termsLink: {
//     color: colors.primary,
//     fontWeight: '700',
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
//     marginTop: spacing.sm,
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
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/store/authStore';
import Animated, { FadeInDown, FadeInUp, FadeIn, useSharedValue, withTiming, withSequence } from 'react-native-reanimated';
import { InteractiveLamp } from '../../src/components/auth/InteractiveLamp';

const TOP_PADDING =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + spacing.md : 56;

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'store'>('customer');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !name || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    if (useAuthStore.getState().isDummy) {
      setTimeout(() => {
        router.replace('/(auth)/verify');
        setLoading(false);
      }, 1000);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role: role },
      },
    });

    if (error) {
      Alert.alert('Registration Failed', error.message);
      flicker();
    } else {
      router.replace('/(auth)/verify');
    }
    setLoading(false);
  };

  const glow = useSharedValue(0);
  const target =
    (name.trim() ? 0.25 : 0) +
    (email.trim() ? 0.25 : 0) +
    (password ? 0.25 : 0) +
    (confirmPassword ? 0.25 : 0);

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

  const handleGoogleSignIn = () => {
    Alert.alert('Info', 'Google Sign-In will be implemented shortly.');
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
            Join Bhairahawa Light House
          </Animated.Text>
          <Animated.Text entering={FadeIn.delay(400)} style={styles.tagline}>
            Create an account to start shopping
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us and get started today.</Text>
          </View>

          <View style={styles.form}>
            {/* Role Toggle */}
            <View style={styles.roleToggle}>
              <Pressable
                style={[styles.roleBtn, role === 'customer' && styles.roleBtnActive]}
                onPress={() => setRole('customer')}
              >
                <Ionicons name="person-outline" size={16} color={role === 'customer' ? '#FFF' : colors.textSecondary} />
                <Text style={[styles.roleBtnText, role === 'customer' && styles.roleBtnTextActive]}>
                  Customer
                </Text>
              </Pressable>
              <Pressable
                style={[styles.roleBtn, role === 'store' && styles.roleBtnActive]}
                onPress={() => setRole('store')}
              >
                <Ionicons name="storefront-outline" size={16} color={role === 'store' ? '#FFF' : colors.textSecondary} />
                <Text style={[styles.roleBtnText, role === 'store' && styles.roleBtnTextActive]}>
                  Wholesale Store
                </Text>
              </Pressable>
            </View>

            <Input
              label={role === 'store' ? "Store Name" : "Full Name"}
              placeholder={role === 'store' ? "ABC Store" : "John Doe"}
              value={name}
              onChangeText={setName}
            />
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
              placeholder="Create a strong password"
              isPassword
              value={password}
              onChangeText={setPassword}
            />
            <Input
              label="Confirm Password"
              placeholder="Repeat your password"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <Pressable
              style={styles.checkboxRow}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <View style={[styles.checkbox, termsAccepted && styles.checkboxActive]}>
                {termsAccepted && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink} onPress={() => router.push('/terms')}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text style={styles.termsLink} onPress={() => router.push('/privacy')}>
                  Privacy Policy
                </Text>
              </Text>
            </Pressable>

            <Button
              title="Create Account"
              onPress={() => {
                flicker();
                handleRegister();
              }}
              loading={loading}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title="Sign in with Google"
              variant="outline"
              onPress={handleGoogleSignIn}
            />
          </View>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeIn.delay(600)} style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable hitSlop={8} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.link}>Sign In</Text>
          </Pressable>
        </Animated.View>
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

  // Hero
  hero: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingBottom: 80,
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
  logoBadge: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 120,
    height: 80,
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

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginTop: -50,
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
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 999,
    padding: 4,
    marginBottom: spacing.lg,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 999,
  },
  roleBtnActive: {
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  roleBtnText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  roleBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
    paddingRight: spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '700',
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
});
