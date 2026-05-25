# Feature: Ajuste de Rolagem (Sticky) e Consistência de Espaçamento

## 📋 Descrição
Refatoração do sistema de posicionamento da Navbar e dos elementos principais da página de Carrinho para melhorar a UX durante a rolagem e garantir a consistência do Design System.

## 💻 Implementação Técnica

### 1. Navbar (`navbar.component.scss`)
- Alteração da `.navbar-container` de `position: fixed` para `position: absolute`.
- A Navbar agora faz parte do fluxo de rolagem da página, desaparecendo conforme o scroll ocorre.

### 2. Carrinho (`cart.component.scss`)
- **Container Principal:** Ajuste do `margin-top` da `.cart-page-wrapper` para `212px`. Este valor considera a altura da Navbar + um gap de `40px`.
- **Cabeçalho de Seleção:**
    - Ativação do `position: sticky` com `top: 20px`.
    - Ajuste do `margin-bottom` para `40px` para alinhar com o espaçamento entre os itens da lista.
- **Sidebar de Resumo:**
    - Ativação do `position: sticky` com `top: 20px` para acompanhar a rolagem lateralmente.
- **Responsividade:** Ajuste do `top` do cabeçalho sticky para `10px` em telas mobile (media query de 1100px).

## ✅ Resultados
- Experiência de compra mais focada: ao rolar, distrações (navbar) somem e controles de ação (seleção/resumo) permanecem.
- Simetria visual perfeita com gaps de 40px padronizados.
