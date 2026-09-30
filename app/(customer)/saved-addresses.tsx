import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, Pressable, ScrollView, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../src/theme';
import { useAddresses } from '../../src/store/addressStore';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

async function safeOpen(url: string, msg: string) {
  try {
    const ok = await Linking.canOpenURL(url);
    if (!ok) throw new Error('unsupported');
    await Linking.openURL(url);
  } catch {
    Alert.alert('Unable to open', msg);
  }
}

function ActionButton({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.6 }]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

export default function SavedAddresses() {
  const router = useRouter();
  const addresses = useAddresses(s => s.addresses);

  // Default address first, keep the rest in original order
  const sorted = useMemo(
    () => [...addresses].sort((a, b) => Number(!!b.isDefault) - Number(!!a.isDefault)),
    [addresses]
  );

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
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sorted.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="location-outline" size={40} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No saved addresses yet</Text>
            <Text style={styles.emptyText}>Addresses you save at checkout will show up here for faster ordering.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.count}>{sorted.length} saved {sorted.length === 1 ? 'address' : 'addresses'}</Text>

            {sorted.map((address) => {
              const cityLine = [address.city, [address.state, address.zip].filter(Boolean).join(' ')]
                .filter(Boolean)
                .join(', ');
              const fullAddress = [address.street, cityLine].filter(Boolean).join(', ');

              return (
                <View key={address.id} style={[styles.addressCard, address.isDefault && styles.defaultCard]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.nameRow}>
                      <View style={styles.iconBox}>
                        <Ionicons name={address.isDefault ? 'home' : 'location'} size={18} color={colors.primary} />
                      </View>
                      <Text style={styles.name} numberOfLines={1}>{address.name}</Text>
                    </View>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                        <Text style={styles.defaultText}>DEFAULT</Text>
                      </View>
                    )}
                  </View>

                  {!!address.phone && (
                    <View style={styles.line}>
                      <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.text}>{address.phone}</Text>
                    </View>
                  )}
                  <View style={styles.line}>
                    <Ionicons name="navigate-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.text, { flex: 1 }]}>{address.street}{'\n'}{cityLine}</Text>
                  </View>

                  <View style={styles.actions}>
                    {!!address.phone && (
                      <ActionButton
                        icon="call"
                        label="Call"
                        onPress={() => safeOpen(`tel:${address.phone}`, `Please dial ${address.phone} manually.`)}
                      />
                    )}
                    <ActionButton
                      icon="map"
                      label="View on map"
                      onPress={() =>
                        safeOpen(
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
                          'Could not open maps on this device.'
                        )
                      }
                    />
                  </View>
                </View>
              );
            })}
          </>
        )}
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
  count: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },

  emptyState: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl, marginTop: 40 },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  emptyTitle: { ...typography.subtitle, color: colors.text, fontWeight: '700' },
  emptyText: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' },

  addressCard: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  defaultCard: { borderColor: colors.primary, borderWidth: 1.5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm, gap: spacing.sm },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  iconBox: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  name: { ...typography.subtitle, color: colors.text, fontWeight: '600', flexShrink: 1 },
  defaultBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  defaultText: { fontSize: 10, fontWeight: '700', color: colors.primary },

  line: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: 6 },
  text: { ...typography.body, color: colors.textSecondary },

  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.primary + '12' },
  actionText: { fontSize: 13, fontWeight: '600', color: colors.primary },
});