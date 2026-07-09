# Funcionalidade: Sorteio e chaveamento

## Objetivo
Gerar o sorteio dos participantes e criar o chaveamento mata-mata do torneio de forma automática, separado por jogo.

## Regras
- O sorteio deve considerar apenas inscritos válidos, não rejeitados e dentro do período de inscrição.
- O algoritmo deve gerar uma ordem aleatória para os participantes de cada jogo.
- O chaveamento deve ser criado com base nessa ordem, em formato mata-mata.
- Participantes só podem ser chaveados contra outros participantes do mesmo jogo.
- Em Flaflu, cada inscrição representa uma dupla no chaveamento, exibindo aluno principal e parceiro como um único competidor.
- Quando houver número de participantes que não fecha a chave, o sistema deve gerar BYEs distribuídos de forma balanceada pela chave.
- O tamanho da chave deve usar a menor potência de 2 que comporta os inscritos do jogo. Exemplo: 9 a 16 participantes formam oitavas; 5 a 8 formam quartas; 3 a 4 formam semifinais.
- BYEs não devem ficar concentrados no fim da primeira rodada para evitar que um lado da chave avance quase inteiro sem confrontos.
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
- A chave de Flaflu mostra as duplas nas partidas e no campeão.
