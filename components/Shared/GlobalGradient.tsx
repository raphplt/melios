import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@context/ThemeContext';

const GlobalGradient = () => {
  const { theme } = useTheme();
  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundSecondary]}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
};

export default GlobalGradient;
