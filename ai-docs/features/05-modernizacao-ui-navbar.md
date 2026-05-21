# Tarefa 05: Implementação de UI Moderna (Floating Glass & Dropdowns)

Esta tarefa consistiu na reestruturação visual completa da Navbar, focando em Glassmorphism, animações reativas e componentes personalizados.

## Implementações Técnicas:

1.  **Layout Glassmorphism:**
    *   Criação de Mixins SCSS para efeito de vidro (`backdrop-filter: blur`, bordas translúcidas).
    *   Transformação da Navbar em um container flutuante (`position: fixed`) com bordas arredondadas e sombras suaves.

2.  **Dropdowns Personalizados (Hover):**
    *   Desenvolvimento de estrutura HTML/CSS para substituir `<select>` por menus reativos.
    *   Implementação de animações de entrada com curvas de Bezier e rotação de ícones de expansão.
    *   Ajuste de contexto de empilhamento (`z-index`) para garantir sobreposição correta.

3.  **Placeholder Animado (Typewriter):**
    *   Lógica TypeScript utilizando `signal` para controlar o texto dinâmico.
    *   Ciclo de digitação/deleção de frases com controle de tempo via `setTimeout` e limpeza no `OnDestroy`.

4.  **Refinamento de Perfil:**
    *   Implementação de dropdown específico para o Perfil do usuário, integrando opções de "Login" e "Cadastrar-se" com ícones exclusivos.

5.  **Borda Estrutural:**
    *   Definição de bordas fixas no campo de busca (`1.5px solid`) para manter a integridade visual em qualquer estado.

## Resultado:
A Navbar agora possui uma interface de alto impacto visual, fluida e reativa, servindo como base para a modernização do restante do projeto.

---
**Data:** 21 de Maio de 2026
**Status:** Concluído
