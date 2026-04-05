---
title: WHMCS
lang: pt-br
slug: whmcs
description: Conecte o controle de assinatura do WHMCS ao Ticketz PRO.
---

Embora o WHMCS não seja exatamente um gateway de pagamento, o Ticketz o trata dessa forma porque é ele que controla o acesso às assinaturas usando os meios de pagamento configurados dentro do próprio WHMCS.

O Ticketz usa o estado da assinatura no WHMCS para provisionar e manter o acesso aos planos.

## Preparação no WHMCS

### Gateway de pagamento

A configuração do gateway em si não faz parte deste guia. Escolha o provedor de cobrança mais adequado ao seu cenário, como Mercado Pago, ASAAS ou Stripe.

### Criação do produto

1. Abra **Produtos/Serviços**.
2. Crie um produto do tipo **Outro Produto/Serviço**.
3. Escolha ou crie um grupo adequado.
4. Defina o nome e selecione o módulo **Auto Release**.
5. Na aba **Preço**, informe o menor valor de plano que pretende oferecer, mantenha recorrência mensal e deixe o preço ativo.
6. Em **Campos Personalizados**, crie um campo obrigatório de senha:
   - **Nome do Campo**: `Password`
   - **Tipo do Campo**: `Password`
   - **Descrição**: `Senha para o primeiro login`
7. Salve o produto e anote o código que aparece na URL do navegador após `&id=`.

### Opções configuráveis para os planos

1. Abra **Opções Configuráveis**.
2. Crie um novo grupo e associe esse grupo ao produto.
3. Adicione uma nova opção configurável com nome `Plan` e tipo `Dropdown`.
4. Crie uma opção para cada plano do Ticketz.

Os nomes dos planos precisam ser exatamente os mesmos usados no Ticketz. Qualquer caractere diferente quebra o mapeamento.

### Credenciais de API

Na área **Manage API Credentials**:

1. Em **API Roles**, crie uma role chamada `querycustomer`.
2. Habilite `GetClientsDetails` e `GetClientsProducts` no grupo **Client**.
3. Em **API Credentials**, crie uma credencial vinculada a essa role.
4. Guarde os dois valores gerados: **Identifier** e **Secret**.

### Liberação de acesso à API

Em **Configurações Gerais** e depois **Segurança**, adicione o IP do servidor Ticketz em **API IP Access Restriction**.

## Preparação no Ticketz

### Criar os planos

No Ticketz, crie os planos com exatamente os mesmos nomes usados no WHMCS. A recorrência mensal é a recomendação mais simples.

### Configurar o gateway

No Ticketz, vá em **Configurações** e depois **Payment Gateways**. Selecione o gateway WHMCS e preencha:

- **Base URL**: URL raiz da instalação do WHMCS
- **API Identifier**: valor gerado no WHMCS
- **API Secret**: segredo correspondente gerado no WHMCS
- **Product Code**: código do produto criado anteriormente

## Fluxo de uso

Depois da configuração não há um passo operacional adicional. Quando o cliente compra o produto no carrinho do WHMCS, ele escolhe um plano e define uma senha. Após a confirmação do pagamento:

- o Ticketz cria a empresa com o nome do cliente no WHMCS
- o Ticketz ativa o plano selecionado
- o Ticketz usa a data de vencimento do WHMCS
- o cliente acessa com o email da compra e a senha definida

Depois do primeiro acesso, o cliente pode alterar a senha e cadastrar novos usuários conforme os limites do plano.
