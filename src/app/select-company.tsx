import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth';
import { Empresa } from '../types/auth';
import { CustomButton } from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Animated, { 
    FadeInDown, 
    FadeIn, 
    useAnimatedStyle, 
    withSpring,
    useSharedValue,
    withSequence,
    withTiming,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SelectCompanyScreen() {
    const router = useRouter();
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
    const [loading, setLoading] = useState(true);
    const scale = useSharedValue(1);

    useEffect(() => {
        console.log('🔍 SelectCompanyScreen: Component mounted');
        console.log('🔍 Router object:', router);
        loadEmpresas();
    }, []);

    const loadEmpresas = async () => {
        try {
            console.log('🔍 SelectCompanyScreen: Loading empresas...');
            const user = await authService.getUser();
            if (user && user.empresas) {
                console.log('🔍 SelectCompanyScreen: Empresas loaded:', user.empresas);
                setEmpresas(user.empresas);
            } else {
                console.log('🔍 SelectCompanyScreen: No empresas found');
                Alert.alert('Erro', 'Não foi possível carregar as empresas');
                router.replace('/');
            }
        } catch (error) {
            console.error('🔍 SelectCompanyScreen: Error loading empresas:', error);
            Alert.alert('Erro', 'Erro ao carregar empresas');
            router.replace('/');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectEmpresa = (empresa: Empresa) => {
        console.log('🔍 SelectCompanyScreen: Selected empresa:', empresa);
        setSelectedEmpresa(empresa);
        scale.value = withSequence(
            withSpring(0.95, { damping: 2 }),
            withSpring(1, { damping: 2 })
        );
    };

    const handleConfirm = async () => {
        if (!selectedEmpresa) {
          Alert.alert('Atenção', 'Selecione uma empresa para continuar');
          return;
        }
      
        console.log('🔍 SelectCompanyScreen: Selected empresa:', selectedEmpresa);
      
        try {
          // Busca serviços
          const servicos = await authService.buscarServicos(selectedEmpresa.id);
          console.log('✅ Serviços da empresa:', servicos);
      
          // Filtra apenas os campos desejados
          const servicosFiltrados = servicos.map((servico: any) => ({
            nome: servico.nome,
            tipo_servico: servico.tipo_servico,
            hora_inicio: servico.hora_inicio,
            hora_final: servico.hora_final,
          }));
      
          // Salva no AsyncStorage
          await AsyncStorage.setItem('servicos', JSON.stringify(servicosFiltrados));
          console.log('✅ Serviços salvos no AsyncStorage!');
      
          // Navega para a tela de votação
          router.push({
            pathname: '/vote',
            params: { 
              empresaId: selectedEmpresa.id, 
              empresaNome: selectedEmpresa.nome 
            }
          });
        } catch (error) {
          console.error('❌ Erro ao buscar serviços ou salvar:', error);
          Alert.alert('Erro', 'Erro ao buscar ou salvar os serviços');
        }
      };
      

    const handleLogout = async () => {
        console.log('🔍 SelectCompanyScreen: Starting logout process');
        try {
            await authService.logout();
            console.log('🔍 SelectCompanyScreen: Logout successful, navigating to login');
            router.replace('/');
        } catch (error) {
            console.error('🔍 SelectCompanyScreen: Logout error:', error);
            Alert.alert('Erro', 'Erro ao fazer logout');
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#FF5500" />
                <Text className="mt-4 text-lg text-gray-600">Carregando empresas...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                colors={['#FF5500', '#FF7F50']}
                className="absolute top-0 left-0 right-0 h-48"
            />
            
            <View className="flex-1">
                <View className="p-6 pt-12 flex-row justify-between items-center">
                    <Animated.View entering={FadeInDown.duration(1000).springify()}>
                        <Text className="text-3xl font-bold text-white mb-2">
                            Bem-vindo!
                        </Text>
                        <Text className="text-white/90 text-lg">
                            Selecione uma empresa para avaliar
                        </Text>
                    </Animated.View>
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-white/20 p-3 rounded-full"
                    >
                        <MaterialIcons 
                            name="logout" 
                            size={24} 
                            color="white"
                        />
                    </TouchableOpacity>
                </View>

                <View className="flex-1 bg-white rounded-t-3xl -mt-6 shadow-lg">
                    <ScrollView 
                        className="flex-1 px-4 pt-6"
                        showsVerticalScrollIndicator={false}
                    >
                        {empresas.map((empresa, index) => (
                            <TouchableOpacity
                                key={empresa.id}
                                style={{
                                    marginBottom: 16,
                                    borderRadius: 16,
                                    overflow: 'hidden',
                                    borderWidth: 2,
                                    borderColor: selectedEmpresa?.id === empresa.id ? '#FF5500' : '#f3f4f6',
                                    shadowColor: selectedEmpresa?.id === empresa.id ? '#FF5500' : 'transparent',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 4,
                                    elevation: 3,
                                }}
                                onPress={() => handleSelectEmpresa(empresa)}
                            >
                                <View style={{ padding: 16 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 28,
                                            backgroundColor: selectedEmpresa?.id === empresa.id ? '#fef3c7' : '#fff7ed',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 16,
                                        }}>
                                            <MaterialIcons 
                                                name="business" 
                                                size={28} 
                                                color="#FF5500"
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{
                                                fontSize: 20,
                                                fontWeight: '600',
                                                color: '#1f2937',
                                            }}>
                                                {empresa.nome}
                                            </Text>
                                            <Text style={{
                                                fontSize: 14,
                                                color: '#6b7280',
                                                marginTop: 4,
                                            }}>
                                                Clique para avaliar
                                            </Text>
                                        </View>
                                        {selectedEmpresa?.id === empresa.id ? (
                                            <View style={{
                                                backgroundColor: '#FF5500',
                                                borderRadius: 12,
                                                padding: 8,
                                            }}>
                                                <Ionicons 
                                                    name="checkmark" 
                                                    size={20} 
                                                    color="white"
                                                />
                                            </View>
                                        ) : (
                                            <View style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 16,
                                                borderWidth: 2,
                                                borderColor: '#d1d5db',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                                <View style={{
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: 8,
                                                    borderWidth: 2,
                                                    borderColor: '#d1d5db',
                                                }} />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View className="p-4 bg-white border-t border-gray-100">
                        <CustomButton
                            title="Continuar"
                            onPress={handleConfirm}
                            disabled={!selectedEmpresa}
                            className="bg-[#FF5500] py-4 shadow-lg shadow-orange-500/30"
                            textClassName="text-white font-semibold text-lg"
                        />
                    </View>
                </View>
            </View>

            <Animated.Text
                entering={FadeIn}
                className="absolute bottom-6 right-6 text-gray-500 font-medium text-sm"
            >
                Desenvolvido por Gratification | Versão 1.0
            </Animated.Text>
        </View>
    );
} 