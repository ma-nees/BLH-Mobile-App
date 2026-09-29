import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Button } from '../../src/components/ui/Button';

export default function RejectedApproval() {
  const router = useRouter();

  // In real app, this would come from the database profile
  const mockRejectionReason = "Store verification documents were incomplete or invalid.";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="close-circle-outline" size={64} color="#EF4444" />
        </View>
        <Text style={styles.title}>Application Rejected</Text>
        <Text style={styles.subtitle}>
          Unfortunately, your wholesale store application could not be approved at this time.
        </Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reason for rejection:</Text>
          <Text style={styles.cardText}>{mockRejectionReason}</Text>
        </View>

        <Button 
          title="Contact Support" 
          onPress={() => {}} 
          style={styles.btn}
        />
        <Button 
          title="Back to Login" 
          variant="outline" 
          onPress={() => router.replace('/(auth)/login')} 
          style={[styles.btn, { marginTop: spacing.md }]}
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
    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: '#EF4444',
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
    backgroundColor: '#FEF2F2',
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: spacing.xxl,
    width: '100%',
  },
  cardTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: spacing.xs,
  },
  cardText: {
    ...typography.caption,
    color: '#7F1D1D',
    lineHeight: 20,
  },
  btn: {
    width: '100%',
  }
});
