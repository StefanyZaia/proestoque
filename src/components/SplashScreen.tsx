import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet, Text, View } from 'react-native';

import LogoProEstoque from './LogoProEstoque';

type SplashScreenProps = {
  onLayout?: () => void;
};

export default function SplashScreen({ onLayout }: SplashScreenProps) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [floatAnim]);

  return (
    <View style={styles.screen} onLayout={onLayout}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <Animated.View style={[styles.logoBlock, { transform: [{ translateY: floatAnim }] }]}>
        <LogoProEstoque size="lg" />
      </Animated.View>

      <View style={styles.loaderBlock}>
        <ActivityIndicator size="large" color="#E8A9C8" />
        <Text style={styles.subtitle}>Verificando sessao...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: '#F6EEFF',
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 24,
  },
  glowTop: {
    backgroundColor: '#E8D8FF',
    borderRadius: 999,
    height: 220,
    position: 'absolute',
    right: -60,
    top: -40,
    width: 220,
  },
  glowBottom: {
    backgroundColor: '#FFDDF3',
    borderRadius: 999,
    bottom: -80,
    height: 250,
    left: -90,
    position: 'absolute',
    width: 250,
  },
  logoBlock: {
    alignItems: 'center',
  },
  loaderBlock: {
    alignItems: 'center',
    gap: 14,
    marginTop: 30,
  },
  subtitle: {
    color: '#7A6C96',
    fontSize: 14,
  },
});
