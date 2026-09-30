import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, StatusBar, Pressable, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, radius } from '../../src/theme';
import { PRODUCTS, fmt, CATEGORIES } from '../../src/data/products';
import { useShop } from '../../src/store/cartStore';
import { Stepper } from '../../src/components/ui/Stepper';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

export default function StoreCatalog() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  
  const { cart, add, dec, setQty } = useShop();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    );
  }, [query, category]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: TOP }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Wholesale Catalog</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        
        <View style={styles.catRow}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={(c) => c.id}
            renderItem={({ item }) => (
              <Pressable 
                style={[styles.catPill, category === item.name && styles.catPillActive]}
                onPress={() => setCategory(item.name)}
              >
                <Text style={[styles.catPillText, category === item.name && styles.catPillTextActive]}>
                  {item.name}
                </Text>
              </Pressable>
            )}
            contentContainerStyle={{ gap: 8, paddingHorizontal: spacing.lg }}
          />
        </View>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const qty = cart[item.id] ?? 0;
          return (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.category}>{item.category.toUpperCase()}</Text>
                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                
                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.wholesalePrice}>{fmt(item.wholesalePrice || item.price)}</Text>
                    <Text style={styles.retailPrice}>Retail: {fmt(item.price)}</Text>
                  </View>
                  <View style={styles.minQtyBadge}>
                    <Text style={styles.minQtyText}>Min Qty: {item.minQty || 10}</Text>
                  </View>
                </View>
                
                {qty === 0 ? (
                  <Pressable 
                    style={({pressed}) => [styles.addBtn, pressed && { opacity: 0.8 }]}
                    onPress={() => setQty(item.id, item.minQty || 10)}
                  >
                    <Text style={styles.addBtnText}>Add Bulk to Cart</Text>
                  </Pressable>
                ) : (
                  <Stepper value={qty} onAdd={() => add(item.id)} onDec={() => dec(item.id)} size="md" />
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { 
    backgroundColor: '#FFFFFF', 
    paddingBottom: spacing.sm, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB' 
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerTitle: { ...typography.h2, color: colors.text, fontWeight: '800' },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: { flex: 1, ...typography.body, color: colors.text },
  
  catRow: { paddingBottom: spacing.sm },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  catPillActive: { backgroundColor: colors.primary },
  catPillText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  catPillTextActive: { color: '#FFFFFF' },

  listContent: { padding: spacing.lg, gap: spacing.md, paddingBottom: 100 },
  card: { 
    flexDirection: 'row',
    backgroundColor: '#FFFFFF', 
    borderRadius: radius.lg, 
    borderWidth: 1, 
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#F3F4F6',
  },
  info: {
    flex: 1,
    padding: 12,
  },
  category: { fontSize: 10, color: colors.textSecondary, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  name: { ...typography.subtitle, color: colors.text, fontWeight: '700', marginBottom: 8 },
  priceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 12 
  },
  wholesalePrice: { ...typography.h3, color: colors.primary, fontWeight: '800' },
  retailPrice: { fontSize: 11, color: colors.textSecondary, textDecorationLine: 'line-through', marginTop: 2 },
  minQtyBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  minQtyText: { fontSize: 10, color: '#B45309', fontWeight: '800' },
  
  addBtn: {
    height: 36,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
});
