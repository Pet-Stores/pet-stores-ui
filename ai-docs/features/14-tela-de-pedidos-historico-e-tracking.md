# Feature: Tela de Pedidos (Histórico e Tracking em Andamento)

## Descrição Técnica
Implementação da tela completa de Pedidos (`OrdersComponent`), estruturada com acompanhamento de pedidos ativos via pipeline de etapas e histórico de compras com agrupamento dinâmico (por Loja/Vendedor ou por Ano/Data), mantendo o padrão *Premium Glassmorphism*.

## O que foi implementado

* **Feature 1: Histórico de Pedidos com Filtro Dinâmico**:
  * **Agrupamento por Vendedor / Loja**: Agrupa compras por loja com cabeçalho dedicado, contagem de pedidos e valor acumulado.
  * **Agrupamento por Ano / Data**: Agrupa compras anualmente (ex: *2026*, *2025*) com contagem e total anual.
  * **Cards de Pedido**: Layout espelhado no padrão do carrinho (`CartComponent`), com status `Entregue`/`Cancelado`, detalhes dos itens, botão *"Ver Comprovante"* e ação *"Comprar Novamente"*.
  * **Estado Vazio (`@empty`)**: Visual elegante para filtros sem resultados.

* **Feature 2: Pedido em Andamento com Pipeline Visual**:
  * **Exibição Condicional**: A seção só é renderizada quando houver pedidos ativos (`activeOrders().length > 0`).
  * **Agrupamento por Vendedor**: Pedidos em trânsito também separados por loja/vendedor.
  * **Pipeline de 4 Etapas**:
    1. `Preparando seu pedido`
    2. `Coletando seu pedido`
    3. `Pedido em trânsito`
    4. `Pedido entregue`
  * **Barra de Progresso Verde Gradiente**: Preenchimento proporcional com brilho esmeralda (`#10B981`) e nó ativo pulsante com efeito sonar.
  * **Card de Rastreamento**: Previsão de entrega (ETA), endereço completo com CEP e código de rastreio.

* **OrderService Reativo (Angular 19 Signals)**:
  * Gerenciamento de estado reativo com `orders`, `activeOrders`, `pastOrders`, `groupedActiveOrders`, `groupedPastBySeller` e `groupedPastByYear`.
  * Método `reorder()` integrado ao `CartService` para adicionar todos os itens do pedido de volta ao carrinho.
  * **Documentação de Backend**: Comentários estruturados com mapeamento de endpoints REST, headers JWT e interfaces DTO para futura integração real.

* **Roteamento e Navbar Inteligente**:
  * **Badge de Pedidos Ativos**: Contador dinâmico que reflete exclusivamente os pedidos em andamento (`activeOrdersCount()`).

## Como Utilizar (Testes Mock)
1. Acesse a aplicação e clique no ícone/link **"Pedidos"** ou **"Meus Pedidos"** na Navbar (ou navegue para `/orders`).
2. No topo da página, observe a seção de **Pedidos em Andamento** com a barra de progresso verde e os nós animados do pipeline.
3. Na seção de **Histórico de Pedidos**, teste a alternância do filtro entre **"Vendedor / Loja"** e **"Ano / Data"**.
4. Clique no botão **"Comprar Novamente"** em qualquer pedido e observe a notificação SnackBar e a atualização no carrinho.
5. Clique em qualquer produto de um pedido para ser direcionado para a página de detalhes (`/product/:id`).

## Padrões de Código Aplicados
* **Angular 19 Signals & Computed**: Reatividade pura sem overhead de subscriptions manuais.
* **Control Flow Moderno**: Uso exclusivo de `@if`, `@for` e `@empty`.
* **Design System**: Efeitos de vidro *Glassmorphism*, paleta `#3C2A20`, `#FFE1BA` e animações de pulso/shimmer.

