# Feature 17: Central do Usuário (Minha Conta) & Suporte a Deploy Vercel

**Data:** 2026-09-06  
**Status:** Concluído  
**Branch:** `feature/complement-user-data`

---

## 📝 Descrição Técnica

Implementação completa da Central do Usuário (`AccountComponent`), integrando gerenciamento de perfil, histórico financeiro com gráficos SVG, emissão/gestão de Notas Fiscais Eletrônicas (NF-e), gerenciamento de pets, métodos de pagamento, trocas de papel (Cliente, Vendedor, Entregador) e correções de build/deploy para a Vercel.

---

## ⚙️ Alterações Realizadas

### 1. `AuthService` (`src/app/services/auth.service.ts`)
- Adição de novos modelos de dados: `UserAddress`, `PaymentCard`, `PixKey`, `SellerProfileData`, `DeliveryProfileData`, `UserNotifications`, `LinkedAccounts`, `Invoice`.
- Métodos de manipulação reativa de perfil: `updateProfile`, `switchRole`, `addAddress`, `removeAddress`, `addPaymentCard`, `removePaymentCard`, `addPixKey`, `removePixKey`, `addPet`, `removePet`, `updatePet`.

### 2. `AccountComponent` (`src/app/components/account/`)
- Componente Standalone Angular 19 com 7 abas funcionais.
- Visualização gráfica nativa SVG (gráfico de colunas de 12 meses e gráfico donut de categorias).
- Gestão de Notas Fiscais Eletrônicas (NF-e) com busca por texto, filtro de ano, cópia de chave e downloads de DANFE/XML.
- Design responsivo alinhado ao Design System com paleta `#3C2A20`, `#FFE1BA`, `#FFEDD5`.

### 3. Rotas & Navbar
- Adicionadas as rotas `/account` e `/minha-conta` em `app.config.ts`.
- Navbar atualizada com atalhos para "Minha Conta" e "Configurações" (`/account?tab=preferences`).

### 4. Configurações de Deploy Vercel
- `vercel.json` na raiz e `app/vercel.json` configurados com `buildCommand` e `outputDirectory` adequados para repositórios com subpasta `app/`.
- `package.json` adicionado na raiz delegando os scripts `build` para a pasta `app/`.

---

## 🧪 Validação
- Compilação realizada com sucesso através do comando `npm run build` (Exit status: 0).
