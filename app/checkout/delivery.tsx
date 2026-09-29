import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../src/theme';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

const DELIVERY_OPTIONS = [
  { id: 'standard', name: 'Standard Delivery', time: '2-3 Business Days', price: 0, desc: 'Free delivery for all orders' },
  { id: 'express', name: 'Express Delivery', time: 'Tomorrow by 9 PM', price: 150, desc: 'Fastest delivery option available' },
];

export default function CheckoutDelivery() {
  const router = useRouter();
  const [selected, setSelected] = useState(DELIVERY_OPTIONS[0].id);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: TOP }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Delivery Method</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={styles.stepDone}><Ionicons name="checkmark" size={16} color="#FFF" /></View>
        <View style={styles.stepLineDone} />
        <View style={styles.stepActive}><Text style={styles.stepTextActive}>2</Text></View>
        <View style={styles.stepLine} />
        <View style={styles.stepInactive}><Text style={styles.stepTextInactive}>3</Text></View>
        <View style={styles.stepLine} />
        <View style={styles.stepInactive}><Text style={styles.stepTextInactive}>4</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {DELIVERY_OPTIONS.map((opt, i) => {
          const isSel = selected === opt.id;
          return (
            <Animated.View key={opt.id} entering={FadeInDown.delay(i * 100).springify()}>
              <Pressable
                style={[styles.card, isSel && styles.cardActive]}
                onPress={() => setSelected(opt.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.radioRow}>
                    <View style={[styles.radio, isSel && styles.radioActive]}>
                      {isSel && <View style={styles.radioDot} />}
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>{opt.name}</Text>
                      <Text style={styles.timeText}>{opt.time}</Text>
                    </View>
                  </View>
                  <Text style={styles.priceText}>
                    {opt.price === 0 ? 'FREE' : `Rs. ${opt.price}`}
                  </Text>
                </View>
                {isSel && (
                  <View style={styles.cardBody}>
                    <Text style={styles.descText}>{opt.desc}</Text>
                  </View>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.continueBtn} onPress={() => router.push('/checkout/payment')}>
          <Text style={styles.continueText}>Continue to Payment</Text>
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
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.textSecondary, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  cardTitle: { ...typography.body, fontWeight: '700', color: colors.text },
  timeText: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  priceText: { fontSize: 14, fontWeight: '800', color: colors.text },
  cardBody: { paddingLeft: 32, marginTop: 8 },
  descText: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },

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
