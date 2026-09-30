import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Platform, StatusBar, Pressable, ScrollView, Linking,
  Alert, TextInput, LayoutAnimation, UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../src/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

// ---- Edit these to match the shop ----
const PHONE = '+9779800000000';
const PHONE_DISPLAY = '+977 980-0000000';
const WHATSAPP = '9779800000000'; // digits only, with country code
const EMAIL = 'support@bhairahawalighthouse.com';
const OPEN_HOUR = 9;  // 9 AM
const CLOSE_HOUR = 19; // 7 PM
const CLOSED_DAY = 6; // Saturday (0 = Sunday). Use -1 for open every day.

const FAQS = [
  { q: 'How long does delivery take?', a: 'Delivery usually takes 1-3 business days within the local area.', icon: 'bicycle' },
  { q: 'Do you offer wholesale pricing?', a: 'Yes! If you are a retailer, please contact our support team to upgrade your account to a Wholesale Partner.', icon: 'pricetags' },
  { q: 'What is the return policy?', a: 'Unopened products can be returned within 7 days of delivery with the original receipt.', icon: 'return-down-back' },
  { q: 'How can I track my order?', a: 'Open Profile → My Orders to see the live status of every order you have placed.', icon: 'navigate' },
  { q: 'Which payment methods do you accept?', a: 'We accept cash on delivery. Contact us if you need other payment options.', icon: 'card' },
  { q: 'Do products come with a warranty?', a: 'Most electrical items carry a manufacturer warranty. Keep your receipt and contact us if something is faulty.', icon: 'shield-checkmark' },
] as const;

// Current time in Nepal (UTC+5:45), independent of the device timezone
function getShopStatus() {
  const now = new Date();
  const np = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + (5 * 60 + 45) * 60000);
  const open = np.getDay() !== CLOSED_DAY && np.getHours() >= OPEN_HOUR && np.getHours() < CLOSE_HOUR;
  return open;
}

async function safeOpen(url: string, fallbackMsg: string) {
  try {
    const ok = await Linking.canOpenURL(url);
    if (!ok) throw new Error('unsupported');
    await Linking.openURL(url);
  } catch {
    Alert.alert('Unable to open', fallbackMsg);
  }
}

function ActionTile({ icon, label, color, onPress }: { icon: any; label: string; color: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }]}
    >
      <View style={[styles.tileIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.tileLabel}>{label}</Text>
    </Pressable>
  );
}

export default function Support() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const isOpen = getShopStatus();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS.map((f, i) => ({ ...f, i }));
    return FAQS.map((f, i) => ({ ...f, i })).filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [query]);

  const toggle = (i: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIdx(prev => (prev === i ? null : i));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: TOP }]}>
        <Pressable
          onPress={() => router.navigate('/(customer)/profile')}
          style={styles.backBtn}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="headset" size={30} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>How can we help?</Text>
            <Text style={styles.heroText}>Questions about an order or a product? We're a message away.</Text>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.tileRow}>
          <ActionTile
            icon="call" label="Call" color={colors.primary}
            onPress={() => safeOpen(`tel:${PHONE}`, `Please dial ${PHONE_DISPLAY} manually.`)}
          />
          <ActionTile
            icon="logo-whatsapp" label="WhatsApp" color="#25D366"
            onPress={() => safeOpen(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hello Bhairahawa Light House, I need help with...')}`, 'WhatsApp is not available on this device.')}
          />
          <ActionTile
            icon="mail" label="Email" color="#F59E0B"
            onPress={() => safeOpen(`mailto:${EMAIL}?subject=${encodeURIComponent('Support request')}`, `Please email us at ${EMAIL}.`)}
          />
        </View>

        {/* Contact details + hours */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Contact Us</Text>
            <View style={[styles.badge, { backgroundColor: (isOpen ? '#16A34A' : '#DC2626') + '18' }]}>
              <View style={[styles.dot, { backgroundColor: isOpen ? '#16A34A' : '#DC2626' }]} />
              <Text style={[styles.badgeText, { color: isOpen ? '#16A34A' : '#DC2626' }]}>{isOpen ? 'Open now' : 'Closed'}</Text>
            </View>
          </View>

          <Pressable style={styles.contactRow} onPress={() => safeOpen(`tel:${PHONE}`, `Please dial ${PHONE_DISPLAY} manually.`)}>
            <View style={styles.iconBox}><Ionicons name="call" size={20} color={colors.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{PHONE_DISPLAY}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.contactRow} onPress={() => safeOpen(`mailto:${EMAIL}`, `Please email us at ${EMAIL}.`)}>
            <View style={styles.iconBox}><Ionicons name="mail" size={20} color={colors.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue} numberOfLines={1} adjustsFontSizeToFit>{EMAIL}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>

          <View style={[styles.contactRow, { marginBottom: 0 }]}>
            <View style={styles.iconBox}><Ionicons name="time" size={20} color={colors.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>Business hours</Text>
              <Text style={styles.contactValue}>Sun – Fri, 9:00 AM – 7:00 PM</Text>
            </View>
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Frequently Asked Questions</Text>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search questions"
              placeholderTextColor={colors.textSecondary}
              style={styles.searchInput}
              returnKeyType="search"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={10}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>

          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="help-circle-outline" size={36} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No matches. Try different words or contact us above.</Text>
            </View>
          ) : (
            filtered.map((f, idx) => {
              const expanded = openIdx === f.i;
              return (
                <View key={f.i} style={[styles.faqItem, idx === filtered.length - 1 && { borderBottomWidth: 0 }]}>
                  <Pressable
                    onPress={() => toggle(f.i)}
                    style={styles.faqHead}
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                  >
                    <View style={styles.faqIcon}><Ionicons name={f.icon as any} size={16} color={colors.primary} /></View>
                    <Text style={styles.faqQ}>{f.q}</Text>
                    <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
                  </Pressable>
                  {expanded && <Text style={styles.faqA}>{f.a}</Text>}
                </View>
              );
            })
          )}
        </View>

        <Text style={styles.footer}>Bhairahawa Light House · We usually reply within a few hours</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { padding: spacing.xs, width: 32 },
  headerTitle: { ...typography.h3, color: colors.text, fontWeight: '700' },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.lg * 2 },

  hero: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primary, padding: spacing.lg, borderRadius: 16 },
  heroIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  heroTitle: { ...typography.h3, color: '#fff', fontWeight: '800' },
  heroText: { ...typography.caption, color: 'rgba(255,255,255,0.9)', marginTop: 2, lineHeight: 18 },

  tileRow: { flexDirection: 'row', gap: spacing.md },
  tile: { flex: 1, alignItems: 'center', backgroundColor: colors.surface, paddingVertical: spacing.md, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  tileIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  tileLabel: { ...typography.caption, color: colors.text, fontWeight: '600' },

  card: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  cardTitle: { ...typography.subtitle, color: colors.text, fontWeight: '700' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  badgeText: { fontSize: 12, fontWeight: '700' },

  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  contactLabel: { ...typography.caption, color: colors.textSecondary },
  contactValue: { ...typography.body, color: colors.text, fontWeight: '600' },

  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: spacing.md, height: 44, marginTop: spacing.sm, marginBottom: spacing.sm },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 0 },

  faqItem: { borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.md },
  faqHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  faqIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  faqQ: { ...typography.body, flex: 1, color: colors.text, fontWeight: '700' },
  faqA: { ...typography.caption, color: colors.textSecondary, lineHeight: 20, marginTop: spacing.sm, marginLeft: 28 + spacing.md },

  empty: { alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.xs },
  emptyText: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },

  footer: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
});