import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../../src/theme';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

export default function CheckoutSuccess() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.content}>
        <Animated.View entering={ZoomIn.duration(600).springify()} style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={100} color="#16A34A" />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={{ alignItems: 'center', marginTop: 24 }}>
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.desc}>
            Your order #{id ?? 'BLH-10293'} has been placed successfully. You will receive an email confirmation shortly.
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.footer}>
        <Pressable style={styles.homeBtn} onPress={() => router.replace('/(customer)/home')}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </Pressable>
        <Pressable style={styles.ordersBtn} onPress={() => router.replace('/(customer)/profile')}>
          <Text style={styles.ordersBtnText}>View Orders</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  iconWrap: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { ...typography.h2, color: colors.text, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  desc: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, textAlign: 'center', paddingHorizontal: spacing.lg },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.xl,
  },
  homeBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  homeBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  ordersBtn: {
    backgroundColor: '#F3F4F6',
    height: 52,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ordersBtnText: { color: colors.text, fontWeight: '800', fontSize: 16 },
});
