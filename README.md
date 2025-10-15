# **ShopTurbo** Descomplique suas vendas na Shopee! 🚀
<img width="1913" height="961" alt="shopturbo-readme" src="https://github.com/user-attachments/assets/fc85be71-f0ed-4402-bf5d-1ab6f38f5924" />

Um sistema ERP frontend Next.js com uma API criada com express(projeto separado) para gerenciamento e integração com a plataforma da Shopee, oferecendo gestão e controle total de vendas para lojas na Shopee.

## 📋 Descrição

ShopTurbo é uma aplicação web construída com Next.js que facilita o gerenciamento de lojas e produtos na plataforma Shopee.

## 🚀 Tecnologias

-   **Next.js 15** - Framework React com SSR/SSG
-   **React 19 RC** - Biblioteca de interface
-   **Tailwind CSS** - Framework de CSS utilitário
-   **Jose** - Biblioteca JWT para JavaScript
-   **React Icons** - Ícones para React
-   **Context API** - Gerenciamento de estado

## 📦 Dependências

### Principais

-   `next@15.0.3` - Framework Next.js
-   `react@19.0.0-rc` - React (Release Candidate)
-   `react-dom@19.0.0-rc` - React DOM
-   `jose@^6.1.0` - Manipulação de JWT
-   `react-icons@^5.3.0` - Biblioteca de ícones

### Desenvolvimento

-   `postcss@^8`
-   `tailwindcss@^3.4.1`

## 🛠️ Instalação

### Pré-requisitos

