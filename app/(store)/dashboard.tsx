import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../src/theme';
import { fmt } from '../../src/data/products';
import { LinearGradient } from 'expo-linear-gradient';

/* ---- Mock data: replace with real store data later ---- */
const MOCK = {
  storeName: 'ElectroMart Wholesale',
  spentThisMonth: 42500,
  trendPct: 12,
  bulkOrders: 14,
  tier: 2,
  nextTierTarget: 60000,
  discountPct: 5,
  discountMin: 20000,
};
const SUPPORT_EMAIL = 'support@bhairahawalighthouse.com';

const QUICK_ACTIONS = [
  { id: '1', title: 'Quick Re-order', sub: 'From last shipment', icon: 'refresh', route: '/(store)/orders', color: colors.primary },
  { id: '2', title: 'Price List', sub: 'Download PDF', icon: 'document-text', route: '', color: '#F59E0B' },
  { id: '3', title: 'Credit Limit', sub: 'Request increase', icon: 'card', route: '', color: '#10B981' },
  { id: '4', title: 'Priority Support', sub: 'Raise a ticket', icon: 'headset', route: '', color: '#8B5CF6' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = Date.now();
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4); // Quartic ease out
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function ActionTile({ action, onPress, index }: { action: (typeof QUICK_ACTIONS)[number]; onPress: () => void; index: number }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  
  return (
    <Animated.View entering={FadeInDown.delay(350 + index * 80).springify()} style={[styles.actionWrap, style]}>
      <Pressable
        style={styles.actionBtn}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.95, { damping: 15, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 200 }); }}
      >
        <View style={styles.actionTop}>
          <View style={[styles.iconWrap, { backgroundColor: action.color + '15' }]}>
            <Ionicons name={action.icon as any} size={24} color={action.color} />
          </View>
        </View>
        <Text style={styles.actionText}>{action.title}</Text>
        <Text style={styles.actionSub}>{action.sub}</Text>
      </Pressable>
    </Animated.View>
  );
}

// Micro chart component for Spent this month
function MiniChart() {
  const heights = [40, 65, 30, 80, 50, 95, 75];
  return (
    <View style={styles.chartContainer}>
      {heights.map((h, i) => {
        const heightVal = useSharedValue(0);
        useEffect(() => {
          heightVal.value = withDelay(i * 100 + 400, withSpring(h, { damping: 12, stiffness: 100 }));
        }, []);
        
        const style = useAnimatedStyle(() => ({
          height: `${heightVal.value}%`,
          opacity: interpolate(heightVal.value, [0, h], [0, 1])
        }));
        
        return (
          <View key={i} style={styles.chartBarWrapper}>
            <Animated.View style={[styles.chartBar, style, i === heights.length - 1 && styles.chartBarActive]} />
          </View>
        );
      })}
    </View>
  );
}

