import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Button } from '../../src/components/ui/Button';

export default function PendingApproval() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="time-outline" size={64} color={colors.secondary} />
        </View>
        <Text style={styles.title}>Approval Pending</Text>
        <Text style={styles.subtitle}>
          Your wholesale store account is currently under review by our admin team. This usually takes 1-2 business days.
        </Text>
        
        <View style={styles.card}>
          <Text style={styles.cardText}>
            You will receive an email once your account has been approved and you can access wholesale pricing.
          </Text>
        </View>

        <Button 
          title="Back to Login" 
          variant="outline" 
          onPress={() => router.replace('/(auth)/login')} 
          style={styles.btn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(251, 146, 60, 0.1)', // Secondary color with opacity
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: '800',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xxl,
    width: '100%',
  },
  cardText: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  btn: {
    width: '100%',
  }
});
