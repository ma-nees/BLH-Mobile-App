
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, radius } from '../src/theme';
import { Button } from '../src/components/ui/Button';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + spacing.md : 56;

const INTRO =
  'Welcome to Bhairahawa Light House. These Terms of Service govern your use of our application and services. By using our app, you agree to these terms.';

const SECTIONS = [
  {
    title: 'General Conditions',
    body: 'We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.',
  },
  {
    title: 'Products or Services',
    body: 'Certain products or services may be available exclusively online through the application. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.',
  },
  {
    title: 'Accuracy of Billing and Account Information',
    body: 'We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.',
  },
];

const OUTRO = 'Please read these terms carefully before accessing or using our application.';

export default function Terms() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { paddingTop: TOP }]}>
          <View style={styles.circleLarge} />
          <View style={styles.circleSmall} />

          <Pressable style={styles.backPill} hitSlop={8} onPress={() => router.back()}>
            <Text style={styles.backText}>‹  Back</Text>
          </Pressable>

          <Animated.View entering={FadeIn.delay(100)} style={styles.badge}>
            <Text style={styles.badgeEmoji}>T&C</Text>
          </Animated.View>
          <Animated.Text entering={FadeIn.delay(250)} style={styles.title}>
            Terms of Service
          </Animated.Text>
          <Animated.Text entering={FadeIn.delay(350)} style={styles.tagline}>
            The ground rules for using our app
          </Animated.Text>
        </View>

        {/* Intro */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.intro}>
          <Text style={styles.introText}>{INTRO}</Text>
        </Animated.View>

        {/* Sections */}
        <View style={styles.list}>
          {SECTIONS.map((s, i) => (
            <Animated.View
              key={s.title}
              entering={FadeInDown.delay(300 + i * 120).springify()}
              style={styles.card}
            >
              <View style={styles.cardHead}>
                <View style={styles.numBadge}>
                  <Text style={styles.numText}>{i + 1}</Text>
                </View>
                <Text style={styles.cardTitle}>{s.title}</Text>
              </View>
              <Text style={styles.cardBody}>{s.body}</Text>
            </Animated.View>
          ))}

          <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.note}>
            <Text style={styles.noteText}>{OUTRO}</Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeIn.delay(900)} style={styles.footer}>
          <Button title="Got it" onPress={() => router.back()} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scroll: { flexGrow: 1, paddingBottom: spacing.xxl },

  // Hero
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
  backPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
    marginBottom: spacing.md,
  },
  backText: { ...typography.caption, color: '#FFFFFF', fontWeight: '700' },
  badge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  badgeEmoji: { fontSize: 20, fontWeight: '800', color: colors.primary },
  title: {
    ...typography.h2,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  tagline: {
    ...typography.body,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  // Intro
  intro: {
    marginHorizontal: spacing.lg,
    marginTop: -46,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderLeftWidth: 5,
    borderLeftColor: colors.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  introText: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },

  // Section cards
  list: { paddingHorizontal: spacing.lg, marginTop: spacing.lg, gap: 14 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  numBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  cardTitle: { ...typography.body, flex: 1, color: colors.primary, fontWeight: '700' },
  cardBody: { ...typography.body, color: colors.textSecondary, lineHeight: 23 },

  // Closing note
  note: {
    padding: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  noteText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  footer: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
});