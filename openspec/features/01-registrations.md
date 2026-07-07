# Funcionalidade: Cadastro de inscrições

## Objetivo
Permitir que um aluno preencha um formulário e tenha sua inscrição registrada para o torneio.

## Entrada
- Nome completo
- Número da chamada
- Turma
- Ano escolar
- Apelido ou nome de gamer
- Jogo preferido ou plataforma
- Contato do responsável
- Consentimento de participação

## Regras
- Todos os campos obrigatórios devem ser preenchidos.
- Não pode existir mais de uma inscrição para o mesmo aluno.
- A inscrição deve ser armazenada com data e hora do envio.
- O sistema deve rejeitar dados inválidos ou incompletos.

## Cenários principais
1. Cadastro bem-sucedido.
2. Cadastro com campo obrigatório vazio.
3. Tentativa de dupla inscrição do mesmo aluno.

## Critérios de aceite
- A inscrição é salva com sucesso quando todos os dados obrigatórios estão corretos.
- O sistema exibe mensagem clara em caso de erro de validação.
- O sistema impede inscrição duplicada.
