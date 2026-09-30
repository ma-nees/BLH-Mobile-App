import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../src/theme';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

const UPCOMING = [
  { icon: 'wallet-outline', name: 'eSewa', desc: 'Pay with your digital wallet' },
  { icon: 'phone-portrait-outline', name: 'Khalti', desc: 'Pay with your digital wallet' },
  { icon: 'card-outline', name: 'Credit / Debit Card', desc: 'Visa, Mastercard and local cards' },
  { icon: 'business-outline', name: 'Bank Transfer', desc: 'Pay directly from your bank' },
] as const;

const STEPS = [
  { icon: 'cart-outline', title: 'Place your order', text: 'Choose your items and confirm at checkout.' },
  { icon: 'bicycle-outline', title: 'We deliver', text: 'Your order arrives in 1-3 business days.' },
  { icon: 'cash-outline', title: 'Pay on arrival', text: 'Check your items, then pay the delivery person.' },
] as const;

export default function PaymentMethods() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: TOP }]}>
        <Pressable
          onPress={() => router.navigate('/(customer)/profile')}
          style={styles.backBtn}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Active method */}
        <Text style={styles.sectionLabel}>PAYMENT METHODS</Text>
        <View style={[styles.methodCard, styles.activeCard]}>
          <View style={[styles.iconBox, { backgroundColor: colors.primary + '18' }]}>
            <Ionicons name="cash-outline" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.methodName}>Cash on Delivery</Text>
            <Text style={styles.methodDesc}>Pay when you receive your order</Text>
          </View>
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
        </View>

        {UPCOMING.map(m => (
          <Pressable 
            key={m.name} 
            style={({ pressed }) => [styles.methodCard, pressed && { opacity: 0.7 }]}
            onPress={() => Alert.alert(m.name, `Integration for ${m.name} is coming in a future update!`)}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.primary + '18' }]}>
              <Ionicons name={m.icon as any} size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.methodName}>{m.name}</Text>
              <Text style={styles.methodDesc}>{m.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
        ))}

        {/* How it works */}
        <View style={[styles.card, { marginTop: spacing.sm }]}>
          <Text style={styles.cardTitle}>How Cash on Delivery works</Text>
          {STEPS.map((s, i) => (
            <View key={s.title} style={styles.stepRow}>
              <View style={styles.stepCol}>
                <View style={styles.stepIcon}>
                  <Ionicons name={s.icon} size={18} color={colors.primary} />
                </View>
                {i < STEPS.length - 1 && <View style={styles.stepLine} />}
              </View>
              <View style={{ flex: 1, paddingBottom: i < STEPS.length - 1 ? spacing.md : 0 }}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepText}>{s.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.tip}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.tipText}>Please keep the exact amount ready. It helps the delivery person and speeds up your order.</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { padding: spacing.xs, width: 32 },
  headerTitle: { ...typography.h3, color: colors.text, fontWeight: '700' },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.lg * 2 },
  sectionLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '700', letterSpacing: 0.8 },

  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.lg, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  activeCard: { borderColor: colors.primary, borderWidth: 1.5 },
  iconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  methodName: { ...typography.subtitle, color: colors.text, fontWeight: '600' },
  methodDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },

  card: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  cardTitle: { ...typography.subtitle, color: colors.text, fontWeight: '700', marginBottom: spacing.md },
  stepRow: { flexDirection: 'row', gap: spacing.md },
  stepCol: { alignItems: 'center' },
  stepIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  stepLine: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 4 },
  stepTitle: { ...typography.body, color: colors.text, fontWeight: '700' },
  stepText: { ...typography.caption, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },

  tip: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.primary + '10', padding: spacing.md, borderRadius: 12 },
  tipText: { ...typography.caption, flex: 1, color: colors.text, lineHeight: 18 },

  soonBadge: { backgroundColor: colors.border, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  soonText: { fontSize: 10, fontWeight: '700', color: colors.textSecondary },
});