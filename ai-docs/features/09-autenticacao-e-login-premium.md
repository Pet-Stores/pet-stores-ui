# Feature: Sistema de Autenticação e Login Premium

## Descrição Técnica
Implementação do módulo de autenticação inicial, focado no modal de login inteligente e na integração dinâmica com a Navbar.

## O que foi implementado
*   **LoginComponent (Standalone)**:
    *   Formulário reativo com validações.
    *   Detecção inteligente de entrada (Regex para E-mail vs Telefone).
    *   Suporte multi-país para máscaras de telefone (BR, US, PT, AR, ES, GB).
    *   Efeito de brilho premium no botão principal.
*   **AuthService**:
    *   Gerenciamento de estado de usuário via Angular Signals.
    *   Persistência em `localStorage`.
    *   Mock de usuários para validação de fluxos.
*   **Navbar Integration**:
    *   Binding dinâmico do nome do usuário e foto de perfil.
    *   Lógica de logout e limpeza de sessão.
*   **Estilização Global**:
    *   Backdrop blur para `MatDialog`.
    *   SnackBars personalizados para Sucesso (Verde) e Erro (Vermelho).

## Como utilizar (Testes Mock)
*   **Usuário 1**: `johnny@gmail.com` / `123456`
*   **Usuário 2**: `+55 (41) 99534-1904` / `123456`

## Padrões de Segurança Aplicados
*   **Anti-enumeration**: Mensagens de erro genéricas em todas as falhas de login.
*   **Sensitive Data**: Senhas não são expostas em logs ou localmente.
*   **Input Sanitization**: Limpeza de caracteres não-numéricos para processamento de máscaras.
