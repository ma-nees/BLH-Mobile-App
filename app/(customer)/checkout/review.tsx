import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../../src/theme';
import { useShop, selectTotal } from '../../../src/store/cartStore';
import { PRODUCTS, fmt } from '../../../src/data/products';
import { useOrders } from '../../../src/store/orderStore';
import { useAddresses } from '../../../src/store/addressStore';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

export default function CheckoutReview() {
  const router = useRouter();
  const { cart, clear } = useShop();
  const total = useShop(selectTotal);

  const addOrder = useOrders(s => s.addOrder);
  const addresses = useAddresses(s => s.addresses);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    return { product: PRODUCTS.find((p) => p.id === id)!, qty };
  });

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        qty: item.qty
      }));

      const selectedAddress = addresses[0]; // Assuming first is selected for now

      const orderId = addOrder({
        items: orderItems,
        total,
        address: selectedAddress,
        paymentMethod: 'Cash on Delivery',
        isStoreOrder: false
      });

      clear();
      setIsSubmitting(false);
      router.push({ pathname: '/(customer)/checkout/success', params: { id: orderId } });
    }, 1500); // Simulate network request for order creation
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: TOP }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12} disabled={isSubmitting}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Review Order</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={styles.stepDone}><Ionicons name="checkmark" size={16} color="#FFF" /></View>
        <View style={styles.stepLineDone} />
        <View style={styles.stepDone}><Ionicons name="checkmark" size={16} color="#FFF" /></View>
        <View style={styles.stepLineDone} />
        <View style={styles.stepDone}><Ionicons name="checkmark" size={16} color="#FFF" /></View>
        <View style={styles.stepLineDone} />
        <View style={styles.stepActive}><Text style={styles.stepTextActive}>4</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Shipping To</Text>
              <Pressable onPress={() => router.push('/(customer)/checkout/address')} hitSlop={8}>
                <Text style={styles.editBtn}>Edit</Text>
              </Pressable>
            </View>
            <Text style={styles.boldText}>Home</Text>
            <Text style={styles.grayText}>123 Main Street, Phase 1</Text>
            <Text style={styles.grayText}>Bhairahawa</Text>
            <Text style={styles.grayText}>+977 980-0000000</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Payment & Delivery</Text>
              <Pressable onPress={() => router.push('/(customer)/checkout/payment')} hitSlop={8}>
                <Text style={styles.editBtn}>Edit</Text>
              </Pressable>
            </View>
            <View style={styles.rowLine}>
              <Text style={styles.grayText}>Method:</Text>
              <Text style={styles.boldText}>Cash on Delivery</Text>
            </View>
            <View style={styles.rowLine}>
              <Text style={styles.grayText}>Delivery:</Text>
              <Text style={styles.boldText}>Standard (2-3 Days)</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Items ({cartItems.length})</Text>
            {cartItems.map((item, idx) => (
              <View key={item.product.id} style={[styles.itemRow, idx > 0 && { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 }]}>
                <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                <Text style={styles.itemQty}>x{item.qty}</Text>
                <Text style={styles.itemPrice}>{fmt(item.product.price * item.qty)}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).springify()}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.grayText}>Subtotal</Text>
              <Text style={styles.boldText}>{fmt(total)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.grayText}>Delivery Fee</Text>
              <Text style={[styles.boldText, { color: '#16A34A' }]}>FREE</Text>
            </View>
            <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 12 }]}>
              <Text style={styles.totalLabel}>Total to Pay</Text>
              <Text style={styles.totalAmount}>{fmt(total)}</Text>
            </View>
          </View>
        </Animated.View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.continueBtn} onPress={handlePlaceOrder} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.continueText}>Place Order</Text>
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            </>
          )}
        </Pressable>
      </View>
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

  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.xl, backgroundColor: '#FFFFFF' },
  stepActive: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepTextActive: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  stepDone: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center' },
  stepLineDone: { flex: 1, height: 2, backgroundColor: '#16A34A', marginHorizontal: 8 },

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
  editBtn: { color: colors.primary, fontWeight: '700', fontSize: 14 },

  boldText: { ...typography.body, fontWeight: '700', color: colors.text, marginBottom: 4 },
  grayText: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },

  rowLine: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },

  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  itemName: { flex: 1, fontSize: 13, color: colors.text, fontWeight: '600', marginRight: 12 },
  itemQty: { fontSize: 13, color: colors.textSecondary, width: 30, textAlign: 'center' },
  itemPrice: { fontSize: 14, fontWeight: '700', color: colors.text, width: 80, textAlign: 'right' },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: colors.text },
  totalAmount: { fontSize: 20, fontWeight: '800', color: colors.primary },

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
