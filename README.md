# **ShopTurbo** - Descomplique suas vendas na Shopee! 🚀

Sistema ERP para pessoas que possuem loja na Shopee, possam gerenciar seus produtos, vendas, saberem quanto estão tendo de custos, quanto estão tendo de lucro, entre outras funcionalidades. Desenvolvido usando JavaScript, Next.js, React e TailwindCSS.
O ShopTurbo possui uma API REST(projeto separado) para fazer a integração do sistema com a API oficial da Shopee. Desenvolvida usando TypeScript, Node.js, Express, Prisma ORM, Postgres e Docker.

## Página de pedidos da sua loja na Shopee
<img width="1921" height="926" alt="0rders-page" src="https://github.com/user-attachments/assets/7dcc152a-7732-45ac-a976-1fc035190715" />

## Você pode buscar por um produto específico pelo ID
<img width="1921" height="926" alt="prod-busca" src="https://github.com/user-attachments/assets/a2e37261-3638-4438-a435-d1af2b7cffd1" />

## Página dos seus produtos na Shopee
<img width="1921" height="926" alt="product-page" src="https://github.com/user-attachments/assets/c497bda3-4f51-4869-977f-6e5881a20e5b" />

## ⚠️ Antes de continuar

Este projeto ainda está em desenvolvimento, se você encontrar algum problema, comportamento inesperado, bugs, você pode ajudar muito no desenvolvimento do projeto simplesmente reportando o problema ao desenvolvedor:

Ao reportar, inclua:

- Passos para reproduzir o bug
- O que você esperava que acontecesse
- O que realmente aconteceu
- Logs ou prints se possível

