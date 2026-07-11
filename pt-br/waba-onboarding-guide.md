---
title: Guia de Onboarding WABA
lang: pt-br
slug: waba-onboarding-guide
description: Guia passo a passo do onboarding WABA para a API oficial do WhatsApp Business, desde os pré-requisitos até a verificação do número e da empresa.
---

Este guia acompanha o processo de onboarding da API oficial do WhatsApp Business (WABA) exibido pela Meta após você clicar em **Conectar** no popover do seu provedor de tecnologia. Ele presume que você já revisou a [Checklist WABA]({{ '/pt-br/waba-checklist/' | relative_url }}) e tem o número, a conta do Facebook e os dados da empresa prontos.

## 1. Entrar com o Facebook

A Meta usa uma conta pessoal do Facebook para criar e gerenciar o Portfólio de Negócios:

1. Faça login com a conta do Facebook que será proprietária ou administradora da conexão WABA.
2. Se a conta ainda não tiver um Portfólio de Negócios, a Meta cria um automaticamente.
3. Aceite os termos e permissões solicitados pelo WhatsApp.

Use uma conta do Facebook com nome real e documentos válidos. Contas não verificadas ou restritas podem bloquear o processo.

## 2. Criar ou selecionar um Portfólio de Negócios

O Portfólio de Negócios é o container da sua conta do WhatsApp Business, método de pagamento e dados comerciais:

- Se a empresa já tiver um portfólio, escolha-o na lista.
- Caso contrário, crie um novo portfólio com um nome comercial claro.

Após a criação, o portfólio pode ser acessado em [business.facebook.com](https://business.facebook.com).

## 3. Preencher os dados da empresa

A Meta solicita o nome de exibição comercial e a categoria. Certifique-se de que o nome de exibição:

- Corresponda ao nome da empresa ou marca visível no site institucional.
- Não inclua termos genéricos como "WhatsApp" ou "Suporte", a menos que façam parte da marca registrada.
- Siga as diretrizes da Meta para nomes de exibição.

A categoria comercial deve refletir a atividade real da empresa.

## 4. Verificar o número de telefone

A Meta envia um código de 6 dígitos para o número que está sendo conectado:

1. Escolha o envio por SMS ou chamada de voz.
2. Receba o código no dispositivo ou linha que tem acesso ao número.
3. Digite o código na tela de onboarding.

### Sem coexistência

Se o número já estiver ativo em um aplicativo WhatsApp comum e você **não** estiver usando coexistência, pode ser necessário apagar a conta do WhatsApp no aparelho primeiro. Veja detalhes na [Checklist WABA]({{ '/pt-br/waba-checklist/' | relative_url }}).

### Com coexistência

Se o seu provedor oferecer **coexistência**, o mesmo número permanece ativo no aplicativo WhatsApp do celular enquanto também funciona pela API:

1. Durante a configuração, o popover de onboarding do provedor pode exibir um **QR code**.
2. Abra o WhatsApp no telefone que possui o número.
3. Vá até a tela de dispositivos vinculados ou dispositivo companheiro e escaneie o QR code.
4. Aguarde a confirmação de que o dispositivo foi vinculado.

Após a conexão da API estar ativa, tanto o aplicativo quanto a API podem enviar e receber mensagens para o mesmo número. Os índices de qualidade e limites de mensagens continuam sendo gerenciados pela Meta.

## 5. Configurar pagamentos

Para enviar mensagens de modelo fora da janela de atendimento ao cliente de 24 horas, adicione um método de pagamento:

1. Nas configurações do WhatsApp, acesse a seção de pagamentos.
2. Cadastre um cartão de crédito.
3. Confirme o país e a moeda de faturamento.

Sem um método de pagamento, a conexão pode receber mensagens, mas a empresa não poderá iniciar novas conversas com modelos.

## 6. Enviar a empresa para verificação

Depois que o número é conectado, a Meta pode exigir a verificação da empresa para liberar limites de mensagens e recursos de modelos:

1. No Portfólio de Negócios, inicie o processo de verificação da empresa.
2. Informe o nome comercial legal, endereço, telefone e site.
3. Confirme se as informações coincidem com os documentos oficiais e o site da empresa.

A Meta tentará primeiro a verificação por telefone. Se isso falhar, você será solicitado a enviar:

- Contrato social ou documento equivalente de registro da empresa.
- Documento de identidade oficial do representante legal.

## 7. Confirmar que o WABA está conectado

Assim que o número for verificado e os pagamentos configurados, o canal da API do WhatsApp Business aparecerá como conectado no painel do seu provedor. Você poderá então:

- Receber mensagens de clientes.
- Enviar mensagens de modelo para conversas iniciadas pela empresa.
- Acompanhar índices de qualidade e limites de mensagens no Gerenciador de Negócios da Meta.

A verificação da empresa ainda pode estar em andamento, e isso é esperado. Mantenha os documentos de verificação prontos e responda a qualquer solicitação da Meta para concluí-la.
