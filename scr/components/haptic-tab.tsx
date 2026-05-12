import { PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform } from 'react-native';

export function HapticTab({ children, onPress, ...props }: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...(props as any)}
      onPress={(e) => {
        if (Platform.OS === 'ios') {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.(e);
      }}
    >
      {children}
    </PlatformPressable>
  );
}
