import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../src/theme';
import { useOrders } from '../../src/store/orderStore';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

export default function StoreOrders() {
  const router = useRouter();
  const allOrders = useOrders(s => s.orders);
  const orders = allOrders.filter(o => o.isStoreOrder);

  // Fallback to empty state or render the list
  if (orders.length === 0) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <View style={[styles.header, { paddingTop: TOP, position: 'absolute', top: 0, left: 0, right: 0 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Past Bulk Orders</Text>
          <View style={{ width: 40 }} />
        </View>
        <Ionicons name="receipt-outline" size={64} color="#E5E7EB" style={{ marginBottom: 16 }} />
        <Text style={{ ...typography.h3, color: colors.textSecondary }}>No orders yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: TOP }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Past Bulk Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {orders.map((order, i) => {
          let statusColor = '#3B82F6';
          if (order.status === 'Delivered') statusColor = '#16A34A';
          if (order.status === 'Cancelled') statusColor = '#EF4444';

          const totalItems = order.items.reduce((acc, item) => acc + item.qty, 0);

          return (
            <Animated.View key={order.id} entering={FadeInDown.delay(i * 100).springify()}>
              <Pressable
                style={styles.card}
                onPress={() => router.push(`/(store)/order/${order.id}`)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.orderId}>#{order.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
                    <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
                  </View>
                </View>
                
                <View style={styles.cardBody}>
                  <View>
                    <Text style={styles.grayText}>Date</Text>
                    <Text style={styles.boldText}>{order.date}</Text>
                  </View>
                  <View>
                    <Text style={styles.grayText}>Items</Text>
                    <Text style={styles.boldText}>{totalItems} items</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.grayText}>Total</Text>
                    <Text style={styles.totalText}>Rs. {order.total}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.viewDetails}>Re-order Items</Text>
                  <Ionicons name="refresh" size={16} color={colors.primary} />
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
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
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderId: { ...typography.body, fontWeight: '800', color: colors.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },

  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  grayText: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  boldText: { fontSize: 14, fontWeight: '700', color: colors.text },
  totalText: { fontSize: 15, fontWeight: '800', color: colors.primary },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  viewDetails: { fontSize: 14, fontWeight: '700', color: colors.primary, marginRight: 4 },
});
