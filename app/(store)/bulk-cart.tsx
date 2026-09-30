import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  Platform,
  StatusBar,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Button } from '../../src/components/ui/Button';
import { PRODUCTS, fmt } from '../../src/data/products';
import { useShop, selectCount, selectWholesaleTotal } from '../../src/store/cartStore';
import { Stepper } from '../../src/components/ui/Stepper';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 32;

// Wholesale specific rules
const MINIMUM_ORDER_VALUE = 5000;
const DELIVERY_FEE = 200;

export default function BulkCart() {
  const router = useRouter();
  const { cart, add, dec, remove, clear } = useShop();
  const count = useShop(selectCount);
  const subtotal = useShop(selectWholesaleTotal);

  const items = PRODUCTS.filter((p) => cart[p.id]);
  
  // Calculate retail equivalent to show savings
  const retailTotal = items.reduce((s, p) => s + p.price * cart[p.id], 0);
  const wholesaleSavings = retailTotal - subtotal;
  
  const delivery = subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;
  const progress = Math.min(1, subtotal / MINIMUM_ORDER_VALUE);
  const canCheckout = subtotal >= MINIMUM_ORDER_VALUE;

  const [showMinOrderModal, setShowMinOrderModal] = React.useState(false);

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

  const handleCheckout = () => {
    if (!canCheckout) {
      setShowMinOrderModal(true);
      return;
    }
    router.push('/(store)/checkout/address');
  };

  const handleDec = (p: typeof PRODUCTS[0]) => {
    if (cart[p.id] <= p.minQty) {
      remove(p.id);
    } else {
      dec(p.id);
    }
  };

  const confirmClear = () =>
    Alert.alert('Clear bulk cart?', 'Remove all wholesale items from your cart.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clear },
    ]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Animated.View style={[styles.header, { paddingTop: TOP }, headerStyle]}>
        <View style={styles.headerRow}>
          <View style={{ width: 40 }} />
          <Animated.View style={[styles.headerCenter, titleStyle]}>
            <Text style={styles.headerTitle}>Bulk Cart</Text>
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
            <Ionicons name="cube-outline" size={54} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your bulk cart is empty</Text>
          <Text style={styles.emptyText}>Add products in wholesale quantities to checkout.</Text>
          <View style={{ height: spacing.lg }} />
          <Button title="Browse Catalog" onPress={() => router.replace('/(store)/catalog')} />
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
            {/* Minimum Order Progress */}
            <Animated.View entering={FadeInDown.springify()} style={[styles.progressCard, canCheckout ? styles.progressSuccess : null]}>
              <Ionicons name={canCheckout ? "checkmark-circle" : "alert-circle-outline"} size={22} color={canCheckout ? "#10B981" : colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.progressText, canCheckout ? { color: "#10B981" } : null]}>
                  {canCheckout
                    ? 'Minimum order value met!'
                    : `Add ${fmt(MINIMUM_ORDER_VALUE - subtotal)} more to meet minimum order.`}
                </Text>
                {!canCheckout && (
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                  </View>
                )}
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
                  
                  <View style={styles.badgeRow}>
                    <View style={styles.qtyBadge}>
                      <Text style={styles.qtyBadgeText}>Min Qty: {p.minQty}</Text>
                    </View>
                  </View>

                  <View style={styles.itemBottom}>
                    <View>
                      <Text style={styles.itemPrice}>{fmt(p.wholesalePrice * cart[p.id])}</Text>
                      <Text style={styles.itemUnit}>{fmt(p.wholesalePrice)} / piece</Text>
                    </View>
                    <Stepper 
                      value={cart[p.id]} 
                      onAdd={() => add(p.id)} 
                      onDec={() => handleDec(p)} 
                      size="sm" 
                    />
                  </View>
                </View>
              </Animated.View>
            ))}

            {/* Bill */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Order Summary</Text>
              
              <BillRow label="Retail Equivalent" value={fmt(retailTotal)} />
              <BillRow label="Wholesale Subtotal" value={fmt(subtotal)} />
              <BillRow label="Wholesale Savings" value={`- ${fmt(wholesaleSavings)}`} green />
              
              <View style={styles.divider} />
              <BillRow label="Freight/Delivery" value={fmt(delivery)} />
              <View style={styles.divider} />
              
              <View style={styles.billRow}>
                <Text style={styles.totalLabel}>Total Order Value</Text>
                <Text style={styles.totalValue}>{fmt(total)}</Text>
              </View>
              <View style={styles.saveBanner}>
                <Text style={styles.saveText}>
                  Your wholesale discount saved you {fmt(wholesaleSavings)}!
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
            <Pressable 
              style={[styles.checkoutBtn, !canCheckout && styles.checkoutBtnDisabled]} 
              onPress={handleCheckout}
            >
              <Text style={[styles.checkoutBtnText, !canCheckout && { color: 'rgba(255,255,255,0.7)' }]}>Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color={!canCheckout ? 'rgba(255,255,255,0.7)' : colors.primary} />
            </Pressable>
          </Animated.View>
        </>
      )}

      {/* Custom Minimum Order Modal */}
      <Modal visible={showMinOrderModal} transparent animationType="fade">
        <View style={styles.modalOverlayBg}>
          <Animated.View entering={FadeInDown.springify().damping(15)} style={styles.alertModal}>
            <View style={styles.alertIconWrap}>
              <Ionicons name="alert-circle" size={40} color="#F59E0B" />
            </View>
            <Text style={styles.alertTitle}>Minimum Order</Text>
            <Text style={styles.alertDesc}>
              Wholesale orders require a minimum subtotal of <Text style={{ fontWeight: '800', color: colors.text }}>{fmt(MINIMUM_ORDER_VALUE)}</Text>.
            </Text>
            <View style={styles.alertRemaining}>
              <Text style={styles.alertRemainingText}>
                Add <Text style={{ fontWeight: '800' }}>{fmt(MINIMUM_ORDER_VALUE - subtotal)}</Text> more to proceed.
              </Text>
            </View>
            
            <View style={styles.alertButtons}>
              <Pressable style={styles.alertBtnSecondary} onPress={() => setShowMinOrderModal(false)}>
                <Text style={styles.alertBtnSecondaryText}>Got it</Text>
              </Pressable>
              <Pressable style={styles.alertBtnPrimary} onPress={() => {
                setShowMinOrderModal(false);
                router.replace('/(store)/catalog');
              }}>
                <Text style={styles.alertBtnPrimaryText}>Browse Catalog</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

function BillRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <View style={styles.billRow}>
      <Text style={[styles.billLabel, green && { color: '#16A34A' }]}>{label}</Text>
      <Text style={[styles.billValue, green && { color: '#16A34A' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    height: 44,
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { ...typography.subtitle, fontSize: 17, fontWeight: '700' },
  headerSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2, fontWeight: '500' },
  clearText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primary + '10', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  emptyTitle: { ...typography.h3, marginBottom: spacing.xs, color: colors.text },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  scroll: { padding: spacing.md, paddingBottom: 220 },
  
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  progressSuccess: {
    backgroundColor: '#10B981' + '10',
    borderColor: '#10B981' + '20',
  },
  progressText: { fontSize: 13, fontWeight: '600', color: colors.primary, marginBottom: 6 },
  progressTrack: { height: 6, backgroundColor: colors.primary + '20', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  itemImage: { width: 80, height: 80, borderRadius: radius.md, backgroundColor: colors.background },
  itemInfo: { flex: 1, marginLeft: spacing.md },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { flex: 1, ...typography.subtitle, fontSize: 15, marginRight: spacing.sm, lineHeight: 20 },
  itemCategory: { fontSize: 12, color: colors.textSecondary, marginTop: 4, textTransform: 'capitalize' },
  
  badgeRow: { flexDirection: 'row', marginTop: 6, marginBottom: 4 },
  qtyBadge: { backgroundColor: colors.border, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  qtyBadgeText: { fontSize: 10, fontWeight: '700', color: colors.textSecondary },

  itemBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 },
  itemPrice: { ...typography.subtitle, fontSize: 16, color: colors.text },
  itemUnit: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  
  card: {
    backgroundColor: '#FFFFFF',
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  cardTitle: { ...typography.h3, marginBottom: spacing.md },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  billLabel: { fontSize: 14, color: colors.textSecondary },
  billValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 18, fontWeight: '800', color: colors.text },
  saveBanner: { backgroundColor: '#16A34A15', padding: spacing.sm, borderRadius: radius.sm, marginTop: spacing.md, alignItems: 'center' },
  saveText: { color: '#16A34A', fontSize: 13, fontWeight: '700' },
  
  checkoutBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: Platform.OS === 'ios' ? 100 : 90,
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
  checkoutBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  checkoutBtnText: { color: colors.primary, fontWeight: '800', fontSize: 15 },
  
  modalOverlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  alertModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  alertIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F59E0B' + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  alertTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  alertDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  alertRemaining: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
  },
  alertRemainingText: {
    fontSize: 14,
    color: colors.text,
  },
  alertButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  alertBtnSecondary: {
    flex: 1,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBtnSecondaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  alertBtnPrimary: {
    flex: 1,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBtnPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
