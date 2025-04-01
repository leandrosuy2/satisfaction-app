import { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Slot, useRouter, useSegments } from "expo-router";
import { authService } from "../services/auth";
import "../styles/global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const segments = useSegments();
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        // Adicione suas fontes personalizadas aqui se necessário
    });

    useEffect(() => {
        console.log('🔍 RootLayout: Fonts loaded:', fontsLoaded);
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    useEffect(() => {
        console.log('🔍 RootLayout: Segments changed:', segments);
        checkAuth();
    }, [segments]);

    const checkAuth = async () => {
        try {
            console.log('🔍 RootLayout: Checking auth...');
            const token = await authService.getToken();
            console.log('🔍 RootLayout: Token status:', token ? 'Present' : 'Missing');
            const isLoginPage = segments.length < 1;
            console.log('🔍 RootLayout: Is login page:', isLoginPage);

            if (!token && !isLoginPage) {
                console.log('🔍 RootLayout: No token, redirecting to login');
                router.replace('/');
            } else if (token && isLoginPage) {
                console.log('🔍 RootLayout: Has token, redirecting to select-company');
                router.replace('/select-company');
            }
        } catch (error) {
            console.error('🔍 RootLayout: Auth check error:', error);
            router.replace('/');
        }
    };

    if (!fontsLoaded) {
        console.log('🔍 RootLayout: Fonts not loaded yet');
        return null;
    }

    console.log('🔍 RootLayout: Rendering with segments:', segments);
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Slot />
        </GestureHandlerRootView>
    );
}
