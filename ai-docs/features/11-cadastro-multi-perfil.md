# Feature: Cadastro Multi-Perfil (Register)

## Descrição Técnica
Implementação do módulo de cadastro de novos usuários com suporte a múltiplos perfis (Comprador, Vendedor e Entregador), utilizando formulários reativos em etapas e validações condicionais dinâmicas.

## O que foi implementado
* **RegisterComponent (New Standalone Component)**:
  * **Etapa 1**: Seleção de perfil via cards interativos e inputs de dados básicos (Nome, Identificador Inteligente, Senha).
  * **Etapa 2 (Condicional)**: 
    * **Vendedor**: Razão Social, CNPJ e upload de Contrato Social/Alvará.
    * **Entregador**: CPF, Tipo de Veículo (Bicicleta/Moto/Carro), Placa e upload de CNH/CRLV.
  * **Signals**: Uso de Angular Signals para controle de etapa (`currentStep`), visibilidade de senha e seleção de perfil.
  * **Smart Input**: Validador dinâmico para aceitar E-mail ou Telefone com detecção automática.
* **AuthService Update**:
  * Adicionado método `register(userData: any)` que simula o cadastro e loga o usuário automaticamente.
  * Inclusão de documentação técnica (TODO) detalhando os endpoints e payloads esperados para integração futura com o backend.
* **Navbar Integration**:
  * Adicionado método `openRegisterModal()` e atualização do dropdown de perfil para acesso direto.
  * Fluxo circular de resultados de diálogo para navegação entre modais.
* **Estilização Premium**:
  * Aplicação de efeitos `.premium-shine` e animações de escala nos cards de perfil.
  * Layout responsivo com adaptação para telas mobile.

## Como utilizar (Testes Mock)
1. No dropdown de perfil da Navbar, clique em **"Criar minha conta"**.
2. Selecione o perfil **Vendedor** e preencha os dados da Etapa 1.
3. Avance para a Etapa 2 e preencha o CNPJ (mock).
4. Clique na área de upload para simular a anexação de documentos.
5. Ao finalizar, o sistema exibirá um SnackBar de sucesso e você estará logado.

## Padrões de Código Aplicados
* **Reactive Forms**: Validação customizada para senhas coincidentes e validação assíncrona/condicional de campos.
* **Standalone Components**: Arquitetura modular sem necessidade de NgModules.
* **Type Safety**: Verificação via `tsc` garantindo integridade das interfaces.