-   Node.js 22+
-   API ShopTurbo-server rodando (API disponível em [API ShopTurbo](https://github.com/developer-gilberto/shopturbo-server))

### Configuração

1. Clone o repositório:

```bash
git clone https://github.com/developer-gilberto/shopturbo.git
cd shopturbo
```

2. Instale as dependências:

```bash
# Com npm
npm install

# Com yarn
yarn install

# Com pnpm
pnpm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env

NEXT_PUBLIC_SERVER_URL=http://localhost:5000
JWT_SECRET=your-jwt-secret-key # JWT Secret (deve ser igual ao da API ShopTurbo-server)
NODE_ENV=development
COOKIES_DOMAIN=localhost
```

## 🏃 Execução

### Desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`

### Produção

```bash
# Build
npm run build
# ou
yarn build
# ou
pnpm build

# Start
npm run start
# ou
yarn start
# ou
pnpm start
```

## 🎨 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── (privates)/         # Rotas privadas (requer autenticação)
│   │   ├── commission/     # Página de comissões
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── integrate/      # Integração com Shopee
│   │   ├── my-account/     # Conta do usuário
│   │   ├── products/       # Gerenciamento de produtos
│   │   ├── profit/         # Análise de lucros
│   │   ├── support/        # Suporte
│   │   └── taxes/          # Impostos
│   ├── (publics)/          # Rotas públicas
│   │   ├── FAQ/            # Perguntas frequentes
│   │   ├── signin/         # Login
│   │   ├── signup/         # Cadastro
│   │   ├── signature/      # Assinatura
│   │   └── terms/          # Termos de uso
│   ├── actions/            # Server Actions
│   ├── callback/           # Callback OAuth Shopee
│   ├── fonts/              # Fontes customizadas
│   ├── globals.css         # Estilos globais
│   ├── layout.js           # Layout raiz
│   └── page.js             # Página inicial
├── components/             # Componentes reutilizáveis
│   ├── layout/             # Componentes de layout
│   └── ui/                 # Componentes de interface
├── context/                # Context API
│   ├── productContext.jsx  # Contexto de produtos
│   └── shopContext.jsx     # Contexto de loja
└── middleware.js           # Middleware de autenticação
```

## 🔐 Autenticação

O sistema utiliza JWT para autenticação:

### Fluxo de Autenticação

1. **Login**: Usuario faz login via `/signin`
2. **Token**: JWT é armazenado em cookie `shopturboAuthToken`
3. **Middleware**: Valida token em rotas privadas
4. **Redirecionamento**: Usuários não autenticados são redirecionados

### Rotas Protegidas

-   `/dashboard`
-   `/products`
-   `/integrate`
-   `/profit`
-   `/support`
-   `/taxes`
-   `/callback`

## 🛡️ Middleware

O middleware (`src/middleware.js`) protege rotas privadas:

```javascript
// Verifica token JWT
// Redireciona para /signin se inválido
// Adiciona Authorization header nas requests
```

## 🎯 Funcionalidades

### Dashboard

-   **Visualização geral** da loja Shopee
-   **Informações em tempo real** de estoque e preços
-   **Loading states** durante carregamento

### Autenticação

-   **Login/Cadastro** de usuários
-   **Gestão de sessão** com JWT
-   **Proteção de rotas** automática

### Integração Shopee

-   **OAuth flow** completo com Shopee
-   **Sincronização** de dados da loja
-   **Gerenciamento de tokens** de acesso

## 🎨 Design System

### Cores (CSS Custom Properties)

```css
--main_background: #000       /* Fundo principal */
--foreground: #ededed         /* Texto principal */
--primary_color: #ee4d2d      /* Cor primária (Shopee) */
--secondary_color: #d34023    /* Cor secundária */
--bg_1: #8e8e8e              /* Fundo nível 1 */
--bg_2: #6a6a6a              /* Fundo nível 2 */
--bg_3: #474747              /* Fundo nível 3 */
--bg_4: #232323              /* Fundo nível 4 */
--bg_5: #171717              /* Fundo nível 5 */
```

### Tipografia

-   **Geist Sans** - Fonte principal
-   **Geist Mono** - Fonte monoespaçada

## 🔄 Gerenciamento de Estado

### Context API

-   **ShopContext**: Dados da loja Shopee
-   **ProductsContext**: Lista de produtos

### Server Actions

-   `fetchShopProfile()` - Perfil da loja
-   `fetchProductsIdList()` - Lista de IDs de produtos
-   `fetchProductsInfo()` - Informações detalhadas de produtos
-   `fetchAuthUrl()` - URL de autorização Shopee
-   `signIn()` / `signOut()` - Autenticação

## 🚦 Estados de Loading

O sistema implementa estados de carregamento em:

-   **Dashboard** - Durante fetch de produtos
-   **Formulários** - Durante submissão
-   **Navegação** - Entre páginas

## 🔗 Integração com Backend

### Endpoints Utilizados

```
GET /api/shopee/auth-url          # Obter URL autorização
GET /api/shopee/access-token      # Obter Token de acesso
GET /api/shopee/shop/profile/:id  # Obter dados do perfil da loja
GET /api/shopee/shop/:id/products # Obter produtos
POST /signin                      # Login
POST /signup                      # Cadastro de contas
```

## 📝 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento com hot-reload
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linting do código
```

## 🌐 Deploy

### Vercel (Recomendado)

```bash
# Conecte seu repositório ao Vercel
# Configure as variáveis de ambiente
# Deploy automático via Git
```

### Outros Provedores

```bash
# Build do projeto
npm run build

# Servir arquivos estáticos da pasta .next
```

## 🔧 Configurações

### Tailwind CSS

-   **Arquivo**: `tailwind.config.js`
-   **Custom colors** mapeadas para CSS variables
-   **Content paths** otimizados

### Next.js

-   **App Router** habilitado
-   **Middleware** para autenticação
-   **Server Actions** para API calls

## 🚀 Performance

### Otimizações Implementadas

-   **Image Optimization** do Next.js
-   **Font Optimization** com `next/font`
-   **Code Splitting** automático
-   **Static Generation** quando possível

## 🧪 Desenvolvimento

### Padrões de Código

-   **"use client"** em componentes interativos
-   **Context** para estado global
-   **Server Actions** para API calls
-   **Middleware** para autenticação

### Estrutura de Componentes

-   **Componentes reutilizáveis** em `/components/ui`
-   **Layout components** em `/components/layout`
-   **Page components** seguem App Router

## 🤝 Integração OAuth Shopee

### Fluxo Completo

1. **Autorização**: `/api/shopee/auth-url`
2. **Callback**: `/callback?code=...&shop_id=...`
3. **Token**: Troca code por access_token
4. **Dados**: Fetch perfil e produtos da loja

## 🛠️ Solução de problemas

### Problemas Comuns

-   **Token expirado**: Middleware redireciona para login
-   **CORS errors**: Verificar configuração do backend
-   **Build errors**: Verificar variáveis de ambiente

## 🐞 Bugs

Se você encontrou algum problema ou comportamento inesperado no projeto, por favor, ajude a tornar este projeto melhor, reportando o problema ao desenvolvedor:

Ao reportar, inclua:

-   Passos para reproduzir o bug
-   O que você esperava que acontecesse
-   O que realmente aconteceu
-   Logs ou prints se possível

👉 [Reportar bug ao desenvolvedor](https://github.com/developer-gilberto/shopturbo/issues/new)

## 🧑‍💻 Desenvolvedor

Feito com muito ❤️ por **Gilberto Lopes** Full Stack Developer.

### Saiba mais sobre o desenvolvedor

-   [gilbertolopes.dev](https://gilbertolopes.dev)
-   [GitHub](https://github.com/developer-gilberto)
-   [Instagran](https://www.instagram.com/developer.gilberto/)

**ShopTurbo** - Descomplique suas vendas na Shopee! 🚀
