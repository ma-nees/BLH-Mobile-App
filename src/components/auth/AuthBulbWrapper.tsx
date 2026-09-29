import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, StatusBar, Pressable, Text } from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  interpolate,
  interpolateColor,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing, typography } from '../../theme';

const STATUS_H = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 50;
const CORD_H = STATUS_H + 10;
const HOLDER_H = 22;
const BULB = 60;
const LAMP_W = 260;
const LAMP_H = CORD_H + HOLDER_H + BULB;
const BULB_CENTER_Y = CORD_H + HOLDER_H + BULB / 2 - 4;
const DARK = '#0A0F1C';

function GlowRing({ glow, size, max }: { glow: SharedValue<number>; size: number; max: number }) {
  const style = useAnimatedStyle(() => ({
    opacity: glow.value * max,
    transform: [{ scale: 0.6 + glow.value * 0.4 }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          left: LAMP_W / 2 - size / 2,
          top: BULB_CENTER_Y - size / 2,
          backgroundColor: '#FFD54A',
        },
        style,
      ]}
    />
  );
}

function Lamp({ glow, onPull }: { glow: SharedValue<number>; onPull: () => void }) {
  const swing = useSharedValue(-1);
  const pull = useSharedValue(0);

  useEffect(() => {
    swing.value = withRepeat(withTiming(1, { duration: 2800, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [swing]);

  const swingStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -LAMP_H / 2 },
      { rotate: `${swing.value * 3}deg` },
      { translateY: LAMP_H / 2 },
    ],
  }));

  const bulbStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(glow.value, [0, 1], ['#4B5563', '#FFD54A']),
    shadowOpacity: glow.value * 0.95,
  }));

  const chainStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pull.value }],
  }));

  const handlePull = () => {
    pull.value = withSequence(withTiming(26, { duration: 90 }), withSpring(0, { damping: 6 }));
    onPull();
  };

  return (
    <Animated.View style={[styles.lamp, swingStyle]}>
      <GlowRing glow={glow} size={340} max={0.07} />
      <GlowRing glow={glow} size={240} max={0.12} />
      <GlowRing glow={glow} size={150} max={0.22} />

      <View style={styles.cord} />
      <View style={styles.holder} />
      <Animated.View style={[styles.bulb, bulbStyle]}>
        <View style={styles.bulbShine} />
      </Animated.View>

      {/* Pull chain */}
      <Pressable onPress={handlePull} hitSlop={{ top: 10, bottom: 30, left: 24, right: 24 }} style={styles.chainWrap}>
        <Animated.View style={[styles.chainInner, chainStyle]}>
          <View style={styles.chain} />
          <View style={styles.bead} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export function AuthBulbWrapper({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  const glow = useSharedValue(0);
  const hint = useSharedValue(0);

  useEffect(() => {
    hint.value = withRepeat(withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [hint]);

  const toggle = () => {
    const next = !on;
    setOn(next);
    glow.value = next
      ? withSequence(
          withTiming(0.4, { duration: 80 }),
          withTiming(0.05, { duration: 90 }),
          withTiming(0.8, { duration: 90 }),
          withTiming(0.2, { duration: 80 }),
          withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) })
        )
      : withTiming(0, { duration: 500 });
  };

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(glow.value, [0, 1], [DARK, '#F3F4F6']),
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0.5, 1], [0, 1], 'clamp'),
    transform: [{ translateY: interpolate(glow.value, [0, 1], [30, 0]) }],
    flex: 1,
  }));

  const hintStyle = useAnimatedStyle(() => ({
    opacity: (1 - glow.value) * (0.45 + hint.value * 0.55),
  }));

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      <StatusBar barStyle={on ? 'dark-content' : 'light-content'} />

      <View style={styles.lampArea} pointerEvents="box-none">
        <Lamp glow={glow} onPull={toggle} />
      </View>

      {!on && (
        <Animated.View pointerEvents="none" style={[styles.hintWrap, hintStyle]}>
          <Text style={styles.hintArrow}>↑</Text>
          <Text style={styles.hintText}>Pull to turn on</Text>
        </Animated.View>
      )}

      <Animated.View style={[contentStyle]} pointerEvents={on ? 'auto' : 'none'}>
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lampArea: { alignItems: 'center', zIndex: 10, height: LAMP_H },
  
  // Lamp
  lamp: { width: LAMP_W, height: LAMP_H, alignItems: 'center', position: 'absolute', top: 0 },
  cord: { width: 3, height: CORD_H, backgroundColor: 'rgba(255,255,255,0.5)' },
  holder: {
    width: 26,
    height: HOLDER_H,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: '#9CA3AF',
  },
  bulb: {
    width: BULB,
    height: BULB,
    borderRadius: BULB / 2,
    marginTop: -4,
    shadowColor: '#FFC93C',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
    alignItems: 'center',
  },
  bulbShine: {
    position: 'absolute',
    top: 11,
    left: 15,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  chainWrap: {
    position: 'absolute',
    left: LAMP_W / 2 + 14,
    top: CORD_H + 6,
  },
  chainInner: { alignItems: 'center' },
  chain: { width: 2, height: 46, backgroundColor: 'rgba(255,255,255,0.6)' },
  bead: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E5E7EB',
    marginTop: -1,
  },

  // Hint
  hintWrap: { position: 'absolute', alignSelf: 'center', top: LAMP_H + 40, alignItems: 'center' },
  hintArrow: { color: '#FFD54A', fontSize: 22, fontWeight: '800' },
  hintText: {
    ...typography.body,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    letterSpacing: 0.4,
  },
});
