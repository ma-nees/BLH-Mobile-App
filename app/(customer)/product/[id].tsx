import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../../src/theme';
import { PRODUCTS, fmt, discountPct } from '../../../src/data/products';
import { useShop, selectCount } from '../../../src/store/cartStore';
import { Stepper } from '../../../src/components/ui/Stepper';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const product = PRODUCTS.find((p) => p.id === id);

  const { cart, favs, add, dec, toggleFav } = useShop();
  const count = useShop(selectCount);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(255, 255, 255, ${interpolate(scrollY.value, [0, 150], [0, 1], 'clamp')})`,
    borderBottomWidth: interpolate(scrollY.value, [100, 150], [0, 1], 'clamp'),
    borderBottomColor: colors.border,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [120, 180], [0, 1], 'clamp'),
  }));

  if (!product) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={typography.h3}>Product not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.primary, ...typography.body }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const qty = cart[product.id] ?? 0;
  const off = discountPct(product);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Sticky Animated Header */}
      <Animated.View style={[styles.header, { paddingTop: TOP }, headerStyle]}>
        <Pressable style={styles.headerBtn} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Animated.Text style={[styles.headerTitle, titleStyle]} numberOfLines={1}>
          {product.name}
        </Animated.Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerBtn} onPress={() => toggleFav(product.id)} hitSlop={12}>
            <Ionicons name={favs[product.id] ? "heart" : "heart-outline"} size={24} color={favs[product.id] ? "#EF4444" : colors.text} />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Image Gallery Mock */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.imageWrap}>
          <Image source={{ uri: product.image }} style={styles.image} />
          {off > 0 && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{off}% OFF</Text>
            </View>
          )}
        </Animated.View>

        {/* Info */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.info}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>BLH Premium</Text>
            <View style={[styles.stockBadge, product.id.length % 2 !== 0 && styles.outStockBadge]}>
              <Text style={[styles.stockText, product.id.length % 2 !== 0 && styles.outStockText]}>
                {product.id.length % 2 === 0 ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.sku}>SKU: BLH-{product.id.toUpperCase()}-2024</Text>

          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons key={s} name="star" size={14} color={s <= Math.round(product.rating) ? "#F59E0B" : "#E5E7EB"} />
              ))}
            </View>
            <Text style={styles.ratingText}>{product.rating} ({product.reviews} reviews)</Text>
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.price}>{fmt(product.price)}</Text>
            {off > 0 && <Text style={styles.mrp}>{fmt(product.mrp)}</Text>}
          </View>
        </Animated.View>

        <View style={styles.divider} />

        {/* Specifications */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specBox}>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Category</Text>
              <Text style={styles.specVal}>{product.category}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Warranty</Text>
              <Text style={styles.specVal}>1 Year</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Material</Text>
              <Text style={styles.specVal}>Polycarbonate / Metal</Text>
            </View>
            <View style={[styles.specRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.specKey}>Voltage</Text>
              <Text style={styles.specVal}>220-240V AC</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.divider} />

        {/* Description */}
        <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.desc}>
            High-quality electrical product designed for durability and optimal performance. Perfect for residential and commercial installations. This product meets all safety standards and offers a sleek, modern finish that blends into any environment seamlessly.
          </Text>
        </Animated.View>

        {/* Related Products */}
        {related.length > 0 && (
          <>
            <View style={styles.divider} />
            <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
              <Text style={styles.sectionTitle}>Similar Products</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: spacing.lg }}>
                {related.map((rp) => (
                  <Pressable key={rp.id} style={styles.relatedCard} onPress={() => router.replace(`/(customer)/product/${rp.id}`)}>
                    <Image source={{ uri: rp.image }} style={styles.relatedImg} />
                    <Text style={styles.relatedName} numberOfLines={2}>{rp.name}</Text>
                    <Text style={styles.relatedPrice}>{fmt(rp.price)}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </Animated.View>
          </>
        )}
      </Animated.ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomQty}>
          {qty === 0 ? (
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.bottomTotalLabel}>Total Price</Text>
              <Text style={styles.bottomTotal}>{fmt(product.price)}</Text>
            </View>
          ) : (
            <Stepper
              value={qty}
              onInc={() => add(product.id)}
              onDec={() => dec(product.id)}
              size={36}
            />
          )}
        </View>
        <Pressable 
          style={[styles.btnAction, qty > 0 ? { backgroundColor: colors.secondary } : {}]} 
          onPress={() => qty === 0 ? add(product.id) : router.push('/(customer)/cart')}
        >
          <Text style={[styles.btnActionText, qty > 0 && { color: colors.text }]}>
            {qty === 0 ? 'Add to Cart' : 'Go to Cart'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { flex: 1, textAlign: 'center', ...typography.h3, fontWeight: '800' },
  headerActions: { flexDirection: 'row', gap: 8 },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  
  imageWrap: { width: '100%', height: 320, backgroundColor: '#F3F4F6' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  tagBadge: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    backgroundColor: 'rgba(17,24,39,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: { color: '#FFD54A', fontSize: 12, fontWeight: '800' },

  info: { padding: spacing.lg },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  brand: { color: colors.primary, fontWeight: '700', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  stockBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  stockText: { color: '#16A34A', fontSize: 10, fontWeight: '800' },
  outStockBadge: { backgroundColor: '#FEE2E2' },
  outStockText: { color: '#EF4444' },
  
  name: { ...typography.h2, color: colors.text, fontWeight: '800', marginBottom: 4 },
  sku: { fontSize: 12, color: colors.textSecondary },
  
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  stars: { flexDirection: 'row', gap: 2, marginRight: 8 },
  ratingText: { ...typography.body, color: colors.textSecondary },

  priceBox: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 16 },
  price: { fontSize: 28, fontWeight: '800', color: colors.text },
  mrp: { fontSize: 16, color: colors.textSecondary, textDecorationLine: 'line-through' },

  divider: { height: 6, backgroundColor: '#F3F4F6' },
  
  section: { paddingVertical: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.text, fontWeight: '800', marginBottom: 12, paddingHorizontal: spacing.lg },
  desc: { ...typography.body, color: colors.textSecondary, lineHeight: 22, paddingHorizontal: spacing.lg },
  
  specBox: { marginHorizontal: spacing.lg, borderWidth: 1, borderColor: colors.border, borderRadius: 12, overflow: 'hidden' },
  specRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  specKey: { flex: 1, color: colors.textSecondary, fontWeight: '500' },
  specVal: { flex: 2, color: colors.text, fontWeight: '600' },

  relatedCard: { width: 140 },
  relatedImg: { width: 140, height: 140, borderRadius: 12, backgroundColor: '#F3F4F6', marginBottom: 8 },
  relatedName: { fontSize: 12, color: colors.text, fontWeight: '700', minHeight: 32 },
  relatedPrice: { fontSize: 14, color: colors.text, fontWeight: '800', marginTop: 4 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bottomQty: { flex: 1, paddingRight: 12 },
  bottomTotalLabel: { fontSize: 10, color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  bottomTotal: { fontSize: 18, fontWeight: '800', color: colors.text },
  btnAction: {
    flex: 1.5,
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActionText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
});
