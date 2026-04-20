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

## Ordem de configuração: Slaves antes do Master

**Importante:** Configure todos os servidores **slave** com regras de CORS que permitam a origem do servidor **master** *antes* de configurar o master.

Por quê? O master valida conectividade com os slaves durante o salvamento da configuração. Slaves descobrirão a conectividade com o master apenas durante tentativas de login e falharão graciosamente se inacessíveis.

## Formato de hostname

Os hostnames dos nós devem ser nomes DNS sem protocolo ou caminho:

- ✅ `cluster-node-1.empresa.com`
- ✅ `ticketz.exemplo.org.br`
- ❌ `https://cluster-node-1.empresa.com`
- ❌ `cluster-node-1.empresa.com/backend`
- ❌ `cluster-node-1.empresa.com:3001` (prefira registros DNS SRV ou load balancers com TLS)

O Ticketz adicionará automaticamente o protocolo e o caminho do backend.

## Configuração em Ajustes

Acesse **Configurações > Server Cluster** e escolha o papel do servidor.

### Papel Master

- Preencha a lista de **hostnames dos slaves**.
- O master validará a conectividade de todos os slaves durante o salvamento.
- Pode ficar vazio; slaves podem ser adicionados ou atualizados posteriormente.

### Papel Slave

- Preencha apenas o **hostname do master**.
- Nenhuma validação de conectividade é feita (devido às restrições de CORS).
- O slave descobrirá a conectividade durante tentativas reais de login e falhará graciosamente se inacessível.

## Mensagens de erro

Ao salvar uma configuração de master, cada hostname de slave é validado. Se a validação falhar, a mensagem de erro mostra:

- Qual hostname falhou
- Por que falhou (inacessível, resposta inválida, etc.)

Você pode corrigir o hostname, regras de firewall, configuração de CORS ou outros problemas e tentar novamente.

## Comportamento do fluxo de login

Se o usuário tentar login no backend errado:

- o backend tenta `/auth/validate-login` nos nós configurados;
- em caso de sucesso, retorna `backend_url` na resposta de login;
- o frontend repete o login nesse backend e persiste essa URL para as próximas requisições.

## Dicas de validação

- Prefira hostnames DNS em produção.
- Use `hostname:porta` em ambientes locais ou redes privadas quando o TLS for terminado em outra camada.
- Garanta conectividade entre todos os nós envolvidos na validação de credenciais.
