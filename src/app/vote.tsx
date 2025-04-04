import React, { useState, useEffect } from 'react';
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

interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

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
        color: '#FFD700',
        bgColor: 'rgba(255, 215, 0, 0.2)',
        gradient: ['#FFD700', '#FFA500'] as const
    },
    {
        label: 'Bom',
        icon: 'thumbs-o-up',
        color: '#FFD700',
        bgColor: 'rgba(255, 215, 0, 0.15)',
        gradient: ['#FFD700', '#FFA500'] as const
    },
    {
        label: 'Regular',
        icon: 'meh-o',
        color: '#FFD700',
        bgColor: 'rgba(255, 215, 0, 0.1)',
        gradient: ['#FFD700', '#FFA500'] as const
    },
    {
        label: 'Ruim',
        icon: 'frown-o',
        color: '#FFD700',
        bgColor: 'rgba(255, 215, 0, 0.05)',
        gradient: ['#FFD700', '#FFA500'] as const
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

    // Usar useWindowDimensions para detectar mudanças de orientação
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    // Criar um objeto para armazenar os valores de escala para cada botão
    const scaleValues: Record<Voto['avaliacao'], SharedValue<number>> = {
        'Ótimo': useSharedValue(1),
        'Bom': useSharedValue(1),
        'Regular': useSharedValue(1),
        'Ruim': useSharedValue(1)
    };

    const handleSelectRating = (opcao: Voto['avaliacao']) => {
        setAvaliacao(opcao);

        // Animar o botão selecionado
        scaleValues[opcao].value = withSequence(
            withSpring(1.2, { damping: 12 }),
            withSpring(1)
        );

        // Verificação simples e direta
        if (opcao === 'Regular' || opcao === 'Ruim') {
            // Abrir modal imediatamente
            setShowModal(true);
        } else {
            // Enviar voto para Ótimo e Bom
            enviarVoto(opcao);
        }
    };

    const enviarVoto = async (opcao: Voto['avaliacao'], comentarioTexto?: string) => {
        if (loading) return;

        try {
            setLoading(true);
            await authService.enviarVoto({
                id_empresa: params.empresaId,
                avaliacao: opcao,
                comentario: comentarioTexto,
                id_tipo_servico: undefined // Optional field
            });

            // Mostrar modal de agradecimento em vez do Alert
            setShowThankYouModal(true);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível registrar sua avaliação. Por favor, tente novamente.');
            console.error('Erro ao enviar voto:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnviarComentario = () => {
        if (!avaliacao) return;

        enviarVoto(avaliacao, comentario);
        setShowModal(false);
    };

    const handleCloseThankYouModal = () => {
        setShowThankYouModal(false);
        router.replace('/vote');
    };

    return (
        <ImageBackground
            source={{ uri: 'https://img.freepik.com/fotos-premium/empresario-tocando-e-fazendo-a-marca-para-selecionar-o-rosto-sorridente-com-cinco-estrelas-amarelas-em-fundo-preto-a-melhor-satisfacao-do-cliente-e-avaliacao-de-produto-e-servico-de-boa-qualidade_50039-2506.jpg' }}
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <SafeAreaView style={styles.voteContainer}>
                    <Animated.View
                        entering={FadeIn.duration(800)}
                        style={[
                            styles.header,
                            isLandscape && styles.headerLandscape
                        ]}
                    >
                        <Text style={[
                            styles.voteTitle,
                            isLandscape && styles.voteTitleLandscape
                        ]}>Como foi sua experiência?</Text>
                        <Text style={[
                            styles.voteSubtitle,
                            isLandscape && styles.voteSubtitleLandscape
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
                        <View style={[
                            styles.voteOptions,
                            isLandscape && styles.voteOptionsLandscape
                        ]}>
                            {AVALIACOES.map(({ label, icon, color, bgColor, gradient }, index) => {
                                const isSelected = avaliacao === label;

                                // Usar o valor de escala específico para este botão
                                const animatedStyle = useAnimatedStyle(() => ({
                                    transform: [{ scale: scaleValues[label].value }]
                                }));

                                return (
                                    <Animated.View
                                        key={label}
                                        entering={SlideInDown.delay(index * 150)}
                                        style={[
                                            styles.voteOptionContainer,
                                            isLandscape && styles.voteOptionContainerLandscape,
                                            animatedStyle
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.voteOption,
                                                isSelected && {
                                                    backgroundColor: bgColor,
                                                    borderWidth: 2,
                                                    borderColor: color
                                                }
                                            ]}
                                        >
                                            <Pressable
                                                onPress={() => handleSelectRating(label as Voto['avaliacao'])}
                                                disabled={loading}
                                                style={({ pressed }) => [
                                                    styles.voteButton,
                                                    pressed && styles.pressed
                                                ]}
                                            >
                                                <LinearGradient
                                                    colors={isSelected ? gradient : ['transparent', 'transparent']}
                                                    style={[
                                                        styles.iconContainer,
                                                        isLandscape && styles.iconContainerLandscape
                                                    ]}
                                                >
                                                    <FontAwesome
                                                        name={icon}
                                                        size={isLandscape ? 36 : 48}
                                                        color={isSelected ? '#FFF' : color}
                                                    />
                                                </LinearGradient>
                                                <Text style={[
                                                    styles.voteLabel,
                                                    isSelected && { color: '#FFFFFF' }
                                                ]}>
                                                    {label}
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </Animated.View>
                                );
                            })}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>

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
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
    },
    voteOptionsLandscape: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-around',
        gap: 10,
    },
    voteOptionContainer: {
        width: '45%',
        maxWidth: 180,
        aspectRatio: 1,
        padding: 10,
    },
    voteOptionContainerLandscape: {
        width: '23%',
        maxWidth: 150,
        aspectRatio: 0.9,
        padding: 5,
    },
    voteOption: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        overflow: 'hidden',
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
        marginBottom: 12,
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
        color: '#FFD700',
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
});