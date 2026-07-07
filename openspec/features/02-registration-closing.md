# Funcionalidade: Encerramento das inscrições

## Objetivo
Fechar automaticamente as inscrições após duas semanas desde o início do processo.

## Regras
- O período de inscrição é de 14 dias.
- Após esse prazo, não é mais possível cadastrar novas inscrições.
- O sistema deve indicar claramente o status: aberta ou encerrada.

## Cenários principais
1. Inscrições ainda abertas.
2. Inscrições encerradas automaticamente após 14 dias.
3. Tentativa de inscrição após o encerramento.

## Critérios de aceite
- O estado do processo muda para encerrado após o prazo.
- O sistema bloqueia novas inscrições após o encerramento.
- A organização consegue visualizar o status de forma simples.
