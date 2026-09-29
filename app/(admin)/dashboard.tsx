import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../src/theme';

// Mock data for UI presentation
const MOCK_STORES = [
  { id: '1', name: 'Bhairahawa Electronics', email: 'contact@belectronics.com', status: 'pending' },
  { id: '2', name: 'Kathmandu Supplies', email: 'sales@ksupplies.com', status: 'pending' },
];

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Panel</Text>
        <Text style={styles.subtitle}>Manage pending store approvals</Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {MOCK_STORES.map((store) => (
          <View key={store.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.storeName}>{store.name}</Text>
                <Text style={styles.storeEmail}>{store.email}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Pending</Text>
              </View>
            </View>
            
            <View style={styles.actions}>
              <Pressable style={[styles.btn, styles.btnReject]}>
                <Ionicons name="close-circle" size={18} color="#FFFFFF" />
                <Text style={styles.btnText}>Reject</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.btnApprove]}>
                <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                <Text style={styles.btnText}>Approve</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: spacing.xl,
    paddingTop: 60,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    ...typography.h2,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  storeName: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  storeEmail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    ...typography.caption,
    color: '#D97706',
    fontWeight: '700',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
    gap: 6,
  },
  btnReject: {
    backgroundColor: '#EF4444',
  },
  btnApprove: {
    backgroundColor: '#10B981',
  },
  btnText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
