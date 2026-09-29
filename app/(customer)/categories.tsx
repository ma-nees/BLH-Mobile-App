import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInRight, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../src/theme';
import { CATEGORIES, PRODUCTS, fmt, discountPct } from '../../src/data/products';
import { useShop, selectCount, selectTotal } from '../../src/store/cartStore';
import { Skeleton } from '../../src/components/ui/Skeleton';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 32;
const CATS = CATEGORIES.filter((c) => c.name !== 'All');

function CategoriesSkeleton() {
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: TOP }]}>
        <Skeleton width={160} height={28} style={{ marginBottom: 12 }} />
        <Skeleton width="100%" height={48} borderRadius={16} />
      </View>
      <View style={styles.body}>
        <View style={styles.rail}>
          {[1,2,3,4,5,6].map(i => (
            <View key={i} style={{ alignItems: 'center', paddingVertical: 12 }}>
              <Skeleton width={52} height={52} borderRadius={16} />
              <Skeleton width={40} height={12} style={{ marginTop: 8 }} />
            </View>
          ))}
        </View>
        <View style={styles.content}>
          <View style={[styles.contentInner, { paddingTop: 16 }]}>
            <Skeleton width="100%" height={104} borderRadius={12} />
            <Skeleton width="100%" height={104} borderRadius={12} />
            <Skeleton width="100%" height={104} borderRadius={12} />
            <Skeleton width="100%" height={104} borderRadius={12} />
          </View>
        </View>
      </View>
    </View>
  );
}

