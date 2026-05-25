# Instruções do Projeto: Pet Stores

Este arquivo contém regras e fluxos de trabalho específicos para a interação entre o usuário e o agente Gemini CLI neste repositório.

## Comando de Persistência (SAVE)

Sempre que o usuário der o comando **"save"**, o agente deve realizar os seguintes passos:

1.  **Sintetizar a Conversa:** Criar um resumo executivo dos pontos principais, decisões tomadas, desafios resolvidos e sugestões futuras discutidas na sessão atual.
2.  **Gerar Log de Sessão:** Salvar essa síntese em um novo arquivo na pasta `ai-docs/sessions/YYYY-MM-DD-sessao-X.md`. Este arquivo é focado no resumo da conversa.
3.  **Gerar Log de Feature:** Criar (ou atualizar) um arquivo na pasta `ai-docs/features/XX-nome-da-atividade.md` descrevendo tecnicamente o que foi implementado ou alterado (o "quê" e o "como").
4.  **Atualizar Memória de Trabalho:** Adicionar as referências tanto da sessão quanto da feature no arquivo `ai-docs/00-historico-conversoes.md`.
5.  **Confirmar:** Informar ao usuário que a memória foi consolidada em ambas as pastas e fornecer uma sugestão detalhada de mensagem de commit (sempre em inglês) baseada no que foi implementado na sessão.

## Padrões de Código e Documentação
*   **Logs de Tarefa:** Ao final de cada tarefa técnica, criar um arquivo em `ai-docs/` relatando o que foi feito.
*   **Contexto:** Consultar sempre `ai-docs/context-gemini/context.md` antes de grandes mudanças arquiteturais.
*   **Commits:** Mensagens sempre em inglês.
