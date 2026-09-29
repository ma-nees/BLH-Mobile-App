import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  interpolateColor,
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// --- Constants ---
const STATUS_H = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 50;
const CORD_H = STATUS_H + 30;
const HOLDER_H = 22;
const BULB = 60;
export const LAMP_W = 240;
const LAMP_H = CORD_H + HOLDER_H + BULB;
const BULB_CENTER_Y = CORD_H + HOLDER_H + BULB / 2 - 4;

// --- GlowRing Component ---
function GlowRing({
  glow,
  size,
  max,
}: {
  glow: SharedValue<number>;
  size: number;
  max: number;
}) {
  const style = useAnimatedStyle(() => ({
    opacity: glow.value * max,
    transform: [{ scale: 0.7 + glow.value * 0.3 }],
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

// --- Lamp Component ---
export function InteractiveLamp({ glow }: { glow: SharedValue<number> }) {
  const time = useSharedValue(0);
  const userSwing = useSharedValue(0);

  useEffect(() => {
    // A continuous linear clock to drive the perfect sine wave.
    // This avoids ANY stutter that withRepeat can cause at the edges!
    time.value = withTiming(100000, {
      duration: 50000000, // Runs for 13 hours perfectly smoothly
      easing: Easing.linear,
    });
  }, [time]);

  const rotation = useDerivedValue(() => {
    // A perfectly smooth, mathematically calculated infinite sine wave!
    // time.value * 2 controls the speed, 6 controls the angle.
    const autoSwing = Math.sin(time.value * 2) * 6;
    return autoSwing + userSwing.value;
  });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      // Negative so the bottom of the lamp swings in the direction of the finger
      userSwing.value = -e.translationX / 4;
    })
    .onEnd((e) => {
      userSwing.value = withSpring(0, {
        velocity: -e.velocityX / 10,
        damping: 10,
        stiffness: 60,
      });
    });

  const swingStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -LAMP_H / 2 },
      { rotate: `${rotation.value}deg` },
      { translateY: LAMP_H / 2 },
    ],
  }));

  const bulbStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(glow.value, [0, 1], ['#6B7280', '#FFD54A']),
    shadowOpacity: glow.value * 0.9,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.lamp, swingStyle]}>
        <GlowRing glow={glow} size={230} max={0.1} />
        <GlowRing glow={glow} size={160} max={0.16} />
        <GlowRing glow={glow} size={104} max={0.28} />

        <View style={styles.cord} />
        <View style={styles.holder} />
        <Animated.View style={[styles.bulb, bulbStyle]}>
          <View style={styles.bulbShine} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  lamp: {
    width: LAMP_W,
    height: LAMP_H,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  cord: {
    width: 3,
    height: CORD_H,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  holder: {
    width: 24,
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
    shadowRadius: 26,
    alignItems: 'center',
  },
  bulbShine: {
    position: 'absolute',
    top: 10,
    left: 14,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
});
