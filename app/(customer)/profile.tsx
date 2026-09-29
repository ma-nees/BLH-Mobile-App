import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../src/theme';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/store/authStore';
import { useShop, selectCount, selectFavCount } from '../../src/store/cartStore';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 32;

type MenuItem = {
  icon: string;
  label: string;
  hint?: string;
  color: string;
  onPress: () => void;
};

const soon = (what: string) => () => Alert.alert(what, 'This section is coming soon.');

export default function Profile() {
  const router = useRouter();
  const user = useAuthStore((s: any) => s.user);
  const setUser = useAuthStore((s: any) => s.setUser);
  const cartCount = useShop(selectCount);
  const favCount = useShop(selectFavCount);
  const clearCart = useShop((s) => s.clear);

  const [notifications, setNotifications] = useState(true);

  const fullName: string =
    user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Guest';
  const email: string = user?.email ?? '';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0].toUpperCase())
    .join('');

  const account: MenuItem[] = [
    { icon: 'receipt-outline', label: 'My Orders', hint: 'Track and reorder', color: '#3B82F6', onPress: () => router.push('/(customer)/orders') },
    { icon: 'heart-outline', label: 'Wishlist', hint: `${favCount} saved`, color: '#EF4444', onPress: () => router.push('/(customer)/wishlist') },
    { icon: 'location-outline', label: 'Saved Addresses', color: '#10B981', onPress: soon('Saved Addresses') },
    { icon: 'card-outline', label: 'Payment Methods', color: '#8B5CF6', onPress: soon('Payment Methods') },
  ];

  const support: MenuItem[] = [
    { icon: 'help-buoy-outline', label: 'Help & Support', color: '#F59E0B', onPress: soon('Help & Support') },
    { icon: 'document-text-outline', label: 'Terms of Service', color: '#6366F1', onPress: () => router.push('/terms') },
    { icon: 'shield-checkmark-outline', label: 'Privacy Policy', color: '#0EA5E9', onPress: () => router.push('/privacy') },
  ];

  const logout = () =>
    Alert.alert('Log out?', 'You will need to sign in again to shop.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          if (!useAuthStore.getState().isDummy) {
            await supabase.auth.signOut();
          }
          clearCart();
          setUser(null);
          router.replace('/');
        },
      },
    ]);

  const renderGroup = (title: string, items: MenuItem[], delay: number) => (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.groupCard}>
        {items.map((m, i) => (
          <Pressable
            key={m.label}
            style={[styles.menuRow, i < items.length - 1 && styles.menuRowBorder]}
            onPress={m.onPress}
          >
            <View style={[styles.menuIcon, { backgroundColor: `${m.color}18` }]}>
              <Ionicons name={m.icon as any} size={20} color={m.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>{m.label}</Text>
              {m.hint ? <Text style={styles.menuHint}>{m.hint}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} bounces={false}>
        {/* Hero */}
        <View style={[styles.hero, { paddingTop: TOP }]}>
          <View style={styles.circleLarge} />
          <View style={styles.circleSmall} />

          <Animated.View entering={FadeIn.delay(100)} style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || '?'}</Text>
          </Animated.View>
          <Animated.Text entering={FadeIn.delay(200)} style={styles.name}>
            {fullName}
          </Animated.Text>
          {email ? (
            <Animated.Text entering={FadeIn.delay(300)} style={styles.email}>
              {email}
            </Animated.Text>
          ) : null}
        </View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.stats}>
          <Pressable style={styles.stat} onPress={() => router.push('/(customer)/cart')}>
            <Text style={styles.statNum}>{cartCount}</Text>
            <Text style={styles.statLabel}>In cart</Text>
          </Pressable>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{favCount}</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>0</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </Animated.View>

        {renderGroup('Account', account, 250)}

        {/* Preferences */}
        <Animated.View entering={FadeInDown.delay(350).springify()} style={styles.group}>
          <Text style={styles.groupTitle}>Preferences</Text>
          <View style={styles.groupCard}>
            <View style={styles.menuRow}>
              <View style={[styles.menuIcon, { backgroundColor: '#F59E0B18' }]}>
                <Ionicons name="notifications-outline" size={20} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>Order notifications</Text>
                <Text style={styles.menuHint}>Offers and delivery updates</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#D1D5DB', true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </Animated.View>

        {renderGroup('Support & Legal', support, 450)}

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(550).springify()} style={styles.group}>
          <Pressable style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
          <Text style={styles.version}>Bhairahawa Light House · v1.0.0</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scroll: { paddingBottom: 120 },

  hero: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingBottom: 80,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  circleLarge: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -80,
    right: -70,
  },
  circleSmall: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -30,
    left: -40,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.35)',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarText: { fontSize: 34, fontWeight: '800', color: colors.primary },
  name: { ...typography.h2, color: '#FFFFFF', fontWeight: '800', textAlign: 'center' },
  email: { ...typography.body, color: 'rgba(255,255,255,0.78)', marginTop: 2 },

  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: -44,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: colors.primary },
  statLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: colors.border },

  group: { marginTop: spacing.lg, paddingHorizontal: spacing.lg },
  groupTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: spacing.md },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { ...typography.body, color: colors.text, fontWeight: '700' },
  menuHint: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  logoutText: { color: '#EF4444', fontWeight: '800', fontSize: 15 },
  version: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md },
});