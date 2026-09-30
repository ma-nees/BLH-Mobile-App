import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Button } from '../../src/components/ui/Button';
import { PRODUCTS, fmt } from '../../src/data/products';
import { useShop, selectCount, selectTotal } from '../../src/store/cartStore';
import { Stepper } from '../../src/components/ui/Stepper';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 32;

// Adjust these to your shop's real rules
const FREE_DELIVERY_ABOVE = 1000;
const DELIVERY_FEE = 60;
const PROMO = { code: 'WELCOME10', pct: 10 };

export default function Cart() {
  const router = useRouter();
  const { cart, add, dec, remove, clear } = useShop();
  const count = useShop(selectCount);
  const subtotal = useShop(selectTotal);

  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(false);

  const items = PRODUCTS.filter((p) => cart[p.id]);
  const mrpTotal = items.reduce((s, p) => s + p.mrp * cart[p.id], 0);
  const savings = mrpTotal - subtotal;
  const promo = applied ? Math.round((subtotal * PROMO.pct) / 100) : 0;
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const total = subtotal - promo + delivery;
  const remaining = Math.max(0, FREE_DELIVERY_ABOVE - subtotal);
  const progress = Math.min(1, subtotal / FREE_DELIVERY_ABOVE);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => ({
    paddingBottom: interpolate(scrollY.value, [0, 80], [10, 8], 'clamp'),
    elevation: interpolate(scrollY.value, [0, 20], [0, 4], 'clamp'),
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(scrollY.value, [0, 80], [1, 0.85], 'clamp') },
      { translateY: interpolate(scrollY.value, [0, 80], [0, -4], 'clamp') }
    ],
  }));

  const applyPromo = () => {
    if (code.trim().toUpperCase() === PROMO.code) {
      setApplied(true);
    } else {
      Alert.alert('Invalid code', 'That promo code is not valid.');
    }
  };

  const placeOrder = () => {
    // TODO: insert the order into Supabase here before clearing the cart
    Alert.alert('Order placed successfully', `Total ${fmt(total)} · Cash on delivery`, [
      {
        text: 'OK',
        onPress: () => {
          clear();
          setApplied(false);
          setCode('');
          router.replace('/(customer)/home');
        },
      },
    ]);
  };

  const confirmClear = () =>
    Alert.alert('Clear cart?', 'Remove all items from your cart.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clear },
    ]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Animated.View style={[styles.header, { paddingTop: TOP }, headerStyle]}>
        <View style={styles.headerRow}>
          {router.canGoBack() ? (
            <Pressable style={styles.iconBtn} onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="chevron-back" size={22} color={colors.primary} />
            </Pressable>
          ) : (
            <View style={{ width: 40 }} />
          )}
          <Animated.View style={[styles.headerCenter, titleStyle]}>
            <Text style={styles.headerTitle}>My Cart</Text>
            <Text style={styles.headerSub}>
              {count} item{count === 1 ? '' : 's'}
            </Text>
          </Animated.View>
          {count > 0 ? (
            <Pressable onPress={confirmClear} hitSlop={8}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>
      </Animated.View>

      {items.length === 0 ? (
        <Animated.View entering={FadeIn} style={styles.empty}>
          <View style={styles.emptyCircle}>
            <Ionicons name="cart-outline" size={54} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add bulbs, wires or switches to get started.</Text>
          <View style={{ height: spacing.lg }} />
          <Button title="Start Shopping" onPress={() => router.replace('/(customer)/home')} />
        </Animated.View>
      ) : (
        <>
          <Animated.ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {/* Free delivery progress */}
            <Animated.View entering={FadeInDown.springify()} style={styles.progressCard}>
              <Ionicons name="bicycle-outline" size={22} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.progressText}>
                  {remaining === 0
                    ? 'You get free delivery'
                    : `Add ${fmt(remaining)} more for free delivery`}
                </Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
              </View>
            </Animated.View>

            {/* Items */}
            {items.map((p, i) => (
              <Animated.View
                key={p.id}
                entering={FadeInDown.delay(80 + i * 60).springify()}
                style={styles.itemCard}
              >
                <Image source={{ uri: p.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <View style={styles.itemTop}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {p.name}
                    </Text>
                    <Pressable onPress={() => remove(p.id)} hitSlop={8}>
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </Pressable>
                  </View>
                  <Text style={styles.itemCategory}>{p.category}</Text>
                  <View style={styles.itemBottom}>
                    <View>
                      <Text style={styles.itemPrice}>{fmt(p.price * cart[p.id])}</Text>
                      <Text style={styles.itemUnit}>{fmt(p.price)} each</Text>
                    </View>
                    <Stepper 
                      value={cart[p.id]} 
                      onAdd={() => add(p.id)} 
                      onDec={() => dec(p.id)} 
                      size="sm" 
                    />
                  </View>
                </View>
              </Animated.View>
            ))}

            {/* Promo */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Promo code</Text>
              {applied ? (
                <View style={styles.appliedRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                  <Text style={styles.appliedText}>
                    {PROMO.code} applied · you save {fmt(promo)}
                  </Text>
                  <Pressable onPress={() => setApplied(false)} hitSlop={8}>
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.promoRow}>
                  <TextInput
                    style={styles.promoInput}
                    placeholder="Enter code (try WELCOME10)"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="characters"
                    value={code}
                    onChangeText={setCode}
                  />
                  <Pressable style={styles.applyBtn} onPress={applyPromo}>
                    <Text style={styles.applyText}>Apply</Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Bill */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Bill details</Text>
              <BillRow label="Item total (MRP)" value={fmt(mrpTotal)} />
              <BillRow label="Product discount" value={`- ${fmt(savings)}`} green />
              {applied && <BillRow label={`Promo (${PROMO.code})`} value={`- ${fmt(promo)}`} green />}
              <BillRow label="Delivery fee" value={delivery === 0 ? 'FREE' : fmt(delivery)} green={delivery === 0} />
              <View style={styles.divider} />
              <View style={styles.billRow}>
                <Text style={styles.totalLabel}>To pay</Text>
                <Text style={styles.totalValue}>{fmt(total)}</Text>
              </View>
              <View style={styles.saveBanner}>
                <Text style={styles.saveText}>
                  You are saving {fmt(savings + promo)} on this order
                </Text>
              </View>
            </View>
          </Animated.ScrollView>

          {/* Checkout bar */}
          <Animated.View entering={FadeIn.delay(200)} style={styles.checkoutBar}>
            <View>
              <Text style={styles.checkoutLabel}>Total</Text>
              <Text style={styles.checkoutTotal}>{fmt(total)}</Text>
            </View>
            <Pressable style={styles.checkoutBtn} onPress={() => router.push('/(customer)/checkout/address')}>
              <Text style={styles.checkoutBtnText}>Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.primary} />
            </Pressable>
          </Animated.View>
        </>
      )}
    </View>
  );
}

function BillRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <View style={styles.billRow}>
      <Text style={styles.billLabel}>{label}</Text>
      <Text style={[styles.billValue, green && { color: '#16A34A' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    zIndex: 10,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { ...typography.h2, color: colors.text, fontWeight: '800' },
  headerSub: { ...typography.caption, color: colors.textSecondary },
  clearText: { ...typography.caption, color: '#EF4444', fontWeight: '700', width: 40, textAlign: 'right' },

  scroll: { padding: spacing.lg, paddingBottom: 220, gap: 14 },

  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  progressText: { ...typography.caption, color: colors.text, fontWeight: '700', marginBottom: 8 },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: '#16A34A' },

  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  itemImage: { width: 86, height: 86, borderRadius: 12, backgroundColor: '#F3F4F6' },
  itemInfo: { flex: 1, justifyContent: 'space-between' },
  itemTop: { flexDirection: 'row', gap: 8 },
  itemName: { ...typography.caption, flex: 1, color: colors.text, fontWeight: '700' },
  itemCategory: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  itemBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 6 },
  itemPrice: { ...typography.body, color: colors.text, fontWeight: '800' },
  itemUnit: { fontSize: 10, color: colors.textSecondary },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 32,
    paddingHorizontal: 4,
  },
  stepBtn: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  stepQty: { color: '#FFFFFF', fontWeight: '800', minWidth: 22, textAlign: 'center' },

  card: { backgroundColor: '#FFFFFF', borderRadius: radius.lg, padding: spacing.md },
  cardTitle: { ...typography.body, color: colors.text, fontWeight: '800', marginBottom: spacing.sm },
  promoRow: { flexDirection: 'row', gap: 10 },
  promoInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    color: colors.text,
  },
  applyBtn: {
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { color: '#FFFFFF', fontWeight: '800' },
  appliedRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  appliedText: { ...typography.caption, flex: 1, color: '#16A34A', fontWeight: '700' },
  removeText: { ...typography.caption, color: '#EF4444', fontWeight: '700' },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoLabel: { fontSize: 11, color: colors.textSecondary },
  infoValue: { ...typography.body, color: colors.text, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },

  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  billLabel: { ...typography.caption, color: colors.textSecondary },
  billValue: { ...typography.caption, color: colors.text, fontWeight: '700' },
  totalLabel: { ...typography.body, color: colors.text, fontWeight: '800' },
  totalValue: { ...typography.body, color: colors.text, fontWeight: '800' },
  saveBanner: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(22,163,74,0.1)',
  },
  saveText: { ...typography.caption, color: '#16A34A', fontWeight: '700', textAlign: 'center' },

  checkoutBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: 96,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  checkoutLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  checkoutTotal: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  checkoutBtnText: { color: colors.primary, fontWeight: '800', fontSize: 15 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: { ...typography.h3, color: colors.text, fontWeight: '800' },
  emptyText: { ...typography.body, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
});