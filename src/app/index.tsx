import React, { useState } from 'react';
import { View, Text, TextInput, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth';
import { CustomButton } from '../components/CustomButton';
import Animated, {
    FadeInDown,
    FadeIn,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const { width } = Dimensions.get('window');

const loginSchema = z.object({
    username: z.string()
        .min(1, 'Username é obrigatório'),
    password: z.string()
        .min(6, 'A senha deve ter no mínimo 6 caracteres')
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    });

    const handleLogin = async (data: LoginFormData) => {
        try {
            setLoading(true);
            await authService.login({
                username: data.username,
                password: data.password
            });
            router.replace('/select-company');
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1">
            <ImageBackground
                source={{ uri: 'https://assets.technologyadvice.com/uploads/2023/10/Employee-Satisfaction.jpeg' }}
                className="flex-1"
                resizeMode="cover"
            >
                <BlurView intensity={15} className="flex-1 bg-black/40">
                    <View className="flex-1 justify-center px-4">
                        <Animated.View
                            entering={FadeInDown.duration(1000).springify()}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 items-center mx-auto"
                            style={{ width: Math.min(580, width - 32) }}
                        >
                            <View className="items-center mb-8 w-full px-2">
                                <Text className="text-4xl font-bold text-[#FF5500] mb-3">
                                    SATISFACTION
                                </Text>
                            </View>

                            <View className="w-full px-4">
                                <View className="mb-2">
                                    <Controller
                                        control={control}
                                        name="username"
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <TextInput
                                                    className={`w-full bg-gray-50/80 border-2 ${errors.username ? 'border-red-500/50' : 'border-[#FF5500]/20 focus:border-[#FF5500]/40'} rounded-2xl px-6 py-4 text-base`}
                                                    placeholder="Digite seu usuário"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    autoCapitalize="none"
                                                    placeholderTextColor="#9CA3AF"
                                                />
                                                {errors.username && (
                                                    <Text className="text-red-500 text-sm mt-1 ml-2">
                                                        {errors.username.message}
                                                    </Text>
                                                )}
                                            </>
                                        )}
                                    />
                                </View>

                                <View className="mb-2">
                                    <Controller
                                        control={control}
                                        name="password"
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <TextInput
                                                    className={`w-full bg-gray-50/80 border-2 ${errors.password ? 'border-red-500/50' : 'border-[#FF5500]/20 focus:border-[#FF5500]/40'} rounded-2xl px-6 py-4 text-base`}
                                                    placeholder="Digite sua senha"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    secureTextEntry
                                                    placeholderTextColor="#9CA3AF"
                                                />
                                                {errors.password && (
                                                    <Text className="text-red-500 text-sm mt-1 ml-2">
                                                        {errors.password.message}
                                                    </Text>
                                                )}
                                            </>
                                        )}
                                    />
                                </View>

                                <View className="w-full">
                                    <CustomButton
                                        title="ENTRAR"
                                        onPress={handleSubmit(handleLogin)}
                                        loading={loading}
                                        className="bg-[#FF5500] py-4 shadow-lg shadow-orange-500/30 w-full"
                                    />
                                </View>
                            </View>
                        </Animated.View>
                    </View>

                    <Animated.Text
                        entering={FadeIn}
                        className="absolute bottom-6 right-6 text-white/90 font-medium text-sm"
                    >
                        Desenvolvido por Gratification | Versão 1.0
                    </Animated.Text>
                </BlurView>
            </ImageBackground>
        </View>
    );
} 