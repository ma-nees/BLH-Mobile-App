import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
  TextInput,
  Image,
  Pressable,
  Dimensions,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, radius } from '../../src/theme';
import { useAuthStore } from '../../src/store/authStore';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  SlideInDown,
  SlideOutDown,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';

import { CATEGORIES, Product, PRODUCTS, CURRENCY, fmt, discountPct } from '../../src/data/products';
import { useShop, selectCount, selectTotal } from '../../src/store/cartStore';
import { Skeleton } from '../../src/components/ui/Skeleton';
import { Stepper } from '../../src/components/ui/Stepper';

const { width } = Dimensions.get('window');
const TOP_PADDING = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 32;

const H_PAD = spacing.lg;
const BANNER_W = width - H_PAD * 2;
const BANNER_GAP = 12;
const GRID_GAP = 12;
const CARD_W = (width - H_PAD * 2 - GRID_GAP) / 2;



const BANNERS = [
  { id: 'b1', tag: 'FESTIVAL OFFER', title: 'Get 20% Off', subtitle: 'On all decorative lighting', bg: colors.primary, icon: 'flash' },
  { id: 'b2', tag: 'NEW ARRIVALS', title: 'Smart Switches', subtitle: 'Control your home from your phone', bg: '#0F766E', icon: 'toggle' },
  { id: 'b3', tag: 'BULK ORDERS', title: 'Wiring Deals', subtitle: 'Save more on cables and MCBs', bg: '#7C2D12', icon: 'git-network' },
];

const TRUST = [
  { icon: 'shield-checkmark-outline', label: 'Genuine\nProducts' },
  { icon: 'flash-outline', label: 'Fast\nDelivery' },
  { icon: 'refresh-outline', label: 'Easy\nReturns' },
];
const pad = (n: number) => n.toString().padStart(2, '0');

function secondsToMidnight() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
}

function useCountdown() {
  const [left, setLeft] = useState(secondsToMidnight());
  useEffect(() => {
    const t = setInterval(() => setLeft(secondsToMidnight()), 1000);
    return () => clearInterval(t);
  }, []);
  return { h: pad(Math.floor(left / 3600)), m: pad(Math.floor((left % 3600) / 60)), s: pad(left % 60) };
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function HomeSkeleton() {
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: TOP_PADDING }]}>
        <View style={styles.headerTop}>
          <Skeleton width={180} height={28} />
          <Skeleton width={100} height={32} borderRadius={16} />
        </View>
        <Skeleton width="100%" height={52} borderRadius={16} style={{ marginTop: 10 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Skeleton width="100%" height={168} borderRadius={24} style={{ marginBottom: spacing.xl }} />
        
        <Skeleton width={140} height={24} style={{ marginBottom: spacing.md }} />
        <View style={[styles.catRow, { flexDirection: 'row', overflow: 'hidden' }]}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.categoryItem}>
              <Skeleton width={62} height={62} borderRadius={31} style={{ marginBottom: 6 }} />
              <Skeleton width={48} height={12} />
            </View>
          ))}
        </View>

        <Skeleton width={160} height={24} style={{ marginTop: spacing.xl, marginBottom: spacing.md }} />
        <View style={styles.grid}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={[styles.productCard, { width: CARD_W, paddingBottom: 10 }]}>
              <Skeleton width="100%" height={128} borderRadius={0} />
              <View style={{ padding: 10 }}>
                <Skeleton width={60} height={10} style={{ marginBottom: 8 }} />
                <Skeleton width="100%" height={14} style={{ marginBottom: 4 }} />
                <Skeleton width="80%" height={14} style={{ marginBottom: 12 }} />
                <Skeleton width={70} height={18} style={{ marginBottom: 14 }} />
                <Skeleton width="100%" height={34} borderRadius={10} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- Product card ---------- */
