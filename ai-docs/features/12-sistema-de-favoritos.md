# Feature: Sistema de Favoritos Reativo

## Descrição Técnica
Implementação de um sistema completo de favoritos com gerenciamento de estado via Signals, persistência em cache local e interface de usuário premium integrada à barra de navegação e página inicial.

## O que foi implementado
* **FavoritesService (New Service)**:
  * Gerenciamento de estado reativo com `signal<FavoriteItem[]>(...)`.
  * Persistência automática em `localStorage` para retenção de dados entre sessões.
  * Lógica de `toggleFavorite`, `removeFavorite` e `clearFavorites`.
* **Navbar Integration**:
  * **Badge contador**: Exibição em tempo real do número de itens favoritos sobre o ícone de coração.
  * **Favorites Dropdown**: Menu suspenso flutuante com suporte a Glassmorphism exibindo imagem, título e preço dos produtos favoritados.
  * Suporte a remoção de itens diretamente pelo dropdown.
* **HomeComponent Update**:
  * Adicionado grid de produtos (`products-showcase`) para demonstração.
  * Botões de "curtir" integrados a cada card de produto com alteração de estado visual dinâmica.
* **SCSS Refactoring**:
  * Limpeza e organização profunda dos estilos da Navbar.
  * Consolidação de mixins para efeitos visuais consistentes.

## Como utilizar (Testes Mock)
1. Navegue pela **Home** e localize os produtos em destaque.
2. Clique no ícone de coração de qualquer produto. O coração mudará para a cor vermelha.
3. Observe o badge no topo da página (ícone de Favoritos) atualizar instantaneamente.
4. Passe o mouse sobre **Favoritos** na Navbar para ver a lista resumida.
5. Clique na lixeira dentro do dropdown para remover um item ou em "Limpar favoritos" para resetar a lista.

## Padrões de Código Aplicados
* **Signals API**: Uso de `computed` para contadores e `asReadonly` para proteção de estado.
* **DRY (Don't Repeat Yourself)**: Compartilhamento de estilos e componentes de UI entre Carrinho e Favoritos.
* **Build Integrity**: Garantia de compilação via `ng build` após refatoração de estilos.
