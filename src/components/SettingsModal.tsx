import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../styles/settingsModalStyles'; // A gente já vai criar isso

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity
        activeOpacity={1}
        style={styles.modalBackground}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <Animated.View
            entering={SlideInUp.springify().damping(15)}
            style={styles.modalContainer}
          >
            <LinearGradient colors={['#222', '#111']} style={styles.modalContent}>
              <Animated.Text
                entering={FadeIn.delay(200)}
                style={styles.title}
              >
                Configurações
              </Animated.Text>

              {/* Tabela */}
              <Animated.View entering={FadeIn.delay(400)} style={styles.table}>
                <View style={styles.row}>
                  <Text style={styles.cell}>Coluna 1</Text>
                  <Text style={styles.cell}>Coluna 2</Text>
                  <Text style={styles.cell}>Coluna 3</Text>
                  <Text style={styles.cell}>Coluna 4</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cell}>Linha 2.1</Text>
                  <Text style={styles.cell}>Linha 2.2</Text>
                  <Text style={styles.cell}>Linha 2.3</Text>
                  <Text style={styles.cell}>Linha 2.4</Text>
                </View>
              </Animated.View>

              {/* Botão fechar */}
              <Animated.View entering={FadeIn.delay(600)}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <LinearGradient
                    colors={['#FFD700', '#FFA500']}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.closeButtonText}>Fechar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
