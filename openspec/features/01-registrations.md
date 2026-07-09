# Funcionalidade: Cadastro de inscrições

## Objetivo
Permitir que um aluno preencha um formulário e tenha sua inscrição registrada para o torneio.

## Entrada
- Nome completo
- Número da chamada
- Turma
- Ano escolar
- Apelido ou nome de gamer
- Jogo escolhido
- Dados do parceiro quando o jogo escolhido for Flaflu

## Regras
- Todos os campos obrigatórios devem ser preenchidos.
- Não pode existir mais de uma inscrição para o mesmo aluno.
- A inscrição deve ser armazenada com data e hora do envio.
- O sistema deve rejeitar dados inválidos ou incompletos.
- O jogo deve ser escolhido entre FC26, STREET FIGHTER 6, Tartaruga ninja, Futmesa e Flaflu.
- Cada aluno participa apenas do jogo escolhido na inscrição.
- Flaflu deve ser inscrito em dupla; os dados do parceiro são obrigatórios somente para esse jogo.
- Um aluno informado como parceiro em Flaflu não pode aparecer em outra inscrição.

## Cenários principais
1. Cadastro bem-sucedido.
2. Cadastro com campo obrigatório vazio.
3. Tentativa de dupla inscrição do mesmo aluno.
4. Cadastro de Flaflu com parceiro obrigatório.

## Critérios de aceite
- A inscrição é salva com sucesso quando todos os dados obrigatórios estão corretos.
- O sistema exibe mensagem clara em caso de erro de validação.
- O sistema impede inscrição duplicada.