export default function Categories() {
  const router = useRouter();
  const { cart, favs, add, dec, toggleFav } = useShop();
  const count = useShop(selectCount);
  const total = useShop(selectTotal);

  const [selected, setSelected] = useState(CATS[0].name);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStock, setInStock] = useState(false);

  const searching = query.trim().length > 0;
  const active = CATS.find((c) => c.name === selected) ?? CATS[0];

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    PRODUCTS.forEach((p) => (m[p.category] = (m[p.category] ?? 0) + 1));
    return m;
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let res = PRODUCTS;
    
    if (q) {
      res = res.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    } else {
      res = res.filter((p) => p.category === selected);
    }
    
    if (inStock) {
      // Mock: everything with an even ID length is in stock for demo purposes
      res = res.filter((p) => p.id.length % 2 === 0);
    }
    
    res = [...res].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
    
    return res;
  }, [query, selected, inStock, sort]);

  if (isLoading) return <CategoriesSkeleton />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: TOP }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Categories</Text>
            <Text style={styles.subtitle}>{CATS.length} departments · {PRODUCTS.length} products</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search all products..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
          />
          {searching && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.body}>
        {/* Sidebar */}
        <ScrollView style={styles.rail} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.railContent, count > 0 ? { paddingBottom: 170 } : { paddingBottom: 100 }]}>
          {CATS.map((c, i) => {
            const on = !searching && c.name === selected;
            return (
              <Animated.View key={c.id} entering={FadeInDown.delay(i * 50).springify()}>
                <Pressable style={styles.railItem} onPress={() => { setQuery(''); setSelected(c.name); }}>
                  {on && <View style={[styles.railBar, { backgroundColor: c.color }]} />}
                  <View
                    style={[
                      styles.railIcon,
                      { backgroundColor: on ? c.color : `${c.color}15` },
                    ]}
                  >
                    <Ionicons name={c.icon as any} size={24} color={on ? '#FFFFFF' : c.color} />
                  </View>
                  <Text style={[styles.railLabel, on && { color: colors.text, fontWeight: '800' }]}>{c.name}</Text>
                  <Text style={styles.railCount}>{counts[c.name] ?? 0}</Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* Products */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={[styles.contentInner, count > 0 ? { paddingBottom: 170 } : { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentHead}>
            <Text style={styles.contentTitle}>{searching ? 'Search results' : active.name}</Text>
            <Text style={styles.contentCount}>{visible.length} items</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            <Pressable 
              style={[styles.filterChip, sort !== 'featured' && styles.filterChipActive]}
              onPress={() => {
                const next = { 'featured': 'price-asc', 'price-asc': 'price-desc', 'price-desc': 'rating', 'rating': 'featured' } as const;
                setSort(next[sort]);
              }}
            >
              <Ionicons name="swap-vertical" size={14} color={sort !== 'featured' ? '#FFF' : colors.textSecondary} />
              <Text style={[styles.filterText, sort !== 'featured' && { color: '#FFF' }]}>
                {sort === 'featured' ? 'Sort' : sort === 'price-asc' ? 'Price: Low' : sort === 'price-desc' ? 'Price: High' : 'Top Rated'}
              </Text>
            </Pressable>

            <Pressable 
              style={[styles.filterChip, inStock && styles.filterChipActive]}
              onPress={() => setInStock(!inStock)}
            >
              <Ionicons name="checkmark-circle" size={14} color={inStock ? '#FFF' : colors.textSecondary} />
              <Text style={[styles.filterText, inStock && { color: '#FFF' }]}>In Stock</Text>
            </Pressable>
          </ScrollView>

          {visible.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="search" size={40} color={colors.textSecondary} style={{ marginBottom: spacing.sm }} />
              <Text style={styles.emptyTitle}>Nothing found</Text>
              <Text style={styles.emptyText}>Try a different keyword.</Text>
            </View>
          ) : (
            visible.map((p, i) => {
              const qty = cart[p.id] ?? 0;
              const off = discountPct(p);
              return (
                <Animated.View key={p.id} entering={FadeInRight.delay(i * 70).springify()}>
                  <Pressable style={styles.row} onPress={() => router.push(`/(customer)/product/${p.id}`)}>
                    <View>
                      <Image source={{ uri: p.image }} style={styles.rowImage} />
                      {off > 0 && (
                        <View style={styles.off}>
                          <Text style={styles.offText}>{off}%</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.rowInfo}>
                    <View style={styles.rowTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.rowName} numberOfLines={2}>{p.name}</Text>
                        <Text style={styles.brandText}>Brand: BLH Premium</Text>
                      </View>
                      <Pressable onPress={() => toggleFav(p.id)} hitSlop={8}>
                        <Ionicons
                          name={favs[p.id] ? 'heart' : 'heart-outline'}
                          size={18}
                          color={favs[p.id] ? '#EF4444' : colors.textSecondary}
                        />
                      </Pressable>
                    </View>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={11} color="#F59E0B" />
                      <Text style={styles.ratingText}>{p.rating} ({p.reviews})</Text>
                      <View style={styles.dotSeparator} />
                      <Text style={[styles.stockText, p.id.length % 2 !== 0 && styles.outOfStock]}>
                        {p.id.length % 2 === 0 ? 'In Stock' : 'Out of Stock'}
                      </Text>
                    </View>
                    <View style={styles.rowBottom}>
                      <View style={styles.priceWrap}>
                        <Text style={styles.price}>{fmt(p.price)}</Text>
                        <Text style={styles.mrp}>{fmt(p.mrp)}</Text>
                      </View>
                      {qty === 0 ? (
                        <Pressable style={styles.addBtn} onPress={() => add(p.id)}>
                          <Text style={styles.addText}>ADD</Text>
                        </Pressable>
                      ) : (
                        <View style={styles.stepper}>
                          <Pressable style={styles.stepBtn} onPress={() => dec(p.id)} hitSlop={6}>
                            <Ionicons name="remove" size={16} color="#FFFFFF" />
                          </Pressable>
                          <Text style={styles.stepQty}>{qty}</Text>
                          <Pressable style={styles.stepBtn} onPress={() => add(p.id)} hitSlop={6}>
                            <Ionicons name="add" size={16} color="#FFFFFF" />
                          </Pressable>
                        </View>
                      )}
                    </View>
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })
          )}
        </ScrollView>
      </View>

      {/* Floating cart bar */}
      {count > 0 && (
        <Animated.View entering={SlideInDown.springify()} exiting={SlideOutDown} style={styles.cartBar}>
          <Pressable style={styles.cartBarInner} onPress={() => router.push('/(customer)/cart')}>
            <View>
              <Text style={styles.cartBarCount}>{count} item{count > 1 ? 's' : ''}</Text>
              <Text style={styles.cartBarTotal}>{fmt(total)}</Text>
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

const RAIL_W = 92;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 10,
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
    marginBottom: 8,
  },
  title: { ...typography.h2, color: colors.text, fontWeight: '800' },
  subtitle: { ...typography.caption, color: colors.textSecondary },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  searchInput: { flex: 1, ...typography.body, color: colors.text, height: '100%' },

  body: { flex: 1, flexDirection: 'row', marginTop: spacing.sm },

  rail: { width: RAIL_W, flexGrow: 0 },
  railContent: { paddingVertical: spacing.sm },
  railItem: { alignItems: 'center', paddingVertical: 12 },
  railBar: {
    position: 'absolute',
    left: 0,
    top: 14,
    bottom: 14,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  railIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  railLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  railCount: { fontSize: 10, color: colors.textSecondary, marginTop: 1 },

  content: { flex: 1 },
  contentInner: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, gap: 12 },
  contentHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  contentTitle: { ...typography.h3, color: colors.text, fontWeight: '800' },
  contentCount: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },

  filterRow: { gap: 8, marginTop: 12, marginBottom: 8 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },

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
  rowImage: { width: 84, height: 84, borderRadius: 12, backgroundColor: '#F3F4F6' },
  off: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#16A34A',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  offText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  rowInfo: { flex: 1, justifyContent: 'space-between' },
  rowTop: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  rowName: { ...typography.caption, color: colors.text, fontWeight: '700' },
  brandText: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingText: { fontSize: 11, color: colors.textSecondary },
  dotSeparator: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.border, marginHorizontal: 2 },
  stockText: { fontSize: 10, color: '#16A34A', fontWeight: '700' },
  outOfStock: { color: '#EF4444' },
  rowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  priceWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 5, flexShrink: 1 },
  price: { ...typography.body, color: colors.text, fontWeight: '800' },
  mrp: { fontSize: 10, color: colors.textSecondary, textDecorationLine: 'line-through' },

  addBtn: {
    height: 32,
    paddingHorizontal: 20,
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
    height: 32,
    paddingHorizontal: 3,
  },
  stepBtn: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  stepQty: { color: '#FFFFFF', fontWeight: '800', minWidth: 20, textAlign: 'center' },

  empty: { alignItems: 'center', paddingVertical: spacing.xl * 1.5 },
  emptyTitle: { ...typography.h3, color: colors.text, fontWeight: '800' },
  emptyText: { ...typography.body, color: colors.textSecondary, marginTop: 4 },

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