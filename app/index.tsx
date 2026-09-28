import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, spacing, typography } from '../src/theme';
import { Button } from '../src/components/ui/Button';
import { useRouter } from 'expo-router';

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/branding/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Premium Electrical Commerce</Text>
      </View>
      
      <View style={styles.footer}>
        <Button 
          title="Login" 
          onPress={() => router.push('/(auth)/login')} 
        />
        <Button 
          title="Create Account" 
          variant="secondary" 
          onPress={() => router.push('/(auth)/register')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});
