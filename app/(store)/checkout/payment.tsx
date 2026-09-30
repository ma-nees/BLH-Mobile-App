import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../../src/theme';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

const PAYMENT_METHODS = [
  { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when you receive the order' },
  { id: 'esewa', name: 'eSewa', desc: 'Pay securely via eSewa' },
  { id: 'khalti', name: 'Khalti', desc: 'Pay securely via Khalti' },
  { id: 'bank', name: 'Bank Transfer', desc: 'Direct bank transfer' },
];

export default function CheckoutPayment() {
  const router = useRouter();
  const [selected, setSelected] = useState(PAYMENT_METHODS[0].id);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: TOP }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={styles.stepDone}><Ionicons name="checkmark" size={16} color="#FFF" /></View>
        <View style={styles.stepLineDone} />
        <View style={styles.stepDone}><Ionicons name="checkmark" size={16} color="#FFF" /></View>
        <View style={styles.stepLineDone} />
        <View style={styles.stepActive}><Text style={styles.stepTextActive}>3</Text></View>
        <View style={styles.stepLine} />
        <View style={styles.stepInactive}><Text style={styles.stepTextInactive}>4</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {PAYMENT_METHODS.map((method, i) => {
          const isSel = selected === method.id;
          return (
            <Animated.View key={method.id} entering={FadeInDown.delay(i * 100).springify()}>
              <Pressable
                style={[styles.card, isSel && styles.cardActive]}
                onPress={() => setSelected(method.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.radioRow}>
                    <View style={[styles.radio, isSel && styles.radioActive]}>
                      {isSel && <View style={styles.radioDot} />}
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>{method.name}</Text>
                      {isSel && <Text style={styles.descText}>{method.desc}</Text>}
                    </View>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.continueBtn} onPress={() => router.push('/(store)/checkout/review')}>
          <Text style={styles.continueText}>Review Order</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { ...typography.h3, color: colors.text, fontWeight: '800' },
  
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  stepActive: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepTextActive: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  stepInactive: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  stepTextInactive: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },
  stepDone: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#F3F4F6', marginHorizontal: 8 },
  stepLineDone: { flex: 1, height: 2, backgroundColor: '#16A34A', marginHorizontal: 8 },

  content: { padding: spacing.lg, paddingBottom: 100 },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
  },
  cardActive: { borderColor: colors.primary, backgroundColor: '#F8FAFC' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  radioRow: { flexDirection: 'row', gap: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.textSecondary, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  cardTitle: { ...typography.body, fontWeight: '700', color: colors.text },
  descText: { color: colors.textSecondary, fontSize: 13, lineHeight: 18, marginTop: 4 },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.lg,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: radius.full,
  },
  continueText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
});
