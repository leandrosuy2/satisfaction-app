import React, { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';



import {
    View,
    Text,
    TextInput,
    ScrollView,
    Alert,
    Pressable,
    StyleSheet,
    Platform,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    TouchableWithoutFeedback,
    useWindowDimensions
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authService } from '../services/auth';
import { Voto } from '../types/auth';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withSequence,
    FadeIn,
    SlideInDown,
    SlideInUp,
    SharedValue
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';


interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const { width, height } = Dimensions.get('window');
const isLandscape = width > height;

const CustomModal = ({ visible, onClose, children }: CustomModalProps) => {
    if (!visible) return null;

    return (
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={customModalStyles.overlay}>
                <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                    <View style={customModalStyles.content}>
                        {children}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    );
};

const customModalStyles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    content: {
        width: '85%',
        backgroundColor: '#222',
        borderRadius: 20,
        padding: 25,
        borderWidth: 2,
        borderColor: '#FFD700',
        maxWidth: 400,
    },
});

// Thank You Modal Component
const ThankYouModal = ({ visible, onClose, rating }) => {
    if (!visible) return null;

    return (
        <TouchableOpacity 
            activeOpacity={1} 
            style={thankYouStyles.overlay}
            onPress={onClose}
        >
            
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                <Animated.View 
                    entering={SlideInUp.springify().damping(15)}
                    style={thankYouStyles.modalContainer}
                >
                    <LinearGradient
                        colors={['#222', '#111']}
                        style={thankYouStyles.modalContent}
                    >
                        <Animated.View 
                            entering={FadeIn.delay(300)}
                            style={thankYouStyles.iconContainer}
                        >
                            <FontAwesome name="check-circle" size={80} color="#FFD700" />
                        </Animated.View>
                        
                        <Animated.Text 
                            entering={FadeIn.delay(400)}
                            style={thankYouStyles.thankYouText}
                        >
                            Obrigado pela sua avaliação!
                        </Animated.Text>
                        
                        <Animated.Text 
                            entering={FadeIn.delay(500)}
                            style={thankYouStyles.ratingText}
                        >
                            Você classificou nossa experiência como:
                        </Animated.Text>
                        
                        <Animated.View 
                            entering={FadeIn.delay(600)}
                            style={thankYouStyles.ratingBadge}
                        >
                            <Text style={thankYouStyles.ratingBadgeText}>{rating}</Text>
                        </Animated.View>
                        
                        <Animated.Text 
                            entering={FadeIn.delay(700)}
                            style={thankYouStyles.feedbackText}
                        >
                            Sua opinião é muito importante para continuarmos melhorando nossos serviços.
                        </Animated.Text>
                        
                        <Animated.View entering={FadeIn.delay(800)}>
                            <TouchableOpacity 
                                style={thankYouStyles.closeButton} 
                                onPress={onClose}
                            >
                                <LinearGradient
                                    colors={['#FFD700', '#FFA500']}
                                    style={thankYouStyles.gradientButton}
                                >
                                    <Text style={thankYouStyles.closeButtonText}>Continuar</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </LinearGradient>
                </Animated.View>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const thankYouStyles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContainer: {
        width: Dimensions.get('window').width * 0.85,
        maxWidth: 400,
        borderRadius: 25,
        overflow: 'hidden',
        elevation: 20,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    modalContent: {
        padding: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFD700',
        borderRadius: 25,
    },
    iconContainer: {
        marginBottom: 20,
        height: 100,
        width: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thankYouText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 15,
    },
    ratingText: {
        fontSize: 16,
        color: '#E5E7EB',
        textAlign: 'center',
        marginBottom: 15,
    },
    ratingBadge: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFD700',
        marginBottom: 20,
    },
    ratingBadgeText: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
    },
    feedbackText: {
        fontSize: 14,
        color: '#E5E7EB',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 20,
    },
    closeButton: {
        width: 200,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
    },
    gradientButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    closeButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

const AVALIACOES: Array<{
    label: Voto['avaliacao'];
    icon: 'smile-o' | 'thumbs-o-up' | 'meh-o' | 'frown-o';
    color: string;
    bgColor: string;
    gradient: readonly [string, string];
}> = [
    {
        label: 'Ótimo',
        icon: 'smile-o',
        color: '#2ecc71', // verde bonito pro ícone e texto
        bgColor: 'rgba(46, 204, 113, 0.2)', // verde clarinho de fundo
        gradient: ['#2ecc71', '#27ae60'] as const // degrade verdinho
    }   ,
    {
        label: 'Bom',
        icon: 'thumbs-o-up',
        color: '#FFD700', // amarelo ouro
        bgColor: 'rgba(255, 215, 0, 0.15)', // fundo amarelo clarinho
        gradient: ['#FFD700', '#FFA500'] as const // degradê de amarelo pro laranja
    },
    {
        label: 'Regular',
        icon: 'meh-o',
        color: '#FFA500', // laranja padrão
        bgColor: 'rgba(255, 165, 0, 0.15)', // laranja mais suave de fundo
        gradient: ['#FFA500', '#FF8C00'] as const // degradê de laranja pro laranja escuro
    },
    {
    label: 'Ruim',
    icon: 'frown-o',
    color: '#FF4C4C', // vermelho forte pro ícone
    bgColor: 'rgba(255, 76, 76, 0.15)', // fundo vermelho suave
    gradient: ['#FF4C4C', '#FF0000'] as const // degradê vermelho claro → vermelho intenso
},
];

export default function VoteScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ empresaId: string; empresaNome: string }>();
    const [avaliacao, setAvaliacao] = useState<Voto['avaliacao'] | null>(null);
    const [comentario, setComentario] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showThankYouModal, setShowThankYouModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    // Usar useWindowDimensions para detectar mudanças de orientação
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const cardSize = isLandscape ? width / 5 : width * 0.6;
    const [refeicoes, setRefeicoes] = useState([]);
    const [votosPendentes, setVotosPendentes] = useState(0);
    const [servicoAtualNome, setServicoAtualNome] = useState<string>(''); 

    // const state = await NetInfo.fetch();



