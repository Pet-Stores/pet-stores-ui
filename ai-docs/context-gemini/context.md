# Contexto do Projeto: Pet Stores

Este documento serve como a "Bússola do Projeto" para garantir que o desenvolvimento siga sempre a mesma visão, arquitetura e estratégia.

## 1. Objetivo do Projeto
*   **O que é:** Uma plataforma completa de e-commerce e serviços para o nicho Pet (Pet Shop).
*   **Visão:** Criar um ecossistema que conecte donos de pets a produtos (ração, acessórios) e serviços (banho, tosa, agendamentos).
*   **Fase Atual:** Desenvolvimento de um **MVP (Produto Mínimo Viável)** funcional e responsivo.

## 2. Estratégia de Desenvolvimento
*   **Abordagem:** "Single Codebase" (Código Único) para Web e Mobile.
*   **Evolução Mobile:** Utilização do **Capacitor** para transformar a base web em aplicativos nativos (iOS/Android) no momento oportuno.
*   **Foco:** Time-to-market rápido, baixo custo de manutenção e validação da ideia antes de escalar para tecnologias nativas.

## 3. Stack Tecnológica e Arquitetura
*   **Frontend:** Angular (v15+).
*   **UI/Design System:** Angular Material (seguindo os padrões de Material Design).
*   **Estilização:** SCSS com foco em responsividade extrema (Flexbox/Grid).
*   **Organização de Código:**
    *   Lógica de negócio isolada em **Services** (API-First).
    *   Componentes focados em apresentação e experiência do usuário (UX).
    *   Responsividade via Breakpoints do Angular CDK e Media Queries.

## 4. Guia de Design e Identidade
*   **Paleta de Cores:**
    *   Principal: #3C2A20 (Marrom Escuro) - Transmite confiança e cuidado.
    *   Secundária: #FFE1BA (Creme/Laranja claro) - Transmite proximidade e calor.
    *   Ternária: #FFEDD5.
*   **Experiência do Usuário (UX):** Foco em simplicidade, facilidade de agendamento e fluxo de compra fluido.

## 5. Fluxo de Trabalho e Documentação
*   **Registro de Tarefas:** Cada etapa concluída deve ser relatada na pasta `prompts/` seguindo a numeração sequencial.
*   **Sincronização:** Este arquivo (`context.md`) deve ser lido no início de grandes tarefas para garantir alinhamento estratégico.

---
**Última Atualização:** 19 de Maio de 2026
**Status:** MVP em desenvolvimento.
