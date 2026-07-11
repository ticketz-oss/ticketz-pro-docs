---
title: Guia Notificamehub WABA
lang: pt-br
slug: notificamehub-waba-guide
description: Passo a passo para conectar um número à API oficial do WhatsApp Business através da Notificamehub no Ticketz PRO.
---

Este guia descreve como conectar um número à API oficial do WhatsApp Business (WABA) usando a Notificamehub como intermediária dentro do Ticketz PRO.

> Antes de iniciar, confira a [Checklist WABA]({{ '/pt-br/waba-checklist/' | relative_url }}). Todos os requisitos devem estar ok para evitar bloqueios durante o onboarding da Meta. Para um passo a passo genérico do fluxo do popover da Meta, veja o [Guia de onboarding WABA]({{ '/pt-br/waba-onboarding-guide/' | relative_url }}).

## Criar a conexão do canal

1. Acesse o painel da Notificamehub.
2. No Dashboard, clique em **Canais**.
3. Na seção **Conectar Canal**, escolha o canal **WhatsApp**.
4. Uma nova entrada aparecerá em **Canais Conectados** com o status pendente.

Para liberar o canal e continuar, é necessário pagar a taxa de ativação correspondente.

## Iniciar o onboarding

Após a ativação do canal:

1. Clique em **Conectar** na entrada do WhatsApp em **Canais Conectados**.
2. Siga o fluxo de onboarding da Meta. Veja o [Guia de onboarding WABA]({{ '/pt-br/waba-onboarding-guide/' | relative_url }}) para uma descrição genérica passo a passo do fluxo do popover.
3. Finalize as permissões e configurações solicitadas.

## Configuração no Ticketz PRO

Após concluir o processo de onboarding:

1. No Ticketz PRO, crie uma nova conexão e selecione a integração da Notificamehub.
2. Na aba **Avançado**, preencha os tokens de **conta** e de **canal** da Notificamehub:
   - O **token da conta** está disponível no topo do dashboard da Notificamehub.
   - O **token do canal** pode ser obtido na janela que aparece ao clicar no ícone **Editar** do canal conectado.
3. Salve a conexão e verifique se o status muda para conectado.
