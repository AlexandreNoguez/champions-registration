# Funcionalidade: Sorteio e chaveamento

## Objetivo
Gerar o sorteio dos participantes e criar o chaveamento mata-mata do torneio de forma automática, separado por jogo.

## Regras
- O sorteio deve considerar apenas inscritos válidos, não rejeitados e dentro do período de inscrição.
- O algoritmo deve gerar uma ordem aleatória para os participantes de cada jogo.
- O chaveamento deve ser criado com base nessa ordem, em formato mata-mata.
- Participantes só podem ser chaveados contra outros participantes do mesmo jogo.
- Quando houver número de participantes que não fecha a chave, o sistema deve gerar avanço automático.
- O processo deve ser reproduzível e transparente para a organização por meio de uma seed persistida.

## Cenários principais
1. Sorteio com participantes válidos.
2. Sorteio com número ímpar de participantes.
3. Reprocessamento do sorteio após ajuste de dados.
4. Sorteio separado por jogo.

## Critérios de aceite
- O sistema gera uma lista aleatória de participantes.
- O chaveamento é criado a partir do sorteio.
- O resultado pode ser consultado pela organização.
- Cada chave mostra somente participantes do mesmo jogo.
