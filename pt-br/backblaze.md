---
title: Backblaze
lang: pt-br
slug: backblaze
description: Configure o armazenamento Backblaze no Ticketz PRO.
---

Este guia ajuda a configurar o Backblaze no Ticketz em poucos minutos.

## Passos no Backblaze

1. Crie uma conta em `https://www.backblaze.com`.
2. Crie um bucket e altere a visibilidade para público. Nessa etapa o Backblaze pode solicitar o cartão.
3. Abra **Billing** no canto superior direito e adicione o cartão novamente, se necessário.
4. Vá em **Application Keys** e crie uma nova chave com permissão de leitura e escrita no bucket.
5. Guarde o **Key ID** e a **Application Key**.

## Campos no Ticketz

Nas configurações do Ticketz, preencha os campos de storage assim:

- **Access Key**: o `Key ID`
- **Secret Key**: a `Application Key`
- **Region**: a região do bucket, geralmente visível no endpoint, por exemplo `sa-east-005`
- **Bucket**: o nome do bucket
- **Endpoint**: a URL completa do endpoint começando com `https`

Quando os dados estiverem corretos, o Ticketz passará a armazenar os arquivos no Backblaze.
