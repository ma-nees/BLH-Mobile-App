import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, StatusBar, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, spacing, typography, radius } from '../../../src/theme';
import { useAddresses, Address } from '../../../src/store/addressStore';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

export default function CheckoutAddress() {
  const router = useRouter();
  const { addresses, addAddress, removeAddress } = useAddresses();
  const [selected, setSelected] = useState(addresses[0]?.id || '');
  const [isAdding, setIsAdding] = useState(false);

  // New Address Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');

  // Make sure we have a selected address if possible
  useEffect(() => {
    if (addresses.length > 0 && !addresses.find(a => a.id === selected)) {
      setSelected(addresses[0].id);
    }
  }, [addresses, selected]);

  const handleSaveAddress = () => {
    if (!newName || !newPhone || !newStreet || !newCity) return;
    addAddress({ type: 'Home', name: newName, phone: newPhone, street: newStreet, city: newCity });
    setIsAdding(false);
    setNewName(''); setNewPhone(''); setNewStreet(''); setNewCity('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: TOP }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Select Address</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={styles.stepActive}><Text style={styles.stepTextActive}>1</Text></View>
        <View style={styles.stepLine} />
        <View style={styles.stepInactive}><Text style={styles.stepTextInactive}>2</Text></View>
        <View style={styles.stepLine} />
        <View style={styles.stepInactive}><Text style={styles.stepTextInactive}>3</Text></View>
        <View style={styles.stepLine} />
        <View style={styles.stepInactive}><Text style={styles.stepTextInactive}>4</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {addresses.map((addr, i) => {
          const isSel = selected === addr.id;
          return (
            <Animated.View key={addr.id} entering={FadeInDown.delay(i * 100).springify()}>
              <Pressable
                style={[styles.card, isSel && styles.cardActive]}
                onPress={() => setSelected(addr.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.radioRow}>
                    <View style={[styles.radio, isSel && styles.radioActive]}>
                      {isSel && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.cardTitle}>{addr.name}</Text>
                  </View>
                  <Pressable hitSlop={12} onPress={() => removeAddress(addr.id)}>
                    <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
                  </Pressable>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.addressText}>{addr.street}</Text>
                  <Text style={styles.addressText}>{addr.city}</Text>
                  <Text style={styles.phoneText}>{addr.phone}</Text>
                </View>
              </Pressable>
            </Animated.View>
          );
        })}

        <Pressable style={styles.addNewBtn} onPress={() => setIsAdding(true)}>
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={styles.addNewText}>Add New Address</Text>
        </Pressable>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.continueBtn, !selected && { opacity: 0.5 }]}
          disabled={!selected}
          onPress={() => router.push('/(store)/checkout/delivery')}
        >
          <Text style={styles.continueText}>Continue to Delivery</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Add Address Modal */}
      {/* Add Address Modal */}
      <Modal visible={isAdding} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalOverlayBg} />
          
          <Animated.View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Address</Text>
              <Pressable onPress={() => setIsAdding(false)} hitSlop={12} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput style={styles.input} placeholder="e.g., John Doe" placeholderTextColor={colors.textSecondary + '80'} value={newName} onChangeText={setNewName} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput style={styles.input} placeholder="+977 980-0000000" placeholderTextColor={colors.textSecondary + '80'} value={newPhone} onChangeText={setNewPhone} keyboardType="phone-pad" />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Street Address</Text>
                <TextInput style={[styles.input, { height: 80 }]} placeholder="123 Main Street, Phase 1" placeholderTextColor={colors.textSecondary + '80'} value={newStreet} onChangeText={setNewStreet} multiline textAlignVertical="top" />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>City / Town</Text>
                <TextInput style={styles.input} placeholder="e.g., Bhairahawa" placeholderTextColor={colors.textSecondary + '80'} value={newCity} onChangeText={setNewCity} />
              </View>
              
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Pressable style={styles.saveBtn} onPress={handleSaveAddress}>
                <Text style={styles.saveBtnText}>Save Address</Text>
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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

  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  stepActive: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepTextActive: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  stepInactive: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  stepTextInactive: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#F3F4F6', marginHorizontal: 8 },

  content: { padding: spacing.lg, paddingBottom: 100 },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
  },
  cardActive: { borderColor: colors.primary, backgroundColor: '#F8FAFC' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.textSecondary, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  cardTitle: { ...typography.body, fontWeight: '700', color: colors.text },
  editBtn: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  cardBody: { paddingLeft: 30 },
  addressText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  phoneText: { color: colors.text, fontSize: 14, fontWeight: '600', marginTop: 4 },

  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
  },
  addNewText: { color: colors.primary, fontWeight: '700', fontSize: 14 },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.lg,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: radius.full,
  },
  continueText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  modalTitle: { ...typography.h3, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
  },
  modalScroll: {
    padding: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    minHeight: 52,
    backgroundColor: '#F9FAFB',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  modalFooter: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    gap: 8,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16, letterSpacing: 0.5 },
});
