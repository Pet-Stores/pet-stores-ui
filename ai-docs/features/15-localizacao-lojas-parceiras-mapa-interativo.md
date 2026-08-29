# Feature 15 – Localização de Lojas Parceiras e Mapa Interativo

## O que foi feito

### 1. `StoreService` (`store.service.ts`)
- Criação de um novo serviço com gestão de estado reativo via **Angular Signals**.
- Integração com a API **ViaCEP** para busca de endereço por CEP.
- Suporte à **geolocalização nativa do navegador (GPS)**.
- Cálculo de distâncias reais em km com a fórmula **Haversine**.
- Persistência automática da localização no `localStorage`.
- Lojas parceiras fake posicionadas próximas ao endereço **Campo Pequeno, Colombo - PR (83404-190)**.

### 2. Dropdown Inteligente na Navbar (`navbar.component.*`)
- **Sem CEP:** ao passar o mouse no ícone de localização (`location_on`), abre um card para digitar o CEP ou usar a localização via GPS.
- **Com CEP:** exibe a lista das lojas parceiras mais próximas com status (Aberto/Fechado), distância em km e rating.
- Botão de navegação direta para a tela completa `/stores`.
- Estilos premium (glassmorphism) alinhados ao design system do projeto.

### 3. Tela de Mapa Interativo (`StoresMapComponent`)
- Criação do componente em `src/app/components/stores-map/`.
- **Leaflet.js + OpenStreetMap** (sem necessidade de API key).
- Marcador azul com anel pulsante para a localização do usuário.
- Marcadores coloridos (verde = aberta, vermelho = fechada) com popups interativos para cada loja.
- **Painel lateral esquerdo** com cards de cada loja (endereço, telefone, horário, serviços, distância) e botão "Ver no Mapa" com animação suave (`flyTo`).
- **Filtros:** por categoria (Petshop, Veterinária, Banho & Tosa, etc.), raio de busca (5 km, 10 km, 20 km) e campo de busca textual.

### 4. Configuração e Roteamento (`app.config.ts` / `angular.json`)
- Adição de `provideHttpClient()` para resolver o erro de injeção de `HttpClient`.
- Registro das rotas `/stores` e `/lojas` apontando para `StoresMapComponent`.
- Import do CSS do Leaflet no `angular.json` (`styles`).

### 5. Ajustes Visuais Pós-Build
- **Padronização da barra de pesquisa:** alinhada ao padrão da home (sem background no ícone, bordas e tipografia consistentes).
- **Correção de cor do subtítulo:** "Próximas a Você" ajustado para a cor padrão do design system.
- **Ícone de lupa:** removido background, adicionada animação de escala no hover (`transform: scale(1.15)`) igual à barra de pesquisa da home.
- **Espaçamento do ícone:** padding ajustado para seguir o mesmo padrão da home.
- **Reposicionamento da barra de pesquisa textual:** movida da seção `.right-filters` para acima da lista de lojas (`.stores-list-panel`), com `margin-bottom: 12px` para espaçamento adequado.

## Arquivos criados / modificados
| Arquivo | Ação |
|---------|------|
| `src/app/services/store.service.ts` | Criado |
| `src/app/components/stores-map/stores-map.component.ts` | Criado |
| `src/app/components/stores-map/stores-map.component.html` | Criado + ajustes de layout |
| `src/app/components/stores-map/stores-map.component.scss` | Criado + padronização visual |
| `src/app/components/navbar/navbar.component.ts` | Modificado (StoreService + signals) |
| `src/app/components/navbar/navbar.component.html` | Modificado (dropdown de lojas) |
| `src/app/components/navbar/navbar.component.scss` | Modificado (estilos do dropdown) |
| `src/app/app.config.ts` | Modificado (rota /stores + provideHttpClient) |
| `angular.json` | Modificado (Leaflet CSS nos styles) |

## Resultado
A UI agora possui uma feature completa de localização de lojas parceiras: dropdown inteligente na navbar, mapa interativo com Leaflet e painel lateral de listagem, tudo seguindo o design system premium já estabelecido no projeto.
