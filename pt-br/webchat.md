---
title: Webchat
lang: pt-br
slug: webchat
description: Guia de configuração e integração do Webchat no Ticketz PRO.
---

## Índice

1. [Sobre o Webchat](#sobre-o-webchat)
2. [Configuração no Ticketz](#configuracao-no-ticketz)
3. [Integração básica](#integracao-basica)
4. [Personalização](#personalizacao)
5. [Verificação](#verificacao)

## Sobre o Webchat

O Webchat é um widget flutuante que permite que seus clientes iniciem conversas diretamente no seu website. Ele é responsivo e funciona em desktop e mobile.

## Configuração no Ticketz

### Criar uma conexão Webchat

1. Acesse o painel administrativo do Ticketz.
2. Vá para Conexões -> Nova Conexão.
3. Selecione Webchat como tipo de conexão.
4. Configure os campos:
   - Nome: Nome descritivo da conexão (ex.: `webchat-principal`).
   - Channel UUID / ID da Conexão: Identificador único (gerado automaticamente).
   - Título da Janela: Texto exibido no topo do chat (ex.: `Atendimento Online`).
   - Subtítulo da Janela: Descrição breve (ex.: `Responderemos em breve`).
   - Mensagem de Chamada (CTA): Texto exibido ao lado do botão flutuante (ex.: `Fale com a gente`).
   - Cor Primária: Cor principal do botão e destaques (ex.: `#0066CC`).
   - Cor Secundária: Cor secundária de apoio (ex.: `#00AA00`).
   - Cor de Fundo (Surface): Fundo da janela do chat (ex.: `#FFFFFF`).
   - Cor de Texto (Text): Cor principal dos textos (ex.: `#0F172A`).

Após salvar, você receberá um ID da Conexão (código único). Copie esse ID para usar na integração.

## Integração básica

### Exemplo mínimo

Adicione este código no final do HTML do seu website, antes de `</body>`:

```html
<script>
  window.WebchatChannelId = "seu-id-conexao-aqui";
</script>
<script src="https://seu-ticketz.com/webchat-fab.js" async></script>
```

Substitua:

- `seu-ticketz.com` pela URL da sua instalação do Ticketz (ex.: `chat.suaempresa.com`).
- `seu-id-conexao-aqui` pelo ID da conexão copiado no painel.

Com isso, um botão flutuante aparecerá automaticamente no canto inferior direito da página.

## Personalização

### Método 1: Via painel (recomendado)

Ao criar ou editar a conexão Webchat no painel, configure:

| Campo                        | Descrição                                        | Exemplo                  |
| ---------------------------- | ------------------------------------------------ | ------------------------ |
| Channel UUID / ID da Conexão | Identificador único da conexão (somente leitura) | `a1b2c3d4-...`           |
| Título da Janela             | Título exibido no topo do chat                   | `Suporte Online`         |
| Subtítulo da Janela          | Descrição breve                                  | `Equipe disponível 24/7` |
| Mensagem de Chamada (CTA)    | Texto exibido ao lado do ícone flutuante         | `Fale com a gente`       |
| Cor Primária                 | Cor do botão e elementos principais              | `#0066CC`                |
| Cor Secundária               | Cor de destaques e bordas                        | `#00AA00`                |
| Cor de Fundo (Surface)       | Cor de fundo da janela de chat                   | `#FFFFFF`                |
| Cor de Texto (Text)          | Cor principal dos textos                         | `#0F172A`                |

Esse método é o mais indicado para administração do dia a dia.

Como priorizar no painel:

1. Defina Título e Subtítulo para o contexto de atendimento.
2. Use a Mensagem de Chamada (CTA) para aumentar cliques no botão.
3. Ajuste Cor Primária e Cor Secundária para combinar com a marca.

Resultado: o widget já fica padronizado para todos os sites que usam essa conexão.

### Método 2: Via variáveis globais (opcional)

Você pode sobrescrever o comportamento visual direto na página com variáveis `window`:

| Variável                         | Descrição                                         | Valor padrão       |
| -------------------------------- | ------------------------------------------------- | ------------------ |
| `window.WebchatCtaMessage`       | Sobrescreve a mensagem de chamada (CTA) do painel | Vazio (usa painel) |
| `window.WebchatFabPulseEnabled`  | Ativa ou desativa pulsação do botão               | `true`             |
| `window.WebchatFabPulseDuration` | Duração da animação (em segundos)                 | `0.5`              |
| `window.WebchatFabPulseScale`    | Escala máxima da pulsação                         | `1.1`              |

Exemplo com sobrescrita por variáveis:

```html
<script>
  window.WebchatChannelId = "seu-id-conexao";
  window.WebchatCtaMessage = "Atendimento imediato";
  window.WebchatFabPulseEnabled = true;
  window.WebchatFabPulseDuration = 0.5;
  window.WebchatFabPulseScale = 1.1;
</script>
<script src="https://seu-ticketz.com/webchat-fab.js" async></script>
```

Observação: a pulsação é configurada por variáveis `window` e não pelo painel da conexão. Os valores padrão atuais são duração `0.5s` e escala `1.1`.

### Método 3: Via URL do webchat (opcional)

Para ajustes da janela interna do chat, informe parâmetros em `WebchatPath`:

| Parâmetro   | Descrição           | Formato                                |
| ----------- | ------------------- | -------------------------------------- |
| `title`     | Título da janela    | `title=Suporte`                        |
| `subtitle`  | Subtítulo           | `subtitle=Equipe%20Online`             |
| `lang`      | Idioma da interface | `lang=pt` (pt, en, es, fr, de, id, it) |
| `primary`   | Cor primária        | `primary=%230066CC`                    |
| `secondary` | Cor secundária      | `secondary=%2300AA00`                  |
| `surface`   | Cor de fundo        | `surface=%23FFFFFF`                    |
| `text`      | Cor de texto        | `text=%23333333`                       |

Exemplo com parâmetros na URL do webchat:

```html
<script>
  window.WebchatChannelId = "seu-id-conexao";
  window.WebchatPath =
    "/webchat.html?lang=pt&primary=%230066CC&secondary=%2300AA00&surface=%23FFFFFF&text=%23333333";
</script>
<script src="https://seu-ticketz.com/webchat-fab.js" async></script>
```

Dica: a configuração da conexão no painel é a base. Variáveis `window` e parâmetros de URL sobrescrevem quando informados.

### Idiomas disponíveis

O Webchat detecta automaticamente o idioma do navegador. Idiomas suportados:

- Português (pt)
- Inglês (en)
- Espanhol (es)
- Francês (fr)
- Alemão (de)
- Indonésio (id)
- Italiano (it)

## Verificação

### O chat não aparece?

1. Verifique se a URL do Ticketz está acessível.
2. Confirme que o ID da conexão está exato (copie novamente do painel).
3. Abra o Console do navegador (F12) e procure por erros.
4. Verifique na aba Network se `webchat-fab.js` foi carregado com sucesso.

### O botão aparece, mas não abre?

1. Clique novamente no botão.
2. Verifique se o servidor Ticketz está rodando e acessível.
3. Procure por erros no Console do navegador.

Versão: 1.0  
Atualizado: março de 2026
