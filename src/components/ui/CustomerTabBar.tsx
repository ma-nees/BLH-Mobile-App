import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { colors } from '../../theme';

const T = { bar: '#FFFFFF', border: 'rgba(0,0,0,0.05)', inactive: colors.textSecondary, active: colors.primary, badgeRing: '#FFFFFF', shadow: 0.16, pill: colors.primary + '12' };

const BAR_HEIGHT = 64;
const BAR_PAD = 8;
const PILL_HEIGHT = BAR_HEIGHT - BAR_PAD * 2;
const LABEL_MAX = 84;

function resolveIcon(options: any, focused: boolean): string | null {
  try {
    const el = options.tabBarIcon?.({ focused, color: '', size: 24 }) as React.ReactElement<any> | undefined;
    const name = el?.props?.name;
    return typeof name === 'string' ? name : null;
  } catch {
    return null;
  }
}

function getIconPair(options: any): [string, string] {
  const unfocused = resolveIcon(options, false) ?? 'ellipse-outline';
  const focused = resolveIcon(options, true) ?? unfocused;
  if (unfocused !== focused) return [unfocused, focused];
  const base = unfocused.replace(/-outline$/, '');
  return [`${base}-outline`, base];
}

export function CustomerTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  const currentRouteName = state.routes[state.index]?.name || '';
  if (currentRouteName.includes('checkout') || currentRouteName === 'order' || currentRouteName === 'invoice') return null;

  const visibleRoutes = state.routes.filter((route) => {
    const { options } = descriptors[route.key];
    if ((options as any).href === null) return false;
    if (options.tabBarStyle && (options.tabBarStyle as any).display === 'none') return false;
    return true;
  });

  const focusedKey = state.routes[state.index]?.key;

  const enter = useSharedValue(0);
  useEffect(() => {
    enter.value = withSpring(1, { damping: 15, stiffness: 110, mass: 0.9 });
  }, []);

  const wrapperStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: (1 - enter.value) * 100 }, { scale: 0.94 + 0.06 * enter.value }],
  }));

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 8) + 8 }, wrapperStyle]}
    >
      <View style={[styles.bar, { backgroundColor: T.bar, borderColor: T.border, shadowOpacity: T.shadow }]}>
        {visibleRoutes.map((route) => {
          const { options } = descriptors[route.key];
          const label = (options.title ?? route.name) as string;
          const isFocused = route.key === focusedKey;
          const [outlineIcon, filledIcon] = getIconPair(options);

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name as never);
          };
          const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              outlineIcon={outlineIcon}
              filledIcon={filledIcon}
              label={label}
              badge={options.tabBarBadge}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </Animated.View>
  );
}

type ItemProps = {
  isFocused: boolean;
  outlineIcon: string;
  filledIcon: string;
  label: string;
  badge?: string | number;
  accessibilityLabel?: string;
  onPress: () => void;
  onLongPress: () => void;
};

function TabItem({ isFocused, outlineIcon, filledIcon, label, badge, accessibilityLabel, onPress, onLongPress }: ItemProps) {
  const progress = useSharedValue(isFocused ? 1 : 0);
  const pop = useSharedValue(1);
  const press = useSharedValue(1);
  const badgeScale = useSharedValue(1);

  useEffect(() => {
    progress.value = withSpring(isFocused ? 1 : 0, { damping: 14, stiffness: 280, mass: 0.5 });
    if (isFocused) {
      pop.value = withSequence(withTiming(0.8, { duration: 60 }), withSpring(1, { damping: 8, stiffness: 350 }));
    }
  }, [isFocused]);

  const hasBadge = badge !== undefined && badge !== null && badge !== '';
  useEffect(() => {
    if (hasBadge) badgeScale.value = withSequence(withTiming(1.5, { duration: 80 }), withSpring(1, { damping: 8, stiffness: 300 }));
  }, [badge]);

  const containerStyle = useAnimatedStyle(() => ({
    flexGrow: interpolate(progress.value, [0, 1], [1, 2.3], Extrapolation.CLAMP),
  }));

  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: press.value }] }));

  const pillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.8, 1], Extrapolation.CLAMP),
    transform: [{ scaleX: interpolate(progress.value, [0, 1], [0.6, 1], Extrapolation.CLAMP) }, { scaleY: interpolate(progress.value, [0, 1], [0.7, 1], Extrapolation.CLAMP) }],
    shadowOpacity: 0.55 * progress.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }, { rotate: `${(1 - pop.value) * -30}deg` }],
  }));
  const outlineStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));
  const filledStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  const labelWrapStyle = useAnimatedStyle(() => ({
    maxWidth: interpolate(progress.value, [0, 1], [0, LABEL_MAX], Extrapolation.CLAMP),
    marginLeft: interpolate(progress.value, [0, 1], [0, 7], Extrapolation.CLAMP),
    opacity: interpolate(progress.value, [0.35, 1], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateX: interpolate(progress.value, [0, 1], [-10, 0], Extrapolation.CLAMP) }],
  }));

  const badgeAnim = useAnimatedStyle(() => ({ transform: [{ scale: badgeScale.value }] }));

  return (
    <Animated.View style={[styles.tabOuter, containerStyle]}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={() => { press.value = withSpring(0.9, { damping: 12, stiffness: 450 }); }}
        onPressOut={() => { press.value = withSpring(1, { damping: 8, stiffness: 400 }); }}
        style={styles.pressable}
        accessibilityRole="button"
        accessibilityState={{ selected: isFocused }}
        accessibilityLabel={accessibilityLabel ?? label}
      >
        <Animated.View style={[styles.pill, { backgroundColor: T.pill, shadowColor: T.pill === colors.primary ? colors.primary : 'transparent' }, pillStyle]} />

        <Animated.View style={[styles.content, pressStyle]}>
          <Animated.View style={[styles.iconWrap, iconStyle]}>
            <Animated.View style={[StyleSheet.absoluteFill, styles.center, outlineStyle]}>
              <Ionicons name={outlineIcon as any} size={23} color={T.inactive} />
            </Animated.View>
            <Animated.View style={[StyleSheet.absoluteFill, styles.center, filledStyle]}>
              <Ionicons name={filledIcon as any} size={23} color={T.active} />
            </Animated.View>

            {hasBadge && !isFocused && (
              <Animated.View style={[styles.badge, { borderColor: T.badgeRing }, badgeAnim]}>
                <Text style={styles.badgeText}>{badge}</Text>
              </Animated.View>
            )}
          </Animated.View>

          <Animated.View style={[styles.labelWrap, labelWrapStyle]}>
            <Text style={[styles.label, { color: T.active }]} numberOfLines={1}>{label}</Text>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', left: 20, right: 20 },
  bar: {
    height: BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BAR_PAD,
    borderRadius: BAR_HEIGHT / 2,
    borderWidth: 1,
    elevation: 24,
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 26,
  },
  tabOuter: { flexBasis: 0, height: PILL_HEIGHT },
  pressable: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  pill: {
    ...StyleSheet.absoluteFillObject,
    marginHorizontal: 2,
    borderRadius: PILL_HEIGHT / 2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
  },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: 26, height: 26 },
  center: { alignItems: 'center', justifyContent: 'center' },
  labelWrap: { overflow: 'hidden' },
  label: { fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },
  badge: {
    position: 'absolute',
    top: -5,
    right: -7,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: '#FF4D5E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  badgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
});
