import { View, Text, TextInput, TextInputProps } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function CustomInput({ label, error, ...props }: CustomInputProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
    };
  });

  useEffect(() => {
    if (error) {
      scale.value = withSequence(
        withSpring(0.98, { damping: 2 }),
        withSpring(1, { damping: 2 })
      );
      translateY.value = withSequence(
        withTiming(-2, { duration: 100, easing: Easing.linear }),
        withTiming(0, { duration: 100, easing: Easing.linear })
      );
    }
  }, [error]);

  return (
    <View className="space-y-2">
      <Text className="text-gray-700 font-medium">{label}</Text>
      <Animated.View style={animatedStyle}>
        <TextInput
          className="border-2 border-gray-200 rounded-xl p-4 bg-white text-gray-800"
          placeholderTextColor="#9CA3AF"
          {...props}
        />
      </Animated.View>
      {error && (
        <Text className="text-red-500 text-sm">{error}</Text>
      )}
    </View>
  );
} 