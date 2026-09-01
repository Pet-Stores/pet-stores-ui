# Feature 16 – Hero Carousel Premium

## Descrição
Implementado o componente **HeroCarouselComponent** (standalone) que exibe um carrossel premium na página inicial da aplicação. O carrossel contém 5 slides com conteúdo fictício de eventos e promoções, seguindo a identidade visual premium do projeto com estilos de glassmorphism, animações de brilho (shimmer) sutis, navegação por setas/teclado/touch, indicadores e autoplay controlado por Angular Signals.

## Arquivos Criados
| Arquivo | Descrição |
|---------|-----------|
| `src/app/components/hero-carousel/hero-carousel.component.ts` | Componente standalone com lógica de navegação, autoplay via `setInterval`, suporte a touch/teclado e Angular Signals (`currentIndex`, `isPaused`, `isDragging`, `dragOffset`). |
| `src/app/components/hero-carousel/hero-carousel.component.html` | Template com estrutura de 2 colunas, badges flutuantes, CTAs, setas de navegação e barra inferior com indicadores. |
| `src/app/components/hero-carousel/hero-carousel.component.scss` | Estilos avançados com mixins (`glass-panel`, `flex-center`), animações (`shimmer-sweep`, `timer-progress`, `float-badge`), glassmorphism e design responsivo. |

## Arquivos Modificados
| Arquivo | O que mudou |
|---------|-------------|
| `src/app/components/home/home.component.ts` | Adicionado `HeroCarouselComponent` ao array de `imports`. Removida declaração duplicada de `imports` que causava erro `TS1005`. |
| `src/app/components/home/home.component.html` | Inserido `<app-hero-carousel></app-hero-carousel>` antes da seção de produtos. |

## Detalhes Técnicos
- **Signals**: `currentIndex`, `isPaused`, `isDragging`, `dragOffset` para state management reativo.
- **Autoplay**: Intervalo de 5s controlado fora da Angular zone para performance.
- **Navegação**: Setas laterais, indicadores clicáveis, suporte a swipe (touch) e teclas de seta.
- **Acessibilidade**: Atributos `aria-hidden`, `aria-label`, `role` e navegação por teclado.
- **Design**: Glassmorphism, gradientes da paleta do projeto, efeitos shimmer sutis.

## Como Testar
1. Execute `ng serve`.
2. Acesse a página inicial (`/`).
3. O carrossel deve aparecer no topo, com transição automática a cada 5s e controles funcionais (setas, indicadores, touch).

## Correção de Bug
- Removida duplicação da propriedade `imports` no decorador `@Component` do `HomeComponent`, que causava o erro de compilação `TS1005: ',' expected`.