👉 [Reportar bug ao desenvolvedor](https://github.com/developer-gilberto/shopturbo/issues/new)

## 📋 Descrição

ShopTurbo é uma aplicação web construída com Next.js que facilita o gerenciamento de lojas e produtos na plataforma Shopee.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com SSR/SSG
- **React 19 RC** - Biblioteca de interface
- **Tailwind CSS** - Framework de CSS utilitário
- **Jose** - Biblioteca JWT para JavaScript
- **React Icons** - Ícones para React
- **Context API** - Gerenciamento de estado

## 📦 Dependências

### Principais

- `next@15.0.3` - Framework Next.js
- `react@19.0.0-rc` - React (Release Candidate)
- `react-dom@19.0.0-rc` - React DOM
- `jose@^6.1.0` - Manipulação de JWT
- `react-icons@^5.3.0` - Biblioteca de ícones

### Desenvolvimento

- `postcss@^8`
- `tailwindcss@^3.4.1`

## 🛠️ Instalação

### Pré-requisitos

- Node.js 22+
- API ShopTurbo-server rodando (API disponível em [API ShopTurbo](https://github.com/developer-gilberto/shopturbo-server))

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

SERVER_URL=http://localhost:5000
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

- `/dashboard`
- `/products`
- `/integrate`
- `/profit`
- `/support`
- `/taxes`
- `/callback`

## 🛡️ Middleware

O middleware (`src/middleware.js`) protege rotas privadas:

```javascript
// Verifica token JWT
// Redireciona para /signin se inválido
// Adiciona Authorization header nas requests
```

## 🎯 Funcionalidades

### Dashboard

- **Visualização geral** da loja Shopee
- **Informações em tempo real** de estoque e preços
- **Loading states** durante carregamento

### Autenticação

- **Login/Cadastro** de usuários
- **Gestão de sessão** com JWT
- **Proteção de rotas** automática

### Integração Shopee

- **OAuth flow** completo com Shopee
- **Sincronização** de dados da loja
- **Gerenciamento de tokens** de acesso

## 🎨 Design System

### Cores (CSS Custom Properties)

```css
--main_background: #000 /* Fundo principal */ --foreground: #ededed
  /* Texto principal */ --primary_color: #ee4d2d /* Cor primária (Shopee) */
  --secondary_color: #d34023 /* Cor secundária */ --bg_1: #8e8e8e
  /* Fundo nível 1 */ --bg_2: #6a6a6a /* Fundo nível 2 */ --bg_3: #474747
  /* Fundo nível 3 */ --bg_4: #232323 /* Fundo nível 4 */ --bg_5: #171717
  /* Fundo nível 5 */;
```

### Tipografia

- **Geist Sans** - Fonte principal
- **Geist Mono** - Fonte monoespaçada

## 🔄 Gerenciamento de Estado

### Context API

- **ShopContext**: Dados da loja Shopee
- **ProductsContext**: Lista de produtos

### Server Actions

- `fetchShopProfile()` - Perfil da loja
- `fetchProductsIdList()` - Lista de IDs de produtos
- `fetchProductsInfo()` - Informações detalhadas de produtos
- `fetchAuthUrl()` - URL de autorização Shopee
- `signIn()` / `signOut()` - Autenticação

## 🚦 Estados de Loading

O sistema implementa estados de carregamento em:

- **Dashboard** - Durante fetch de produtos
- **Formulários** - Durante submissão
- **Navegação** - Entre páginas

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

- **Arquivo**: `tailwind.config.js`
- **Custom colors** mapeadas para CSS variables
- **Content paths** otimizados

### Next.js

- **App Router** habilitado
- **Middleware** para autenticação
- **Server Actions** para API calls

## 🚀 Performance

### Otimizações Implementadas

- **Image Optimization** do Next.js
- **Font Optimization** com `next/font`
- **Code Splitting** automático
- **Static Generation** quando possível

## 🧪 Desenvolvimento

### Padrões de Código

- **"use client"** em componentes interativos
- **Context** para estado global
- **Server Actions** para API calls
- **Middleware** para autenticação

### Estrutura de Componentes

- **Componentes reutilizáveis** em `/components/ui`
- **Layout components** em `/components/layout`
- **Page components** seguem App Router

## 🤝 Integração OAuth Shopee

### Fluxo Completo

1. **Autorização**: `/api/shopee/auth-url`
2. **Callback**: `/callback?code=...&shop_id=...`
3. **Token**: Troca code por access_token
4. **Dados**: Fetch perfil e produtos da loja

## 🛠️ Solução de problemas

### Problemas Comuns

- **Token expirado**: Middleware redireciona para login
- **CORS errors**: Verificar configuração do backend
- **Build errors**: Verificar variáveis de ambiente

## 🐞 Bugs

Se você encontrou algum problema ou comportamento inesperado no projeto, por favor, ajude a tornar este projeto melhor, reportando o problema ao desenvolvedor:

Ao reportar, inclua:

- Passos para reproduzir o bug
- O que você esperava que acontecesse
- O que realmente aconteceu
- Logs ou prints se possível

👉 [Reportar bug ao desenvolvedor](https://github.com/developer-gilberto/shopturbo/issues/new)

## 🧑‍💻 Desenvolvedor

Feito com muito ❤️ por **Gilberto Lopes** Full Stack Developer.

### Saiba mais sobre o desenvolvedor

-   Email: developer.gilberto@gmail.com
-   [Site pessoal](https://gilbertolopes.dev)
-   [LinkedIn](https://linkedin.com/in/gilbertolopes-dev)
-   [GitHub](https://github.com/developer-gilberto)
-   [Instagran](https://www.instagram.com/developer.gilberto/)

**ShopTurbo** - Descomplique suas vendas na Shopee! 🚀

Exceto conforme expressamente estabelecido de outra forma por escrito, o titular dos direitos autorais deste software e qualquer outra pessoa que controle os direitos autorais reserva todos os direitos a respeito do software distribuído.

Nenhuma permissão é concedida para cópia, distribuição, modificação ou sublicenciamento do software. O uso comercial deste software requer uma licença comercial válida emitida pelo titular dos direitos autorais.

Para obter permissão, entre em contato com o criador e desenvolvedor do ShopTurbo® Gilberto Lopes developer.gilberto@gmail.com

## ShopTurbo®
### All Rights Reserved ®
### © Copy Right
### Todos os Direitos Reservados
