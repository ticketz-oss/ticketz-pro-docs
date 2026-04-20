---
title: Server Cluster
lang: pt-br
slug: server-cluster
description: Configure e opere o modo Server Cluster no Ticketz PRO.
---

> **Status:** `not-released`  
> Esta página documenta uma funcionalidade já implementada, mas ainda não lançada oficialmente.

O Server Cluster permite que um nó do Ticketz descubra credenciais em outros nós e redirecione o usuário para o backend correto.

## Quando usar

Use esse recurso quando sua operação estiver dividida entre múltiplos nós do Ticketz e o usuário puder tentar login em um nó onde a conta não existe.

## Como funciona

1. A requisição de login é enviada para o backend atual.
2. Se as credenciais forem inválidas localmente, o Ticketz testa os nós do cluster configurados.
3. Se algum nó validar as credenciais, o backend retorna `backend_url`.
4. O frontend refaz o login nesse backend retornado e salva esse backend como base de API selecionada.

## Configuração em Ajustes

Acesse **Configurações > Server Cluster** e escolha o papel do servidor.

### Papel Master

- Preencha a lista de **hostnames dos slaves**.
- Cada hostname pode ser:
  - `dominio.exemplo.com` (usa `https` e caminho `/backend`)
  - `hostname:porta` (usa `http` e sem sufixo `/backend`)

### Papel Slave

- Preencha apenas o **hostname do master**.
- As mesmas regras de formato se aplicam:
  - `dominio.exemplo.com` -> `https://dominio.exemplo.com/backend`
  - `hostname:porta` -> `http://hostname:porta`

## Regras de formato de hostname

A lógica do cluster normaliza os valores removendo protocolo e caminho antes de salvar.

| Exemplo de entrada | URL de backend testada | Origem CORS permitida |
| --- | --- | --- |
| `node-a.ticketz.com` | `https://node-a.ticketz.com/backend` | `https://node-a.ticketz.com` |
| `10.0.0.25:8080` | `http://10.0.0.25:8080` | `http://10.0.0.25:8080` |

## Comportamento de CORS

As origens do cluster são adicionadas sem substituir o comportamento anterior.

- As origens legadas continuam válidas (`FRONTEND_URL`, `FRONTEND_CUSTOM_URL`, `FRONTEND_URL_REGEX`).
- Hostnames de slaves configurados no cluster também são liberados.
- Se a carga dinâmica de origens do cluster falhar, o Ticketz usa fallback para a allowlist legada.

## Comportamento do fluxo de login

Se o usuário tentar login no backend errado:

- o backend tenta `/auth/validate-login` nos nós configurados;
- em caso de sucesso, retorna `backend_url` na resposta de login;
- o frontend repete o login nesse backend e persiste essa URL para as próximas requisições.

## Dicas de validação

- Prefira hostnames DNS em produção.
- Use `hostname:porta` em ambientes locais ou redes privadas quando o TLS for terminado em outra camada.
- Garanta conectividade entre todos os nós envolvidos na validação de credenciais.
