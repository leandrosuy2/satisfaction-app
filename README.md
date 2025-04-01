# Satisfaction App

Um aplicativo móvel para avaliação de serviços e empresas, desenvolvido com React Native e Expo.

## 📱 Sobre o Projeto

O Satisfaction App é uma aplicação móvel que permite aos usuários avaliarem serviços e empresas de forma simples e intuitiva. O aplicativo oferece uma interface moderna e amigável para registrar feedback sobre experiências com diferentes empresas.

### Principais Funcionalidades

- 🔐 Autenticação de usuários
- 🏢 Seleção de empresas
- ⭐ Sistema de avaliação com 4 níveis (Ótimo, Bom, Regular, Ruim)
- 💬 Comentários opcionais para avaliações negativas
- 📱 Interface responsiva e adaptativa
- 🎨 Design moderno com animações suaves

## 🛠️ Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- React Native Reanimated (para animações)
- Expo Linear Gradient
- AsyncStorage para persistência local
- React Navigation/Expo Router

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (para desenvolvimento Android)
- Xcode (para desenvolvimento iOS, apenas macOS)

## 🚀 Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/leandrosuy2/satisfaction-app
cd satisfaction-app
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
Ou altere somente o arquivo auth.ts
```
API_URL=http://seu-ip:3005
```

4. Inicie o projeto:
```bash
npx expo start
```

5. Execute no dispositivo:
- Escaneie o QR Code com o aplicativo Expo Go (Android) ou Câmera (iOS)
- Ou pressione 'a' para abrir no emulador Android
- Ou pressione 'i' para abrir no simulador iOS (apenas macOS)

## 🔧 Configuração do Ambiente de Desenvolvimento

### Android
1. Instale o Android Studio
2. Configure um emulador Android ou conecte um dispositivo físico
3. Habilite a depuração USB no dispositivo Android

### iOS (apenas macOS)
1. Instale o Xcode
2. Instale o CocoaPods
3. Configure um simulador iOS ou conecte um dispositivo físico

## 📱 Estrutura do Projeto

```
satisfaction-app/
├── src/
│   ├── app/              # Telas do aplicativo
│   ├── components/       # Componentes reutilizáveis
│   ├── services/        # Serviços e APIs
│   ├── types/          # Definições de tipos TypeScript
│   └── utils/          # Funções utilitárias
├── assets/             # Recursos estáticos
└── App.tsx            # Componente principal
```

## 🔐 Autenticação

O aplicativo utiliza autenticação JWT (JSON Web Token) para garantir a segurança das requisições. O token é armazenado localmente usando AsyncStorage.

## 📊 API

O aplicativo se comunica com uma API REST que deve estar rodando na porta 3005. As principais rotas são:

- `POST /auth/login` - Autenticação de usuários
- `POST /votes` - Registro de avaliações

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

