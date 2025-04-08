import { AuthResponse, LoginCredentials, Voto } from '../types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.15.85:3005';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      await AsyncStorage.setItem('token', data.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  },

  async getUser(): Promise<any> {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  },

  async enviarVoto(voto: Voto): Promise<void> {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_URL}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(voto),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Erro ao enviar voto');
      }
    } catch (error) {
      throw error;
    }
  }
}; 