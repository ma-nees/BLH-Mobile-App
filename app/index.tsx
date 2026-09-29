import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, PanResponder, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../src/theme';
import { Button } from '../src/components/ui/Button';
import Animated, {
  Easing,
  FadeInDown,
  FadeIn,
  SharedValue,
  interpolate,
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_W } = Dimensions.get('window');
const DARK = '#0A0F1C';
const YELLOW = '#FFD54A';
const TRACK_W = SCREEN_W - spacing.xl * 2;
const THUMB = 58;
const PAD = 5;
const MAX_X = TRACK_W - THUMB - PAD * 2 - 14;
const DOTS = 14;
const CATEGORIES = ['Wiring', 'Lighting', 'Switches', 'Fans', 'Tools', 'MCBs'];
const TOP = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + spacing.lg : 64;

/* ---------- Energy flow dots ---------- */
function FlowDot({ t, i }: { t: SharedValue<number>; i: number }) {
  const style = useAnimatedStyle(() => {
    const phase = (t.value - i / DOTS) * Math.PI * 2;
    const wave = (Math.cos(phase) + 1) / 2;
    // Raise the wave to a power to make the "pulse" tighter and sharper
    const sharpWave = Math.pow(wave, 6);

    return {
      opacity: 0.12 + sharpWave * 0.88,
      transform: [{ scale: 0.7 + sharpWave * 0.8 }],
    };
  });
  return <Animated.View style={[styles.flowDot, style]} />;
}

function FlowLine() {
  const t = useSharedValue(0);
  useEffect(() => {
    // Animate continuously to a massive number to completely eliminate the withRepeat 1-frame stutter
    t.value = withTiming(10000, { duration: 10000 * 2400, easing: Easing.linear });
  }, [t]);
  return (
    <View style={styles.flow}>
      {Array.from({ length: DOTS }).map((_, i) => (
        <FlowDot key={i} t={t} i={i} />
      ))}
    </View>
  );
}

/* ---------- Floating category chip ---------- */
function Chip({ label, index }: { label: string; index: number }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withTiming(index % 2 ? -5 : 5, { duration: 1800 + index * 150, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800 + index * 150, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [y, index]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Animated.View style={[styles.chip, style]}>
      <Text style={styles.chipText}>{label}</Text>
    </Animated.View>
  );
}

/* ---------- Slide-to-plug-in ---------- */
function PlugSlider({ onConnected }: { onConnected: () => void }) {
  const x = useSharedValue(0);
  const spark = useSharedValue(0);
  const busy = useRef(false);

  const connect = () => {
    spark.value = withSequence(withTiming(1, { duration: 120 }), withTiming(0, { duration: 500 }));
    onConnected();
    setTimeout(() => {
      x.value = withTiming(0, { duration: 500 });
      busy.current = false;
    }, 700);
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        if (busy.current) return;
        x.value = Math.max(0, Math.min(MAX_X, g.dx));
      },
      onPanResponderRelease: () => {
        if (busy.current) return;
        if (x.value > MAX_X * 0.82) {
          busy.current = true;
          x.value = withTiming(MAX_X, { duration: 120 }, (done) => {
            if (done) runOnJS(connect)();
          });
        } else {
          x.value = withSpring(0, { damping: 12 });
        }
      },
    })
  ).current;

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const fillStyle = useAnimatedStyle(() => ({ width: x.value + THUMB + PAD }));
  const labelStyle = useAnimatedStyle(() => ({ opacity: 1 - interpolate(x.value, [0, MAX_X * 0.6], [0, 1], 'clamp') }));
  const sparkStyle = useAnimatedStyle(() => ({
    opacity: spark.value,
    transform: [{ scale: 0.6 + spark.value * 1.4 }],
  }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, fillStyle]} />
      <Animated.Text style={[styles.trackLabel, labelStyle]}>Slide to Login In </Animated.Text>

      {/* Socket */}
      <View style={styles.socket}>
        <View style={styles.slot} />
        <View style={styles.slot} />
      </View>
      <Animated.View pointerEvents="none" style={[styles.spark, sparkStyle]} />

      {/* Plug */}
      <Animated.View style={[styles.thumb, thumbStyle]} {...pan.panHandlers}>
        <View style={styles.prongs}>
          <View style={styles.prong} />
          <View style={styles.prong} />
        </View>
        <Ionicons name="flash" size={22} color="#FFFFFF" style={styles.bolt} />
      </Animated.View>
    </View>
  );
}

/* ---------- Screen ---------- */
export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.orbA} />
      <View style={styles.orbB} />

      <View style={[styles.top, { paddingTop: TOP }]}>
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.logoBadge}>
          <Image source={require('../assets/branding/logo.png')} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(250).springify()} style={styles.headline}>
          Power Up Your{'\n'}
          <Text style={styles.headlineAccent}>Every Space</Text>
        </Animated.Text>

        <Animated.Text entering={FadeIn.delay(450)} style={styles.subtitle}>
          Bhairahawa Light House · Online Electrical Shop
        </Animated.Text>
      </View>

      <Animated.View entering={FadeIn.delay(600)} style={styles.middle}>
        <FlowLine />
        <View style={styles.chips}>
          {CATEGORIES.map((c, i) => (
            <Chip key={c} label={c} index={i} />
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(750).springify()} style={styles.bottom}>
        <PlugSlider onConnected={() => router.push('/(auth)/login')} />
        <View style={{ height: spacing.md }} />
        <Button title="Create Account" variant="secondary" onPress={() => router.push('/(auth)/register')} />
        <Text style={styles.terms}>By continuing, you agree to our Terms & Privacy Policy</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl },
  orbA: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.primary,
    opacity: 0.1,
    top: -110,
    right: -110,
  },
  orbB: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.secondary,
    opacity: 0.1,
    bottom: 120,
    left: -100,
  },

  top: { alignItems: 'center' },
  logoBadge: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: { width: 180, height: 105 },
  headline: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  headlineAccent: { color: colors.primary },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },

  middle: { flex: 1, justifyContent: 'center' },
  flow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  flowDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: { color: colors.text, fontSize: 13, fontWeight: '600' },

  bottom: { paddingBottom: spacing.xl },
  terms: {
    marginTop: spacing.md,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
  },

  // Slider
  track: {
    height: THUMB + PAD * 2,
    borderRadius: (THUMB + PAD * 2) / 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: (THUMB + PAD * 2) / 2,
    backgroundColor: 'rgba(0,102,204,0.1)',
  },
  trackLabel: {
    position: 'absolute',
    alignSelf: 'center',
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.6,
    fontSize: 14,
    paddingLeft: THUMB / 2,
  },
  socket: {
    position: 'absolute',
    right: 12,
    width: 34,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  slot: { width: 16, height: 4, borderRadius: 2, backgroundColor: colors.surface },
  spark: {
    position: 'absolute',
    right: -6,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
  },
  thumb: {
    position: 'absolute',
    left: PAD,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  bolt: { fontSize: 22 },
  prongs: {
    position: 'absolute',
    right: -12,
    gap: 8,
  },
  prong: { width: 14, height: 4, borderRadius: 2, backgroundColor: colors.border },
});