# Funcionalidade: Sorteio e chaveamento

## Objetivo
Gerar o sorteio dos participantes e criar o chaveamento do torneio de forma automática.

## Regras
- O sorteio deve considerar apenas inscritos válidos e dentro do período de inscrição.
- O algoritmo deve gerar uma ordem aleatória para os participantes.
- O chaveamento deve ser criado com base nessa ordem.
- O processo deve ser reproduzível e transparente para a organização.

## Cenários principais
1. Sorteio com participantes válidos.
2. Sorteio com número ímpar de participantes.
3. Reprocessamento do sorteio após ajuste de dados.

## Critérios de aceite
- O sistema gera uma lista aleatória de participantes.
- O chaveamento é criado a partir do sorteio.
- O resultado pode ser consultado pela organização.