export default function StoreDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const spent = useCountUp(MOCK.spentThisMonth);
  const orders = useCountUp(MOCK.bulkOrders, 800);

  const progressTarget = Math.min(MOCK.spentThisMonth / MOCK.nextTierTarget, 1);
  const remaining = Math.max(MOCK.nextTierTarget - MOCK.spentThisMonth, 0);

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(600, withTiming(progressTarget, { duration: 1500, easing: Easing.out(Easing.cubic) }));
  }, [progressTarget]);
  const barStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  const contactManager = async () => {
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Account manager request')}`;
    try {
      if (!(await Linking.canOpenURL(url))) throw new Error('unsupported');
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open mail', `Please email us at ${SUPPORT_EMAIL}.`);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 120 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Premium Hero Section */}
      <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.hero}>
        {/* Dynamic Background Gradients (Simulated with absolute views) */}
        <View style={[styles.heroBlob, { backgroundColor: '#4F46E5', top: -50, right: -50, width: 200, height: 200 }]} />
        <View style={[styles.heroBlob, { backgroundColor: '#EC4899', bottom: -50, left: -20, width: 150, height: 150, opacity: 0.6 }]} />
        
        {/* Glassmorphism Header overlay */}
        <View style={styles.glassHeader}>
          <View style={styles.headerTop}>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>{greeting()},</Text>
              <Text style={styles.storeName} numberOfLines={1}>{MOCK.storeName}</Text>
            </View>
            <View style={styles.storeAvatar}>
              <Text style={styles.storeAvatarText}>{MOCK.storeName.charAt(0)}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={10} color="#FFFFFF" />
              </View>
            </View>
          </View>
          
          <View style={styles.tierSection}>
            <View style={styles.tierHeader}>
              <View style={styles.tierPill}>
                <Ionicons name="diamond" size={12} color="#FBBF24" />
                <Text style={styles.tierPillText}>Tier {MOCK.tier} Partner</Text>
              </View>
              <Text style={styles.tierPercent}>{Math.round(progressTarget * 100)}%</Text>
            </View>
            
            <View style={styles.track}>
              <Animated.View style={[styles.fill, barStyle]}>
                <View style={styles.fillGlow} />
              </Animated.View>
            </View>
            
            <Text style={styles.tierHint}>
              {remaining > 0
                ? `Spend ${fmt(remaining)} more this month to reach Tier ${MOCK.tier + 1}`
                : `You have reached Tier ${MOCK.tier + 1} spending this month`}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Animated.View entering={FadeInDown.delay(200).springify()} style={[styles.statCard, styles.statCardLarge]}>
          <View style={styles.statTop}>
            <View>
              <Text style={styles.statLabel}>Spent This Month</Text>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>{fmt(spent)}</Text>
            </View>
            <View style={styles.trendChip}>
              <Ionicons name="trending-up" size={12} color="#059669" />
              <Text style={styles.trendText}>+{MOCK.trendPct}%</Text>
            </View>
          </View>
          <MiniChart />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={[styles.statCard, styles.statCardSmall]}>
          <View style={[styles.statIcon, { backgroundColor: '#8B5CF615' }]}>
            <Ionicons name="cube" size={20} color="#8B5CF6" />
          </View>
          <Text style={styles.statValueSmall}>{orders}</Text>
          <Text style={styles.statLabelSmall}>Bulk Orders</Text>
          <Pressable style={styles.linkArrow} onPress={() => router.push('/(store)/orders' as any)}>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </Pressable>
        </Animated.View>
      </View>

      {/* Quick Actions */}
      <Animated.Text entering={FadeInDown.delay(400).springify()} style={styles.sectionTitle}>
        Quick Actions
      </Animated.Text>
      <View style={styles.actionGrid}>
        {QUICK_ACTIONS.map((action, i) => (
          <ActionTile key={action.id} action={action} index={i} onPress={() => action.route ? router.push(action.route as any) : Alert.alert('Coming Soon', 'This feature is being rolled out to store accounts.')} />
        ))}
      </View>

      {/* Benefits */}
      <Animated.Text entering={FadeInDown.delay(700).springify()} style={styles.sectionTitle}>
        Your Perks
      </Animated.Text>
      <Animated.View entering={FadeInDown.delay(750).springify()} style={styles.benefitCard}>
        <View style={styles.benefitIcon}>
          <Ionicons name="flash" size={24} color="#F59E0B" />
        </View>
        <View style={styles.benefitTextWrap}>
          <Text style={styles.benefitTitle}>Tier {MOCK.tier} Pricing Active</Text>
          <Text style={styles.benefitDesc}>
            Enjoy an extra <Text style={{fontWeight: '800'}}>{MOCK.discountPct}% off</Text> all wiring products on orders above {fmt(MOCK.discountMin)}.
          </Text>
        </View>
      </Animated.View>

      {/* Support */}
      <Animated.View entering={FadeInDown.delay(800).springify()}>
        <Pressable
          style={({ pressed }) => [styles.supportBtn, pressed && { transform: [{ scale: 0.98 }] }]}
          onPress={contactManager}
        >
          <View style={styles.supportIcon}>
            <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.supportText}>Contact Account Manager</Text>
            <Text style={styles.supportSub}>Priority pricing & delivery help</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F6F9' },
  container: { padding: spacing.lg, paddingTop: spacing.xl },

  // Premium Hero
  hero: {
    backgroundColor: '#0F172A',
    borderRadius: 32,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 15,
  },
  heroBlob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.7,
    filter: 'blur(40px)', // Web/Newer React Native support
  },
  glassHeader: {
    padding: spacing.xl,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl },
  headerText: { flex: 1 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 4, fontWeight: '500' },
  storeName: { fontSize: 24, color: '#FFFFFF', fontWeight: '900', letterSpacing: -0.5 },
  
  storeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeAvatarText: { fontSize: 26, fontWeight: '800', color: '#FFFFFF' },
  verifiedBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#10B981',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0F172A',
  },

  // Tier Section
  tierSection: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tierHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  tierPillText: { color: '#FCD34D', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  tierPercent: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  
  track: { height: 10, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.3)', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5, backgroundColor: '#FBBF24', overflow: 'hidden' },
  fillGlow: { position: 'absolute', top: 0, bottom: 0, right: 0, width: 40, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 5 },
  tierHint: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 12, fontWeight: '500' },

  // Stats
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 3,
  },
  statCardLarge: { flex: 1.8 },
  statCardSmall: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  
  statTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg },
  statLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600', marginBottom: 4 },
  statValue: { fontSize: 26, color: colors.text, fontWeight: '900', letterSpacing: -0.5 },
  
  trendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  trendText: { fontSize: 11, fontWeight: '800', color: '#059669' },
  
  // Mini Chart
  chartContainer: { height: 60, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6 },
  chartBarWrapper: { flex: 1, height: '100%', justifyContent: 'flex-end', backgroundColor: '#F3F4F6', borderRadius: 6 },
  chartBar: { width: '100%', backgroundColor: '#CBD5E1', borderRadius: 6 },
  chartBarActive: { backgroundColor: colors.primary },

  // Small Stat
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  statValueSmall: { fontSize: 24, color: colors.text, fontWeight: '900' },
  statLabelSmall: { fontSize: 12, color: colors.textSecondary, fontWeight: '600', marginTop: 4 },
  linkArrow: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Quick actions
  sectionTitle: { fontSize: 18, color: colors.text, fontWeight: '900', marginBottom: spacing.md, paddingLeft: 4 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xxl },
  actionWrap: { width: '47.5%', flexGrow: 1 },
  actionBtn: {
    backgroundColor: '#FFFFFF',
    padding: spacing.lg,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
  },
  actionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  iconWrap: { width: 52, height: 52, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  actionText: { fontSize: 15, color: colors.text, fontWeight: '800', marginBottom: 4 },
  actionSub: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },

  // Benefits
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.lg,
    borderRadius: 24,
    marginBottom: spacing.xl,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  benefitIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  benefitTextWrap: { flex: 1 },
  benefitTitle: { fontSize: 16, color: '#92400E', fontWeight: '900', marginBottom: 4 },
  benefitDesc: { fontSize: 13, color: '#B45309', lineHeight: 20, paddingRight: spacing.sm },

  // Support
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 5,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportText: { fontSize: 15, color: '#FFFFFF', fontWeight: '800', marginBottom: 4 },
  supportSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
});