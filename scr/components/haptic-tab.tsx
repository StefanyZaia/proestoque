import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';

export function HapticTab({ children, onPress, ...props }: BottomTabBarButtonProps) {
  return (
    <TouchableOpacity
      {...(props as any)}
      onPress={(e) => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.(e);
      }}
    >
      {children}
    </TouchableOpacity>
  );
}