import React from 'react';
import { View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
  withRepeat,
  FadeIn,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

interface LogoProps {
  size?: number;
  color?: string;
}

export function Logo({ size = 128, color = '#FF6B00' }: LogoProps) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const rocketStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
  }));

  return (
    <View className="items-center justify-center">
      <Animated.View 
        style={rocketStyle}
        className="items-center justify-center w-20 h-20 rounded-2xl"
      >
        <Feather name="rocket" size={size * 0.3} color={color} />
      </Animated.View>
    </View>
  );
} 