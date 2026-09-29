import React, { useEffect, useMemo, useRef, useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeOutDown,
  SlideInDown,
  SlideOutDown,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../src/theme';
import { PRODUCTS, fmt, discountPct } from '../../src/data/products';
import { useShop, selectCount, selectTotal } from '../../src/store/cartStore';
import { Button } from '../../src/components/ui/Button';
import { Stepper } from '../../src/components/ui/Stepper';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 32;

type Sort = 'default' | 'low' | 'high' | 'discount';
const SORTS: { key: Sort; label: string }[] = [
  { key: 'default', label: 'Recommended' },
  { key: 'low', label: 'Price: Low to High' },
  { key: 'high', label: 'Price: High to Low' },
  { key: 'discount', label: 'Biggest Discount' },
];

export default function Wishlist() {
  const router = useRouter();
  const { cart, favs, add, dec, toggleFav } = useShop();
  const cartCount = useShop(selectCount);
  const cartTotal = useShop(selectTotal);

  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState<Sort>('default');
  const [undoId, setUndoId] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const saved = useMemo(() => PRODUCTS.filter((p) => favs[p.id]), [favs]);
  const categories = useMemo(() => ['All', ...Array.from(new Set(saved.map((p) => p.category)))], [saved]);
  const activeCategory = categories.includes(category) ? category : 'All';

  const items = useMemo(() => {
    const list = saved.filter((p) => activeCategory === 'All' || p.category === activeCategory);
    if (sort === 'low') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') return [...list].sort((a, b) => b.price - a.price);
    if (sort === 'discount') return [...list].sort((a, b) => discountPct(b) - discountPct(a));
    return list;
  }, [saved, activeCategory, sort]);

  const totalValue = saved.reduce((s, p) => s + p.price, 0);
  const totalSavings = saved.reduce((s, p) => s + (p.mrp - p.price), 0);
  const notInCart = saved.filter((p) => !cart[p.id]);

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

  const removeWithUndo = (id: string) => {
    toggleFav(id);
    setUndoId(id);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setUndoId(null), 4000);
  };

  const moveToCart = (id: string) => {
    add(id);
    removeWithUndo(id);
  };

  const undo = () => {
    if (undoId) toggleFav(undoId);
    setUndoId(null);
    if (timer.current) clearTimeout(timer.current);
  };

  const addAll = () => {
    notInCart.forEach((p) => {
      add(p.id);
      toggleFav(p.id);
    });
    // Optional: show a generic snackbar for "Moved all items to cart" if needed, 
    // but the wishlist will just show empty state.
  };

  const clearAll = () =>
    Alert.alert('Clear wishlist?', 'Remove all saved items.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => saved.forEach((p) => toggleFav(p.id)) },
    ]);

  const undoName = undoId ? PRODUCTS.find((p) => p.id === undoId)?.name : '';

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
            <Text style={styles.headerTitle}>My Wishlist</Text>
            <Text style={styles.headerSub}>
              {saved.length} saved item{saved.length === 1 ? '' : 's'}
            </Text>
          </Animated.View>
          {saved.length > 0 ? (
            <Pressable onPress={clearAll} hitSlop={8}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>
      </Animated.View>

      {saved.length === 0 ? (
        <Animated.View entering={FadeIn} style={styles.empty}>
          <View style={styles.emptyCircle}>
            <Ionicons name="heart-outline" size={54} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptyText}>
            Tap the heart on any product to keep it here for later.
          </Text>
          <View style={{ height: spacing.lg }} />
          <Button title="Explore Products" onPress={() => router.replace('/(customer)/home')} />
        </Animated.View>
      ) : (
        <Animated.ScrollView
          contentContainerStyle={[styles.scroll, cartCount > 0 ? { paddingBottom: 170 } : { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {/* Summary */}
          <Animated.View entering={FadeInDown.springify()} style={styles.summary}>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Total value</Text>
              <Text style={styles.summaryValue}>{fmt(totalValue)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>You save</Text>
              <Text style={[styles.summaryValue, { color: '#16A34A' }]}>{fmt(totalSavings)}</Text>
            </View>
          </Animated.View>

          {/* Add all */}
          <Animated.View entering={FadeInDown.delay(80).springify()}>
            <Pressable
              style={[styles.addAll, notInCart.length === 0 && styles.addAllDone]}
              onPress={notInCart.length ? addAll : () => router.push('/(customer)/cart')}
            >
              <Ionicons
                name={notInCart.length ? 'bag-add-outline' : 'checkmark-circle'}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.addAllText}>
                {notInCart.length
                  ? `Move ${notInCart.length} item${notInCart.length === 1 ? '' : 's'} to cart`
                  : 'All items are in your cart'}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Filters */}
          {categories.length > 2 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {categories.map((c) => {
                const on = c === activeCategory;
                return (
                  <Pressable key={c} style={[styles.chip, on && styles.chipOn]} onPress={() => setCategory(c)}>
                    <Text style={[styles.chipText, on && styles.chipTextOn]}>{c}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            <Ionicons name="swap-vertical" size={18} color={colors.textSecondary} style={{ alignSelf: 'center' }} />
            {SORTS.map((s) => {
              const on = s.key === sort;
              return (
                <Pressable key={s.key} style={[styles.sortChip, on && styles.sortChipOn]} onPress={() => setSort(s.key)}>
                  <Text style={[styles.sortText, on && styles.sortTextOn]}>{s.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Items */}
          {items.map((p, i) => {
            const qty = cart[p.id] ?? 0;
            const off = discountPct(p);
            return (
              <Animated.View key={p.id} entering={FadeInRight.delay(i * 70).springify()} style={styles.row}>
                <View>
                  <Image source={{ uri: p.image }} style={styles.rowImage} />
                  {off > 0 && (
                    <View style={styles.off}>
                      <Text style={styles.offText}>{off}% OFF</Text>
                    </View>
                  )}
                </View>

                <View style={styles.rowInfo}>
                  <View style={styles.rowTop}>
                    <Text style={styles.rowName} numberOfLines={2}>{p.name}</Text>
                    <Pressable style={styles.heartBtn} onPress={() => removeWithUndo(p.id)} hitSlop={8}>
                      <Ionicons name="heart" size={18} color="#EF4444" />
                    </Pressable>
                  </View>

                  <View style={styles.metaRow}>
                    <Text style={styles.category}>{p.category}</Text>
                    <View style={styles.ratingPill}>
                      <Ionicons name="star" size={9} color="#FFFFFF" />
                      <Text style={styles.ratingText}>{p.rating}</Text>
                    </View>
                    <Text style={styles.reviews}>({p.reviews})</Text>
                  </View>

                  <View style={styles.rowBottom}>
                    <View>
                      <Text style={styles.price}>{fmt(p.price)}</Text>
                      <Text style={styles.mrp}>{fmt(p.mrp)}</Text>
                    </View>
                    {qty === 0 ? (
                      <Pressable 
                        style={[styles.addBtn, { paddingHorizontal: 16 }]} 
                        onPress={() => moveToCart(p.id)}
                      >
                        <Text style={styles.addText}>MOVE TO CART</Text>
                      </Pressable>
                    ) : (
                      <Stepper 
                        value={qty} 
                        onAdd={() => add(p.id)} 
                        onDec={() => dec(p.id)} 
                        size="sm" 
                      />
                    )}
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>
      )}

      {/* Undo snackbar */}
      {undoId && (
        <Animated.View
          entering={FadeInDown.springify()}
          exiting={FadeOutDown}
          style={[styles.snack, { bottom: cartCount > 0 ? 160 : 92 }]}
        >
          <Text style={styles.snackText} numberOfLines={1}>
            Removed {undoName}
          </Text>
          <Pressable onPress={undo} hitSlop={8}>
            <Text style={styles.snackUndo}>UNDO</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Floating cart bar */}
      {cartCount > 0 && (
        <Animated.View entering={SlideInDown.springify()} exiting={SlideOutDown} style={styles.cartBar}>
          <Pressable style={styles.cartBarInner} onPress={() => router.push('/(customer)/cart')}>
            <View>
              <Text style={styles.cartBarCount}>{cartCount} item{cartCount > 1 ? 's' : ''}</Text>
              <Text style={styles.cartBarTotal}>{fmt(cartTotal)}</Text>
            </View>
            <View style={styles.cartBarRight}>
              <Text style={styles.cartBarCta}>View Cart</Text>
              <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
            </View>
          </Pressable>
        </Animated.View>
      )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
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
  clearText: { color: colors.primary, fontWeight: '700', fontSize: 15 },

  scroll: { padding: spacing.lg, gap: 12 },

  // Summary
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },
  summaryCol: { flex: 1, alignItems: 'center' },
  summaryLabel: { ...typography.caption, color: colors.textSecondary },
  summaryValue: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 2 },
  summaryDivider: { width: 1, height: 32, backgroundColor: colors.border },

  addAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  addAllDone: { backgroundColor: '#16A34A' },
  addAllText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },

  // Filters
  chipRow: { gap: 8, paddingRight: spacing.lg },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  chipTextOn: { color: '#FFFFFF' },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  sortChipOn: { backgroundColor: 'rgba(0,0,0,0.85)' },
  sortText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  sortTextOn: { color: '#FFFFFF' },

  // Row
  row: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  rowImage: { width: 96, height: 96, borderRadius: 12, backgroundColor: '#F3F4F6' },
  off: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  offText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  rowInfo: { flex: 1, justifyContent: 'space-between' },
  rowTop: { flexDirection: 'row', gap: 8 },
  rowName: { ...typography.caption, flex: 1, color: colors.text, fontWeight: '700' },
  heartBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(239,68,68,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  category: { fontSize: 11, color: colors.textSecondary },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#16A34A',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
  },
  ratingText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  reviews: { fontSize: 10, color: colors.textSecondary },
  rowBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 6 },
  price: { ...typography.body, color: colors.text, fontWeight: '800' },
  mrp: { fontSize: 10, color: colors.textSecondary, textDecorationLine: 'line-through' },

  addBtn: {
    height: 34,
    paddingHorizontal: 22,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { color: colors.primary, fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 34,
    paddingHorizontal: 3,
  },
  stepBtn: { width: 26, height: 28, alignItems: 'center', justifyContent: 'center' },
  stepQty: { color: '#FFFFFF', fontWeight: '800', minWidth: 20, textAlign: 'center' },

  // Empty
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

  // Snackbar
  snack: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    zIndex: 20,
    elevation: 20,
  },
  snackText: { flex: 1, color: '#FFFFFF', fontSize: 13 },
  snackUndo: { color: '#FFD54A', fontWeight: '800', fontSize: 13, letterSpacing: 0.5 },

  // Floating cart bar
  cartBar: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: 92 },
  cartBarInner: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  cartBarCount: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  cartBarTotal: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  cartBarRight: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  cartBarCta: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});