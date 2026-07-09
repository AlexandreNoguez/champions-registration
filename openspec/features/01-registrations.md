# Funcionalidade: Cadastro de inscrições

## Objetivo
Permitir que um aluno preencha um formulário e tenha sua inscrição registrada para o torneio.

## Entrada
- Nome completo
- Número da chamada, opcional
- Turma
- Ano escolar
- Apelido ou nome de gamer
- Jogo escolhido
- Dados do parceiro quando o jogo escolhido for Futmesa ou Flaflu

## Regras
- Todos os campos obrigatórios devem ser preenchidos.
- Não pode existir mais de uma inscrição para o mesmo aluno no mesmo jogo.
- Quando o número da chamada não for informado, a identificação do aluno deve considerar jogo, turma e nome completo.
- A inscrição deve ser armazenada com data e hora do envio.
- O sistema deve rejeitar dados inválidos ou incompletos.
- O jogo deve ser escolhido entre FC26, STREET FIGHTER 6, Tartaruga ninja, Futmesa e Flaflu.
- Cada aluno participa apenas do jogo escolhido na inscrição.
- Futmesa e Flaflu devem ser inscritos em dupla; os dados do parceiro são obrigatórios somente para esses jogos.
- Um aluno informado como parceiro em Futmesa ou Flaflu não pode aparecer em outra inscrição do mesmo jogo.

## Cenários principais
1. Cadastro bem-sucedido.
2. Cadastro com campo obrigatório vazio.
3. Tentativa de dupla inscrição do mesmo aluno no mesmo jogo.
4. Cadastro de modalidade em dupla com parceiro obrigatório.

## Critérios de aceite
- A inscrição é salva com sucesso quando todos os dados obrigatórios estão corretos.
- O sistema exibe mensagem clara em caso de erro de validação.
- O sistema impede inscrição duplicada no mesmo jogo.
