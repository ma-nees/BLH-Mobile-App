import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../src/theme';
import { useAuthStore } from '../../src/store/authStore';
import { Ionicons } from '@expo/vector-icons';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

export default function StoreProfile() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const handleLogout = () => {
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: TOP }]}>
        <Text style={styles.headerTitle}>Store Profile</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="storefront" size={48} color={colors.primary} style={{ marginBottom: spacing.sm }} />
          <Text style={styles.name}>{user?.email}</Text>
          <Text style={styles.role}>Wholesale Partner (Approved)</Text>
        </View>

        <View style={styles.options}>
          <Pressable style={styles.optionRow} onPress={() => router.push('/(store)/orders' as any)}>
            <View style={styles.optionIcon}>
              <Ionicons name="receipt-outline" size={20} color={colors.text} />
            </View>
            <Text style={styles.optionText}>Past Bulk Orders</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.border} />
          </Pressable>
          <Pressable style={styles.optionRow} onPress={() => {}}>
            <View style={styles.optionIcon}>
              <Ionicons name="business-outline" size={20} color={colors.text} />
            </View>
            <Text style={styles.optionText}>Business Details</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.border} />
          </Pressable>
        </View>

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { ...typography.h2, color: colors.text, fontWeight: '700' },
  content: { flex: 1, padding: spacing.xl },
  infoCard: { alignItems: 'center', backgroundColor: colors.surface, padding: spacing.xl, borderRadius: 16, width: '100%', borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl },
  name: { ...typography.h3, color: colors.text, marginBottom: 4 },
  role: { ...typography.body, color: colors.success, fontWeight: '600' },
  options: { marginBottom: spacing.xxl, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  optionRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  optionIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  optionText: { flex: 1, ...typography.body, color: colors.text, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.error + '10', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: 12, gap: 8 },
  logoutText: { ...typography.subtitle, color: colors.error, fontWeight: '600' },
});
