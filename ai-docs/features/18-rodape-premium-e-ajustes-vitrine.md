# Feature 18: Rodapé Premium Retrátil & Ajustes de Vitrine

**Data:** 2026-09-06  
**Status:** Concluído  
**Branch:** `feature/018-create-footer`

---

## 📝 Descrição Técnica

Implementação do rodapé de e-commerce de alto nível (`FooterComponent`) baseado no padrão expansível do Mercado Livre, padronização de ícones sociais via SVG nativo e inclusão do 8º produto mockado para fechamento visual da vitrine da Home.

---

## ⚙️ Alterações Realizadas

### 1. `FooterComponent` (`src/app/components/footer/`)
- Componente Standalone Angular 19.
- Alternador de estado com Signal (`isExpanded`).
- 5 colunas institucionais: Sobre, Ecossistema & Serviços, Negócios & Parceiros, Ajuda & Atendimento, Redes Sociais & App.
- Ícones SVG personalizados para Instagram, Facebook, YouTube e TikTok.
- Barra de confiança com selos de segurança e chips de formas de pagamento (PIX, Crédito, Boleto, Mercado Pago).
- Linha essencial com links rápidos e dados jurídicos da empresa.

### 2. `AppComponent` (`src/app/app.component.html` / `src/app/app.component.scss`)
- Estruturação do container raiz `.app-layout` com `min-height: 100vh` e `.app-main-content` com `flex: 1 0 auto`, garantindo um sticky footer.

### 3. `ProductService` (`src/app/services/product.service.ts`)
- Adicionado produto ID 8: "Biscoito Dog Chow Para Cães Adultos Médios e Grandes Sabor Frango 500g" (R$ 19,90, 20% OFF).
- Atribuída a imagem `assets/mock/biscoito_dog_chow.png`.

---

## 🧪 Validação
- Compilação do projeto verificada via `npm run build` (Exit status: 0).