useEffect(() => {
  if (showSettingsModal) {
    const loadRefeicoes = async () => {
      try {
        const data = await AsyncStorage.getItem('servicos');
        if (data) {
          const parsed = JSON.parse(data);

          const formatado = parsed.map((item: any) => ({
            tipo: item.nome,            
            inicio: item.hora_inicio,
            fim: item.hora_final,
          }));

          setRefeicoes(formatado);
        }
      } catch (error) {
        console.error('Erro ao carregar refeições:', error);
      }
    };

    loadRefeicoes();
  }
}, [showSettingsModal]);

    // 🔌 Verifica e reenvia votos pendentes ao reconectar
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(async state => {
            if (state.isConnected) {
                const pendentesStr = await AsyncStorage.getItem('votos_pendentes');
                const pendentes = pendentesStr ? JSON.parse(pendentesStr) : [];
    
                if (pendentes.length > 0) {
                    console.log('📡 Internet voltou! Enviando votos pendentes...');
    
                    for (const voto of pendentes) {
                        try {
                            await authService.enviarVoto(voto);
                            console.log('✅ Voto reenviado:', voto);
                        } catch (e) {
                            console.log('❌ Erro ao reenviar voto:', voto);
                        }
                    }
    
                    await AsyncStorage.removeItem('votos_pendentes');
                    await atualizarVotosPendentes(); // 👈 MANTÉM ESTE COM O CONTADOR
                }
            }
        });
    
        return () => unsubscribe();
    }, []);


    const atualizarVotosPendentes = async () => {
        try {
            const pendentesStr = await AsyncStorage.getItem('votos_pendentes');
            const pendentes = pendentesStr ? JSON.parse(pendentesStr) : [];
            setVotosPendentes(pendentes.length);
        } catch (error) {
            console.error('Erro ao contar votos pendentes:', error);
            setVotosPendentes(0);
        }
    };

    const determinarServicoAtual = async () => {
        try {
            const agora = new Date();
            const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
    
            const servicosString = await AsyncStorage.getItem('servicos');
            if (servicosString) {
                const servicos = JSON.parse(servicosString);
    
                const servicoEmAndamento = servicos.find((servico: any) => {
                    const [hInicio, mInicio] = servico.hora_inicio.split(':').map(Number);
                    const [hFim, mFim] = servico.hora_final.split(':').map(Number);
                    const inicioMin = hInicio * 60 + mInicio;
                    const fimMin = hFim * 60 + mFim;
    
                    return minutosAgora >= inicioMin && minutosAgora <= fimMin;
                });
    
                if (servicoEmAndamento) {
                    setServicoAtualNome(servicoEmAndamento.nome);
                } else {
                    setServicoAtualNome('Intervalo');
                }
            } else {
                setServicoAtualNome('Intervalo');
            }
        } catch (error) {
            console.error('Erro ao determinar serviço atual:', error);
            setServicoAtualNome('Intervalo');
        }
    };
    useEffect(() => {
        if (!showThankYouModal) {
          atualizarVotosPendentes();
        }
      }, [showThankYouModal]);
      useEffect(() => {
        determinarServicoAtual();
    }, []);

    

    // Criar um objeto para armazenar os valores de escala para cada botão
    const scaleValues: Record<Voto['avaliacao'], SharedValue<number>> = {
        'Ótimo': useSharedValue(1),
        'Bom': useSharedValue(1),
        'Regular': useSharedValue(1),
        'Ruim': useSharedValue(1)
    };

    const handleSelectRating = (opcao: Voto['avaliacao']) => {
        if (loading) return; // Evita múltiplos envios
        setAvaliacao(opcao);
    
        scaleValues[opcao].value = withSequence(
            withSpring(1.2, { damping: 12 }),
            withSpring(1)
        );
    
        if (opcao === 'Regular' || opcao === 'Ruim') {
            setShowModal(true);
        } else {
            enviarVoto(opcao);
        }
    };

    const enviarVoto = async (opcao: Voto['avaliacao'], comentarioTexto?: string) => {
        if (loading) return;
    
        setLoading(true);
    
        try {
            const agora = new Date();
            const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
    
            const servicosString = await AsyncStorage.getItem('servicos');
            let idTipoServico: string | undefined;
    
            if (servicosString) {
                const servicos = JSON.parse(servicosString);
    
                const servicoAtual = servicos.find((servico: any) => {
                    const [hInicio, mInicio] = servico.hora_inicio.split(':').map(Number);
                    const [hFim, mFim] = servico.hora_final.split(':').map(Number);
                    const inicioMin = hInicio * 60 + mInicio;
                    const fimMin = hFim * 60 + mFim;
    
                    return minutosAgora >= inicioMin && minutosAgora <= fimMin;
                });
    
                if (servicoAtual) {
                    idTipoServico = servicoAtual.tipo_servico;
                }
            }
    
            const votoData = {
                id_empresa: params.empresaId,
                avaliacao: opcao,
                comentario: comentarioTexto,
                id_tipo_servico: idTipoServico,
            };
    
            let conectado = false;
    
            try {
                const state = await NetInfo.fetch();
                conectado = state.isConnected ?? false;
            } catch (err) {
                console.warn('Falha ao verificar conexão. Assumindo offline.');
            }
    
            if (conectado) {
                console.log('🟢 Conectado! Enviando voto...');
                await authService.enviarVoto(votoData);
            } else {
                console.log('🔴 Offline. Salvando voto local...');
                await salvarVotoLocal(votoData);
            }
    
            setShowThankYouModal(true);
        } catch (error) {
            console.error('Erro ao enviar voto:', error);
            await salvarVotoLocal({
                id_empresa: params.empresaId,
                avaliacao: opcao,
                comentario: comentarioTexto,
            });
            Alert.alert('Offline', 'Seu voto foi salvo e será enviado quando a internet voltar.');
        } finally {
            setLoading(false);
        }
    };
    const salvarVotoLocal = async (votoData) => {
        try {
            const pendentesStr = await AsyncStorage.getItem('votos_pendentes');
            const pendentes = pendentesStr ? JSON.parse(pendentesStr) : [];
            pendentes.push(votoData);
            await AsyncStorage.setItem('votos_pendentes', JSON.stringify(pendentes));
            await atualizarVotosPendentes();
            console.log('💾 Voto salvo localmente com sucesso.');
        } catch (e) {
            console.error('❌ Falha ao salvar voto local:', e);
        }
    };  
  


    const handleEnviarComentario = () => {
        if (!avaliacao) return;

        enviarVoto(avaliacao, comentario);
        setShowModal(false);
    };

    const handleCloseThankYouModal = () => {
        setShowThankYouModal(false);
        setAvaliacao(null);      // ← limpa o botão selecionado
        setComentario('');       // ← limpa o comentário (opcional)
        // router.replace('/vote');
    };
    const handleRefresh = async (params) => {
        console.log("Atualizar");
    
        try {
            const servicos = await authService.buscarServicos(params.empresaId);
            console.log('✅ Serviços da empresa:', servicos);
    
            const servicosFiltrados = servicos.map((servico: any) => ({
                nome: servico.nome,
                tipo_servico: servico.tipo_servico,
                hora_inicio: servico.hora_inicio,
                hora_final: servico.hora_final,
            }));
    
            await AsyncStorage.setItem('servicos', JSON.stringify(servicosFiltrados));
            console.log('✅ Serviços salvos no AsyncStorage!');
    
            // 🔥 CHAMA AQUI DEPOIS DE ATUALIZAR
            await determinarServicoAtual();
    
            Alert.alert('Sucesso', 'Serviços Atualizados!');
        } catch (error) {
            console.error('Erro ao atualizar os serviços:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao atualizar os serviços.');
        }
    };
      
      const handleCloudAction = () => {
        // Ex: poderia ser salvar em nuvem
        console.log("Nuvem");
      };
      
      const handleSettings = () => {
        // Ex: abrir tela de configurações
        console.log("Engrenagem");
      };

    return (
        <ImageBackground
            source={{ uri: 'https://assets.technologyadvice.com/uploads/2023/10/Employee-Satisfaction.jpeg' }}
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.topIconsContainer}>
            <TouchableOpacity onPress={() => handleRefresh(params)}>
                <FontAwesome name="refresh" size={30} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCloudAction} style={{ position: 'relative' }}>
                <FontAwesome name="cloud" size={30} color="#000" />

                {votosPendentes > 0 && (
                    <View
                        style={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            backgroundColor: '#FFD700',
                            borderRadius: 10,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            minWidth: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 12 }}>
                            {votosPendentes}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowSettingsModal(true)}>
                <FontAwesome name="cog" size={30} color="#000" />
            </TouchableOpacity>
            </View>
            <BlurView intensity={15} className="flex-1 bg-black/40 justify-center items-center">
            <View
                className="bg-white/90 rounded-3xl p-4 mx-auto"
                style={{
                width: 620, // ou qualquer valor fixo ou responsivo
                height: 320,
                // maxWidth: '90%',
                // maxHeight: '90%',
                justifyContent: 'center',
                }}
            >
                            <SafeAreaView style={styles.voteContainer}>
                     <Animated.View
                                                entering={FadeInDown.duration(1000).springify()}
                                                className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 items-center mx-auto"
                                                style={{ width: Math.min(580, width - 32) }}
                                            >
                                       <Text style={{ color: '#FF0000', fontSize: 40, fontWeight: 'bold' }}>
                                        {servicoAtualNome}
                                    </Text>

                        <Text style={[
                            styles.voteTitle,
                            isLandscape && styles.voteTitleLandscape,
                            { color: '#000' }
                        ]}>Como foi sua experiência?</Text>
                        <Text style={[
                            styles.voteSubtitle,
                            isLandscape && styles.voteSubtitleLandscape,
                            { color: '#000' }
                        ]}>
                            Sua opinião é muito importante para nós
                        </Text>
                    </Animated.View>

                    <ScrollView
                        contentContainerStyle={[
                            styles.scrollView,
                            isLandscape && styles.scrollViewLandscape
                        ]}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.voteOptions}>
                            {AVALIACOES.map(({ label, icon, color, bgColor }, index) => {
                                const isSelected = avaliacao === label;
                                const animatedStyle = useAnimatedStyle(() => ({
                                transform: [{ scale: scaleValues[label].value }]
                                }));

                                return (
                                <Animated.View
                                    key={label}
                                    style={[styles.voteOptionContainer, animatedStyle]}
                                    entering={SlideInDown.delay(index * 100)}
                                >
                                    <Pressable
                                    onPress={() => handleSelectRating(label)}
                                    disabled={loading}
                                    style={({ pressed }) => ({
                                        backgroundColor: isSelected ? bgColor : '#fff',
                                        borderRadius: 20,
                                        borderWidth: isSelected ? 2 : 0,
                                        borderColor: isSelected ? color : 'transparent',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 6,
                                        elevation: 5,
                                        padding: 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        transform: [{ scale: pressed ? 0.96 : 1 }],
                                        width: 140,
                                        height: 140,
                                    })}
                                    >
                                    <FontAwesome name={icon} size={42} color={isSelected ? '#fff' : color} />
                                    <Text style={{
                                        color: isSelected ? '#fff' : '#000',
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                        marginTop: 8,
                                    }}>
                                        {label}
                                    </Text>
                                    </Pressable>
                                </Animated.View>
                                );
                            })}
                            </View>

                    </ScrollView>
                </SafeAreaView>
            </View>
            </BlurView>

            {/* Modal de comentário */}
            <CustomModal
                visible={showModal}
                onClose={() => {
                    setShowModal(false);
                    setAvaliacao(null);
                }}
            >
                <Text style={styles.modalTitle}>Deixe seu comentário</Text>
                <Text style={styles.modalSubtitle}>Conte-nos mais sobre sua experiência</Text>

                <TextInput
                    style={styles.modalInput}
                    placeholder="O que podemos melhorar?"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    multiline
                    value={comentario}
                    onChangeText={setComentario}
                />

                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={() => {
                            setShowModal(false);
                            setAvaliacao(null);
                        }}
                    >
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.modalButton, styles.submitButton]}
                        onPress={handleEnviarComentario}
                    >
                        <Text style={styles.submitText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </CustomModal>

            {/* Modal de agradecimento */}
            <ThankYouModal 
                visible={showThankYouModal}
                onClose={handleCloseThankYouModal}
                rating={avaliacao}
            />

            

<CustomModal
    visible={showSettingsModal}
    onClose={() => setShowSettingsModal(false)}
>
    <Text style={styles.modalTitle}>Configurações</Text>

        <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#FFD700' }}>
                <Text style={styles.cellHeader}>Refeição</Text>
                <Text style={styles.cellHeader}>Inicio</Text>
                <Text style={styles.cellHeader}>Fim</Text>
            </View>

            {/* Linhas com os dados reais */}
            {refeicoes.map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc' }}>
                <Text style={styles.cell}>{item.tipo}</Text>
                <Text style={styles.cell}>{item.inicio}</Text>
                <Text style={styles.cell}>{item.fim}</Text>
                </View>
            ))}
              <TouchableOpacity
        onPress={() => setShowSettingsModal(false)}
        style={{
            marginTop: 20,
            alignSelf: 'center',
            backgroundColor: '#FFD700',
            paddingHorizontal: 24,
            paddingVertical: 10,
            borderRadius: 10,
        }}
    >
        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>OK</Text>
    </TouchableOpacity>
        </View>
    </CustomModal>
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    voteContainer: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    headerLandscape: {
        marginBottom: 20,
        marginTop: 10,
    },
    voteTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        ...Platform.select({
            web: {
                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
            }
        })
    },
    voteTitleLandscape: {
        fontSize: 24,
        marginBottom: 4,
    },
    voteSubtitle: {
        fontSize: 16,
        color: '#E5E7EB',
        textAlign: 'center',
    },
    voteSubtitleLandscape: {
        fontSize: 14,
    },
    scrollView: {
        paddingBottom: 32,
    },
    scrollViewLandscape: {
        paddingBottom: 16,
    },
    voteOptions: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 12,
        marginTop: 16,
      },
    voteOptionsLandscape: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-around',
        gap: 10,
    },
    voteOptionContainer: {
        flex: 1,
        maxWidth: 160, // ou ajuste conforme sua necessidade
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    voteOptionContainerLandscape: {
        width: '23%',
        maxWidth: 150,
        aspectRatio: 0.9,
        padding: 5,
    },
    voteOption: {
        width: 120,
        height: 140,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
      },
    voteButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    pressed: {
        opacity: 0.8,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    iconContainerLandscape: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
    },
    voteLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFD700',//mudar a cor da fonte do icon
        textAlign: 'center',
    },

    // Estilos do modal de comentário
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#E5E7EB',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        width: '100%',
        height: 150,
        backgroundColor: '#333',
        borderRadius: 12,
        padding: 16,
        color: '#FFFFFF',
        textAlignVertical: 'top',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    modalButtons: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: 10,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#444',
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    submitButton: {
        backgroundColor: '#FFD700',
    },
    cancelText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    submitText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    topIconsContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      // ... já existentes
    cellHeader: {
        flex: 1,
        fontWeight: 'bold',
        padding: 8,
        color: '#FFD700',
        textAlign: 'center'
    },
    cell: {
        flex: 1,
        padding: 8,
        color: '#FFF',
        textAlign: 'center'
    },
});