import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, typography } from '../../theme';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const ALLOWED = ['home', 'categories', 'cart', 'wishlist', 'profile'];
  const routes = ALLOWED.map(name => state.routes.find(r => r.name === name)).filter(Boolean) as typeof state.routes;

  const PADDING_H = 16;
  const BAR_WIDTH = width - 32; // left: 16, right: 16
  const TAB_WIDTH = (BAR_WIDTH - PADDING_H * 2) / routes.length;

  const currentRoute = state.routes[state.index];
  const currentOptions = descriptors[currentRoute.key].options;

  if (currentOptions.tabBarStyle && (currentOptions.tabBarStyle as any).display === 'none') {
    return null;
  }

  return (
    <View style={styles.container}>

      {routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = currentRoute.key === route.key;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName = 'home-outline';
        if (route.name === 'home') iconName = isFocused ? 'home' : 'home-outline';
        if (route.name === 'categories') iconName = isFocused ? 'grid' : 'grid-outline';
        if (route.name === 'cart') iconName = isFocused ? 'cart' : 'cart-outline';
        if (route.name === 'wishlist') iconName = isFocused ? 'heart' : 'heart-outline';
        if (route.name === 'profile') iconName = isFocused ? 'person' : 'person-outline';

        const badge = options.tabBarBadge;
        const badgeStyle = options.tabBarBadgeStyle;

        return (
          <AnimatedTabItem
            key={route.key}
            isFocused={isFocused}
            iconName={iconName}
            label={label as string}
            badge={badge}
            badgeStyle={badgeStyle}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}

function AnimatedTabItem({ isFocused, iconName, label, badge, badgeStyle, onPress }: any) {
  const progress = useSharedValue(isFocused ? 1 : 0);
  
  useEffect(() => {
    progress.value = withSpring(isFocused ? 1 : 0, { mass: 0.6, damping: 14, stiffness: 200 });
  }, [isFocused]);

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: 1 + progress.value * 0.25 }, // scales from 1 to 1.25
        { translateY: progress.value * -6 }, // moves up 6px
      ],
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        { translateY: (1 - progress.value) * 6 },
        { scale: 0.8 + progress.value * 0.2 },
      ],
    };
  });

  return (
    <Pressable onPress={onPress} style={styles.tab} hitSlop={10}>
      <Animated.View style={iconStyle}>
        <Ionicons
          name={iconName}
          size={22}
          color={isFocused ? colors.primary : colors.textSecondary}
        />
        {badge !== undefined && (
          <View style={[styles.badge, badgeStyle]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </Animated.View>
      <Animated.Text style={[styles.label, isFocused && styles.labelFocused, labelStyle]} numberOfLines={1}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  label: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
  },
  labelFocused: {
    color: colors.primary,
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
