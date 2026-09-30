import { useEffect, useState, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the native splash screen from hiding automatically
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [splashFinished, setSplashFinished] = useState(false);
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Give the app a tiny moment to load everything, then trigger animation
    setTimeout(async () => {
      // Hide the native splash screen. Our custom View underneath it will instantly take its place
      await SplashScreen.hideAsync().catch(() => {});
      
      // Animate the logo slightly expanding while fading out
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 800, // 0.8 seconds fade out
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.3, // scale up by 30%
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Once animation finishes, completely remove the splash view from the screen
        setSplashFinished(true);
      });
    }, 400); 
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
      
      {/* Custom Animated Splash Screen */}
      {!splashFinished && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: opacityAnim,
              zIndex: 9999, // Ensure it sits on top of all other screens
            }
          ]}
        >
          <Animated.Image 
            source={require('../assets/images/splash-icon.png')}
            style={{ 
              width: 150, 
              height: 150, 
              resizeMode: 'contain',
              transform: [{ scale: scaleAnim }]
            }}
          />
        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
}