function ProductCard({
  product,
  qty,
  fav,
  cardWidth,
  onAdd,
  onDec,
  onFav,
  onPressCard,
}: {
  product: Product;
  qty: number;
  fav: boolean;
  cardWidth: number;
  onAdd: () => void;
  onDec: () => void;
  onFav: () => void;
  onPressCard?: () => void;
}) {
  const off = discountPct(product);
  return (
    <Pressable style={[styles.productCard, { width: cardWidth }]} onPress={onPressCard}>
      <View>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        {off > 0 && (
          <View style={styles.offBadge}>
            <Text style={styles.offText}>{off}% OFF</Text>
          </View>
        )}
        <Pressable style={styles.favBtn} onPress={onFav} hitSlop={8}>
          <Ionicons
            name={fav ? 'heart' : 'heart-outline'}
            size={18}
            color={fav ? '#EF4444' : colors.textSecondary}
          />
        </Pressable>
        {product.tag ? (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{product.tag}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{product.category.toUpperCase()}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.ratingRow}>
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={10} color="#FFFFFF" />
            <Text style={styles.ratingPillText}>{product.rating}</Text>
          </View>
          <Text style={styles.reviewsText}>({product.reviews})</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>{fmt(product.price)}</Text>
          <Text style={styles.productMrp}>{fmt(product.mrp)}</Text>
        </View>

        {qty === 0 ? (
          <Pressable style={styles.addBtn} onPress={onAdd}>
            <Text style={styles.addBtnText}>ADD</Text>
          </Pressable>
        ) : (
          <Stepper value={qty} onAdd={onAdd} onDec={onDec} size="md" />
        )}
      </View>
    </Pressable>
  );
}

/* ---------- Screen ---------- */
export default function CustomerHome() {
  const router = useRouter();
  const user = useAuthStore((s: any) => s.user);
  const firstName: string =
    user?.user_metadata?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Shopper';

  const { cart, favs, add, dec, toggleFav } = useShop();
  const cartCount = useShop(selectCount);
  const cartTotal = useShop(selectTotal);

  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [bannerIdx, setBannerIdx] = useState(0);

  const [dismissedCart, setDismissedCart] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(cartCount);

  // If cart count changes, we reset the dismissed state so it pops back up if they add a new item
  useEffect(() => {
    if (cartCount !== prevCartCount) {
      setDismissedCart(false);
      setPrevCartCount(cartCount);
    }
  }, [cartCount, prevCartCount]);

  const bannerRef = useRef<ScrollView>(null);
  const idxRef = useRef(0);
  const time = useCountdown();

  const searching = query.trim().length > 0;
  const browsing = searching || category !== 'All';

  // Auto-advance banners
  useEffect(() => {
    // Simulate network delay for skeleton loading
    const loader = setTimeout(() => setIsLoading(false), 1500);

    if (browsing) return () => clearTimeout(loader);
    idxRef.current = 0;
    setBannerIdx(0);
    const t = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % BANNERS.length;
      bannerRef.current?.scrollTo({ x: idxRef.current * (BANNER_W + BANNER_GAP), animated: true });
      setBannerIdx(idxRef.current);
    }, 4000);
    return () => {
      clearTimeout(loader);
      clearInterval(t);
    };
  }, [browsing]);

  const onBannerScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / (BANNER_W + BANNER_GAP));
    idxRef.current = i;
    if (i !== bannerIdx) setBannerIdx(i);
  };



  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    );
  }, [query, category]);

  const flashDeals = useMemo(
    () => [...PRODUCTS].sort((a, b) => discountPct(b) - discountPct(a)).slice(0, 5),
    []
  );

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => ({
    paddingBottom: interpolate(scrollY.value, [0, 80], [12, spacing.sm], 'clamp'),
    elevation: interpolate(scrollY.value, [0, 20], [0, 4], 'clamp'),
  }));

  const topStyle = useAnimatedStyle(() => ({
    height: interpolate(scrollY.value, [0, 60], [36, 0], 'clamp'),
    opacity: interpolate(scrollY.value, [0, 40], [1, 0], 'clamp'),
    marginBottom: interpolate(scrollY.value, [0, 60], [spacing.md, 0], 'clamp'),
    overflow: 'hidden',
  }));

  const openCart = () => router.push('/(customer)/cart');

  if (isLoading) return <HomeSkeleton />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Animated.View style={[styles.header, { paddingTop: TOP_PADDING }, headerStyle]}>
        <Animated.View style={[styles.headerTop, topStyle]}>
          <Animated.View entering={FadeIn.delay(100)} style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              {greeting()}, <Text style={styles.greetingName}>{firstName}</Text>
            </Text>
          </Animated.View>

          <View style={styles.locationWrap}>
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text style={styles.deliverPlace}>Bhairahawa</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bulbs, wires, switches..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {searching && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </Pressable>
          )}
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={[styles.scrollContent, cartCount > 0 ? { paddingBottom: 170 } : { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Banner carousel */}
        {!browsing && (
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
            <ScrollView
              ref={bannerRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={BANNER_W + BANNER_GAP}
              decelerationRate="fast"
              contentContainerStyle={{ gap: BANNER_GAP }}
              onScroll={onBannerScroll}
              scrollEventThrottle={16}
              directionalLockEnabled
              nestedScrollEnabled
            >
              {BANNERS.map((b) => (
                <View key={b.id} style={[styles.banner, { backgroundColor: b.bg, width: BANNER_W }]}>
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerTag}>{b.tag}</Text>
                    <Text style={styles.bannerTitle}>{b.title}</Text>
                    <Text style={styles.bannerSubtitle}>{b.subtitle}</Text>
                    <Pressable style={styles.bannerBtn} onPress={() => setCategory('Lighting')}>
                      <Text style={[styles.bannerBtnText, { color: b.bg }]}>Shop Now</Text>
                    </Pressable>
                  </View>
                  <Ionicons name={b.icon as any} size={110} color="rgba(255,255,255,0.14)" style={styles.bannerIcon} />
                </View>
              ))}
            </ScrollView>
            <View style={styles.dots}>
              {BANNERS.map((b, i) => (
                <View key={b.id} style={[styles.dot, i === bannerIdx && styles.dotActive]} />
              ))}
            </View>
          </Animated.View>
        )}

        {/* Categories */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catRow}
            directionalLockEnabled
            nestedScrollEnabled
          >
            {CATEGORIES.map((cat) => {
              const active = category === cat.name;
              return (
                <Pressable key={cat.id} style={styles.categoryItem} onPress={() => setCategory(cat.name)}>
                  <View
                    style={[
                      styles.categoryIconWrap,
                      { backgroundColor: `${cat.color}15` },
                      active && { backgroundColor: cat.color },
                    ]}
                  >
                    <Ionicons name={cat.icon as any} size={26} color={active ? '#FFFFFF' : cat.color} />
                  </View>
                  <Text style={[styles.categoryName, active && styles.categoryNameActive]}>{cat.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Trust strip */}
        {!browsing && (
          <Animated.View entering={FadeInDown.delay(450).springify()} style={styles.trustStrip}>
            {TRUST.map((t) => (
              <View key={t.icon} style={styles.trustItem}>
                <Ionicons name={t.icon as any} size={22} color={colors.primary} />
                <Text style={styles.trustText}>{t.label}</Text>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Flash deals */}
        {!browsing && (
          <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.flashTitleWrap}>
                <Ionicons name="flash" size={20} color="#F59E0B" />
                <Text style={styles.sectionTitleInline}>Flash Deals</Text>
              </View>
              <View style={styles.timer}>
                {[time.h, time.m, time.s].map((v, i) => (
                  <React.Fragment key={i}>
                    <View style={styles.timerBox}>
                      <Text style={styles.timerText}>{v}</Text>
                    </View>
                    {i < 2 && <Text style={styles.timerColon}>:</Text>}
                  </React.Fragment>
                ))}
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flashScroll}
              directionalLockEnabled
              nestedScrollEnabled
            >
              {flashDeals.map((p, i) => (
                <Animated.View key={p.id} entering={FadeInRight.delay(550 + i * 90).springify()}>
                  <ProductCard
                    product={p}
                    qty={cart[p.id] ?? 0}
                    fav={!!favs[p.id]}
                    cardWidth={CARD_W}
                    onAdd={() => add(p.id)}
                    onDec={() => dec(p.id)}
                    onFav={() => toggleFav(p.id)}
                    onPressCard={() => router.push(`/(customer)/product/${p.id}`)}
                  />
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Product grid */}
        <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleInline}>
              {searching ? 'Search Results' : category === 'All' ? 'Popular Products' : category}
            </Text>
            <Text style={styles.countText}>{visible.length} items</Text>
          </View>

          {visible.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="search" size={44} color={colors.textSecondary} style={{ marginBottom: spacing.sm }} />
              <Text style={styles.emptyTitle}>Nothing found</Text>
              <Text style={styles.emptyText}>Try a different keyword or category.</Text>
              <Pressable
                style={styles.emptyBtn}
                onPress={() => {
                  setQuery('');
                  setCategory('All');
                }}
              >
                <Text style={styles.emptyBtnText}>Clear filters</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.grid}>
              {visible.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  qty={cart[p.id] ?? 0}
                  fav={!!favs[p.id]}
                  cardWidth={CARD_W}
                  onAdd={() => add(p.id)}
                  onDec={() => dec(p.id)}
                  onFav={() => toggleFav(p.id)}
                  onPressCard={() => router.push(`/(customer)/product/${p.id}`)}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </Animated.ScrollView>

      {/* Floating cart bar */}
      {/* Floating cart bar */}
      {!dismissedCart && cartCount > 0 && (
        <Animated.View entering={SlideInDown.springify()} exiting={SlideOutDown} style={styles.cartBar}>
          <Pressable style={styles.cartBarInner} onPress={openCart}>
            <View style={styles.cartBarLeft}>
              <View style={styles.cartBarIcon}>
                <Ionicons name="bag-handle" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.cartBarCount}>
                  {cartCount} item{cartCount > 1 ? 's' : ''}
                </Text>
                <Text style={styles.cartBarTotal}>{fmt(cartTotal)}</Text>
              </View>
            </View>
            <View style={styles.cartBarRight}>
              <Text style={styles.cartBarCta}>View Cart</Text>
              <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
            </View>
          </Pressable>
          <Pressable
            style={styles.cartBarDismiss}
            onPress={() => setDismissedCart(true)}
          >
            <Ionicons name="close" size={20} color="rgba(255,255,255,0.8)" />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  // Header
  header: {
    paddingHorizontal: H_PAD,
    paddingBottom: spacing.lg,
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  locationWrap: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  deliverPlace: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  greeting: { ...typography.h3, color: colors.textSecondary, fontWeight: '600' },
  greetingName: { color: colors.text, fontWeight: '800' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: { flex: 1, ...typography.body, height: '100%', color: colors.text },

  scrollContent: { padding: H_PAD, paddingTop: spacing.lg },
  section: { marginBottom: spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h3, color: colors.text, fontWeight: '800', marginBottom: spacing.md },
  sectionTitleInline: { ...typography.h3, color: colors.text, fontWeight: '800' },
  countText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },

  // Banner
  banner: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
    height: 175,
    justifyContent: 'center',
  },
  bannerContent: { zIndex: 2 },
  bannerTag: { ...typography.caption, color: '#FFD54A', fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
  bannerTitle: { ...typography.h2, color: '#FFFFFF', fontWeight: '800', marginBottom: 4 },
  bannerSubtitle: { ...typography.caption, color: 'rgba(255,255,255,0.85)', marginBottom: spacing.md },
  bannerBtn: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: 999,
  },
  bannerBtnText: { ...typography.caption, fontWeight: '800' },
  bannerIcon: { position: 'absolute', right: -14, bottom: -18, transform: [{ rotate: '-15deg' }] },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' },
  dotActive: { width: 20, backgroundColor: colors.primary },

  // Categories
  catRow: { gap: 16, paddingRight: spacing.lg },
  categoryItem: { alignItems: 'center', width: 68 },
  categoryIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryName: { ...typography.caption, color: colors.textSecondary, fontWeight: '600', fontSize: 12 },
  categoryNameActive: { color: colors.primary, fontWeight: '800' },

  // Trust
  trustStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  trustItem: { alignItems: 'center', gap: 4 },
  trustText: { ...typography.caption, color: colors.textSecondary, fontSize: 11, textAlign: 'center', fontWeight: '600' },

  // Flash
  flashTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  timerBox: {
    backgroundColor: '#111827',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
    minWidth: 28,
    alignItems: 'center',
  },
  timerText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  timerColon: { color: '#111827', fontWeight: '800' },
  flashScroll: { gap: GRID_GAP, paddingRight: spacing.lg, paddingBottom: 6 },

  // Grid + product card
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  productImage: { width: '100%', height: 128, backgroundColor: '#F3F4F6' },
  offBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#16A34A',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  offText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(17,24,39,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: { color: '#FFD54A', fontSize: 10, fontWeight: '800' },
  productInfo: { padding: 10 },
  productCategory: { fontSize: 9, letterSpacing: 0.8, color: colors.textSecondary, fontWeight: '700', marginBottom: 2 },
  productName: { ...typography.caption, color: colors.text, fontWeight: '700', minHeight: 34 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingPillText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  reviewsText: { fontSize: 10, color: colors.textSecondary },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 6, marginBottom: 8 },
  productPrice: { ...typography.body, color: colors.text, fontWeight: '800' },
  productMrp: { fontSize: 11, color: colors.textSecondary, textDecorationLine: 'line-through' },

  addBtn: {
    height: 34,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: colors.primary, fontWeight: '800', fontSize: 13, letterSpacing: 0.5 },
  stepper: {
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  stepBtn: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  stepQty: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },

  // Empty
  empty: { alignItems: 'center', paddingVertical: spacing.xl * 1.5 },
  emptyTitle: { ...typography.h3, color: colors.text, fontWeight: '800' },
  emptyText: { ...typography.body, color: colors.textSecondary, marginTop: 4 },
  emptyBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  emptyBtnText: { color: '#FFFFFF', fontWeight: '700' },

  // Floating cart bar
  cartBar: { 
    position: 'absolute', 
    left: H_PAD, 
    right: H_PAD, 
    bottom: 100, // Lifted above the floating nav bar
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartBarInner: {
    flex: 1,
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
  cartBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cartBarIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBarCount: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  cartBarTotal: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  cartBarRight: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  cartBarCta: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  cartBarDismiss: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});