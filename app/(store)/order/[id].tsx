import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../../src/theme';
import { useOrders } from '../../../src/store/orderStore';
import { fmt } from '../../../src/data/products';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const orders = useOrders(s => s.orders);
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={typography.h3}>Order not found</Text>
        <Pressable onPress={() => router.navigate('/(store)/orders')} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const subtotal = order.total;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: TOP }]}>
        <Pressable onPress={() => router.navigate('/(store)/orders')} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Order #{id}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Tracker */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Status</Text>
            <View style={styles.trackerRow}>
              {STATUS_STEPS.map((step, idx) => {
                const isActive = idx <= currentStep;
                const isLast = idx === STATUS_STEPS.length - 1;
                return (
                  <React.Fragment key={step}>
                    <View style={styles.trackStep}>
                      <View style={[styles.trackDot, isActive && styles.trackDotActive]} />
                      <Text style={[styles.trackLabel, isActive && styles.trackLabelActive]}>{step}</Text>
                    </View>
                    {!isLast && <View style={[styles.trackLine, isActive && styles.trackLineActive]} />}
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* Address */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Delivery Address</Text>
              <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
            </View>
            <Text style={styles.boldText}></Text>
            <Text style={styles.grayText}>123 Main Street, Phase 1</Text>
            <Text style={styles.grayText}>Bhairahawa</Text>
            <Text style={styles.grayText}>+977 980-0000000</Text>
          </View>
        </Animated.View>

        {/* Items */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Items Ordered</Text>
              <Ionicons name="cube-outline" size={20} color={colors.textSecondary} />
            </View>
            {order.items.map((item, idx) => (
              <View key={item.productId} style={[styles.itemRow, idx > 0 && { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 }]}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemQty}>x{item.qty}</Text>
                <Text style={styles.itemPrice}>{fmt(item.price * item.qty)}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Summary */}
        <Animated.View entering={FadeInDown.delay(250).springify()}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Payment Details</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.grayText}>Method</Text>
              <Text style={styles.boldText}>Cash on Delivery</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.grayText}>Subtotal</Text>
              <Text style={styles.boldText}>{fmt(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.grayText}>Delivery Fee</Text>
              <Text style={[styles.boldText, { color: '#16A34A' }]}>FREE</Text>
            </View>
            <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 12 }]}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalAmount}>{fmt(subtotal)}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <View style={styles.actionsRow}>
            <Pressable style={styles.outlineBtn} onPress={() => router.push(`/(store)/invoice/${order.id}`)}>
              <Ionicons name="document-text-outline" size={18} color={colors.primary} />
              <Text style={styles.outlineBtnText}>Invoice</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={() => router.push('/(store)/dashboard')}>
              <Ionicons name="refresh" size={18} color="#FFF" />
              <Text style={styles.primaryBtnText}>Reorder</Text>
            </Pressable>
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
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

  content: { padding: spacing.lg, paddingBottom: 100 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  cardTitle: { ...typography.h3, fontWeight: '800', color: colors.text },

  boldText: { ...typography.body, fontWeight: '700', color: colors.text, marginBottom: 4 },
  grayText: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },

  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  itemName: { flex: 1, fontSize: 13, color: colors.text, fontWeight: '600', marginRight: 12 },
  itemQty: { fontSize: 13, color: colors.textSecondary, width: 30, textAlign: 'center' },
  itemPrice: { fontSize: 14, fontWeight: '700', color: colors.text, width: 80, textAlign: 'right' },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: colors.text },
  totalAmount: { fontSize: 20, fontWeight: '800', color: colors.primary },

  trackerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 12 },
  trackStep: { alignItems: 'center', width: 50 },
  trackDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#E5E7EB', marginBottom: 6, zIndex: 2 },
  trackDotActive: { backgroundColor: colors.primary },
  trackLabel: { fontSize: 9, color: colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  trackLabelActive: { color: colors.primary, fontWeight: '800' },
  trackLine: { flex: 1, height: 2, backgroundColor: '#E5E7EB', marginTop: 6, marginHorizontal: -15, zIndex: 1 },
  trackLineActive: { backgroundColor: colors.primary },

  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlineBtnText: { color: colors.primary, fontWeight: '800', fontSize: 15 },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});
