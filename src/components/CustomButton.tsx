import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
  textClassName?: string;
}

export function CustomButton({ 
  onPress, 
  title, 
  loading, 
  disabled,
  variant = 'primary',
  className = '',
  textClassName = '',
}: CustomButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 2 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 2 });
  };

  const baseStyles = variant === 'primary' 
    ? 'bg-blue-500' 
    : 'bg-gray-200';

  return (
    <Animated.View style={animatedStyle} className="w-full">
      <TouchableOpacity
        className={`${baseStyles} rounded-xl p-4 ${disabled ? 'opacity-50' : ''} ${className}`}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text 
            className={`text-center font-semibold text-white text-lg ${textClassName}`}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
} 