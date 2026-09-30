import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, StatusBar, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import { colors, spacing, typography, radius } from '../../../src/theme';
import { useOrders } from '../../../src/store/orderStore';
import { fmt } from '../../../src/data/products';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

export default function Invoice() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const orders = useOrders(s => s.orders);
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={typography.h3}>Invoice not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  // Generate an invoice number
  const invNumber = `BLH-INV-2026-${order.id.replace(/\D/g, '').padStart(6, '0').slice(0, 6)}`;

  const generateHTML = () => {
    // Get the local URI for the image asset
    const logoUri = Asset.fromModule(require('../../../assets/branding/logo.png')).uri;

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif; padding: 40px; color: #111827; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #F3F4F6; padding-bottom: 20px; }
            .brand h1 { margin: 0; color: #2563EB; font-size: 28px; }
            .brand p { margin: 4px 0 0; color: #6B7280; font-size: 14px; }
            .inv-details { text-align: right; }
            .inv-details h2 { margin: 0; color: #111827; font-size: 24px; text-transform: uppercase; }
            .inv-details p { margin: 4px 0 0; color: #6B7280; font-size: 14px; }
            
            .info-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .info-block h3 { margin: 0 0 10px; font-size: 14px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; }
            .info-block p { margin: 4px 0; font-size: 15px; }
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { text-align: left; padding: 12px 8px; border-bottom: 2px solid #E5E7EB; color: #6B7280; font-size: 13px; text-transform: uppercase; }
            td { padding: 16px 8px; border-bottom: 1px solid #E5E7EB; font-size: 15px; }
            .text-right { text-align: right; }
            
            .totals { width: 300px; margin-left: auto; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px; color: #6B7280; }
            .total-row.grand { border-top: 2px solid #111827; margin-top: 8px; padding-top: 16px; font-size: 18px; font-weight: bold; color: #111827; }
            
            .footer { margin-top: 60px; text-align: center; color: #9CA3AF; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">
              <img src="${logoUri}" style="width: 36px; height: 36px; margin-bottom: 8px; border-radius: 6px;" />
              <h1>Bhairahawa Light House</h1>
              <p>Milan Chowk, Bhairahawa, Nepal</p>
              <p>+977 980-0000000</p>
            </div>
            <div class="inv-details">
              <h2>Invoice</h2>
              <p># ${invNumber}</p>
              <p>Date: ${order.date}</p>
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-block">
              <h3>Billed To</h3>
              <p><strong>${order.address?.name || 'Customer'}</strong></p>
              <p>${order.address?.street || 'N/A'}</p>
              <p>${order.address?.city || 'Bhairahawa'}, Nepal</p>
              <p>${order.address?.phone || ''}</p>
            </div>
            <div class="info-block" style="text-align: right;">
              <h3>Order Details</h3>
              <p>Order No: <strong>#${order.id}</strong></p>
              <p>Status: ${order.status}</p>
              <p>Payment: Paid via ${order.paymentMethod === 'Cash on Delivery' ? 'COD' : order.paymentMethod || 'COD'}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>
                    <strong>${item.name}</strong>
                  </td>
                  <td>${item.qty}</td>
                  <td class="text-right">${fmt(item.price)}</td>
                  <td class="text-right"><strong>${fmt(item.price * item.qty)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>${fmt(order.total)}</span>
            </div>
            <div class="total-row">
              <span>Delivery</span>
              <span>${fmt(0)}</span>
            </div>
            <div class="total-row grand">
              <span>Grand Total</span>
              <span>${fmt(order.total)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with Bhairahawa Light House!</p>
            <p>This is a computer-generated invoice and does not require a physical signature.</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleExportPDF = async () => {
    try {
      setIsGenerating(true);
      console.log('Generating PDF...');
      const html = generateHTML();

      const { base64 } = await Print.printToFileAsync({
        html,
        base64: true
      });

      if (!base64) throw new Error('Failed to generate PDF');

      // Writing to the root of cacheDirectory is historically the safest for Expo Go's FileProvider
      const safeUri = FileSystem.cacheDirectory + `invoice-${order.id}.pdf`;
      console.log('Writing PDF to safe URI:', safeUri);
      
      await FileSystem.writeAsStringAsync(safeUri, base64, {
        encoding: FileSystem.EncodingType.Base64
      });

      const canShare = await Sharing.isAvailableAsync();
      console.log('Is sharing available?', canShare);
      
      if (canShare) {
        console.log('Attempting to share PDF...');
        // Do NOT pass dialogTitle on Android in Expo Go, it triggers a rename operation that causes exceptions
        await Sharing.shareAsync(safeUri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
        console.log('Share successful');
      } else {
        Alert.alert('Success', 'PDF Generated, but sharing is not available on this device.');
      }
    } catch (error: any) {
      console.error('PDF Generation/Share Error:', error);
      Alert.alert('Error', 'Failed to share PDF. ' + (error?.message || ''));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: TOP }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={12}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Invoice</Text>
        <Pressable onPress={handleExportPDF} style={styles.iconBtn} hitSlop={12}>
          <Ionicons name="share-outline" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.springify()} style={styles.paper}>
          <View style={styles.paperHeader}>
            <View style={{ alignItems: 'flex-start' }}>
              <Image
                source={require('../../../assets/branding/logo.png')}
                style={{
                  width: 80,
                  height: 60,
                  marginBottom: 6,
                }}
                resizeMode="contain"
              />
              <Text style={styles.brandName}>Bhairahawa Light House</Text>
              <Text style={styles.brandAddress}>Milan Chowk, Bhairahawa, Nepal</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text style={styles.invoiceNum}>{invNumber}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionLabel}>Billed To</Text>
              <Text style={styles.boldText}>{order.address?.name || 'Customer'}</Text>
              <Text style={styles.grayText}>{order.address?.street || 'N/A'}</Text>
              <Text style={styles.grayText}>{order.address?.city || 'Bhairahawa'}, Nepal</Text>
              <Text style={styles.grayText}>{order.address?.phone || ''}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={styles.sectionLabel}>Order Details</Text>
              <Text style={styles.grayText}>Order No: <Text style={styles.boldText}>#{order.id}</Text></Text>
              <Text style={styles.grayText}>Date: {order.date}</Text>
              <Text style={styles.grayText}>Payment: {order.paymentMethod === 'Cash on Delivery' ? 'COD' : order.paymentMethod}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Items</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCol, { flex: 2 }]}>Product</Text>
            <Text style={[styles.tableCol, { flex: 0.5, textAlign: 'center' }]}>Qty</Text>
            <Text style={[styles.tableCol, { flex: 1, textAlign: 'right' }]}>Amount</Text>
          </View>

          {order.items.map((item, idx) => (
            <View key={item.productId} style={styles.tableRow}>
              <View style={{ flex: 2 }}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemSku}>SKU: {item.productId.substring(0, 8)}</Text>
              </View>
              <Text style={[styles.itemQty, { flex: 0.5, textAlign: 'center' }]}>{item.qty}</Text>
              <Text style={[styles.itemPrice, { flex: 1, textAlign: 'right' }]}>{fmt(item.price * item.qty)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.grayText}>Subtotal</Text>
              <Text style={styles.boldText}>Rs. {order.total.toLocaleString()}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.grayText}>Delivery</Text>
              <Text style={styles.boldText}>Rs. 0</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>Rs. {order.total.toLocaleString()}</Text>
            </View>
          </View>

        </Animated.View>

        <Pressable
          style={styles.downloadBtn}
          onPress={handleExportPDF}
          disabled={isGenerating}
        >
          <Ionicons name="download-outline" size={20} color="#FFFFFF" />
          <Text style={styles.downloadBtnText}>{isGenerating ? 'Generating PDF...' : 'Download as PDF'}</Text>
        </Pressable>

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
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...typography.h3, color: colors.text, fontWeight: '800' },

  content: { padding: spacing.lg, paddingBottom: 100 },
  paper: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  paperHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  brandName: { color: colors.primary, fontWeight: '800', fontSize: 18 },
  brandAddress: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  invoiceTitle: { color: colors.text, fontWeight: '800', fontSize: 20, letterSpacing: 1 },
  invoiceNum: { color: colors.textSecondary, fontSize: 13, marginTop: 4, fontWeight: '600' },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },

  row: { flexDirection: 'row', justifyContent: 'space-between' },
  sectionLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  boldText: { color: colors.text, fontWeight: '700', fontSize: 13, marginBottom: 2 },
  grayText: { color: colors.textSecondary, fontSize: 13, marginBottom: 2 },

  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 8, marginBottom: 8 },
  tableCol: { fontSize: 11, color: colors.textSecondary, fontWeight: '700', textTransform: 'uppercase' },

  tableRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  itemName: { color: colors.text, fontWeight: '600', fontSize: 13, marginBottom: 2 },
  itemSku: { color: colors.textSecondary, fontSize: 11 },
  itemQty: { color: colors.text, fontSize: 13 },
  itemPrice: { color: colors.text, fontWeight: '700', fontSize: 13 },

  totalsContainer: { width: '60%', alignSelf: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  grandTotalRow: { borderTopWidth: 1, borderTopColor: colors.text, paddingTop: 12, marginTop: 6 },
  grandTotalLabel: { color: colors.text, fontWeight: '800', fontSize: 15 },
  grandTotalValue: { color: colors.text, fontWeight: '800', fontSize: 16 },

  downloadBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: radius.full,
    marginTop: spacing.xl,
  },
  downloadBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
});
