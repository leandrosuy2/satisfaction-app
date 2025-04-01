export interface User {
  id: string;
  username: string;
  nome: string;
  email: string;
  cargo: string;
  perfil_acesso: string;
  empresas: Empresa[];
}

export interface Empresa {
  id: string;
  nome: string;
  logo?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Voto {
  id_empresa: string;
  id_tipo_servico?: string;
  avaliacao: 'Ótimo' | 'Bom' | 'Regular' | 'Ruim';
  comentario?: string;
} 