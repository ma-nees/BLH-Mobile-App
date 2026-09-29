import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme';

interface StepperProps {
  value: number;
  onAdd: () => void;
  onDec: () => void;
  size?: 'sm' | 'md';
}

export function Stepper({ value, onAdd, onDec, size = 'md' }: StepperProps) {
  const scale = useSharedValue(1);

  // Animate whenever value changes
  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.4, { duration: 100 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
  }, [value, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconSize = size === 'sm' ? 16 : 18;

  return (
    <View style={[styles.stepper, size === 'sm' && styles.stepperSm]}>
      <Pressable 
        style={[styles.stepBtn, size === 'sm' && styles.stepBtnSm]} 
        onPress={onDec} 
        hitSlop={8}
      >
        <Ionicons name="remove" size={iconSize} color="#FFFFFF" />
      </Pressable>
      
      <Animated.Text style={[styles.stepQty, size === 'sm' && styles.stepQtySm, animatedStyle]}>
        {value}
      </Animated.Text>
      
      <Pressable 
        style={[styles.stepBtn, size === 'sm' && styles.stepBtnSm]} 
        onPress={onAdd} 
        hitSlop={8}
      >
        <Ionicons name="add" size={iconSize} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: {
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  stepperSm: {
    paddingHorizontal: 3,
  },
  stepBtn: { 
    width: 26, 
    height: 26, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  stepBtnSm: {
    height: 28,
  },
  stepQty: { 
    color: '#FFFFFF', 
    fontWeight: '800', 
    fontSize: 14,
    minWidth: 24,
    textAlign: 'center',
  },
  stepQtySm: {
    fontSize: 13,
    minWidth: 20,
  },
});
