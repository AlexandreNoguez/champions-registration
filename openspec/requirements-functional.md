# Requisitos funcionais

## Cadastro de inscrição
- O sistema deve permitir que um aluno preencha um formulário com dados básicos.
- O sistema deve validar todos os campos obrigatórios antes de salvar a inscrição.
- O sistema deve impedir duplicidade de inscrição para o mesmo aluno no mesmo jogo.
- O sistema deve registrar a data e a hora da inscrição.

## Consulta de inscrições
- A organização deve poder visualizar a lista de inscrições cadastradas.
- O sistema deve permitir consultar inscrições por turma, ano ou status.

## Encerramento de inscrições
- O sistema deve encerrar automaticamente as inscrições após 14 dias.
- O sistema deve exibir o status atual das inscrições como aberta ou encerrada.

## Sorteio e chaveamento
- O sistema deve gerar um sorteio aleatório com os inscritos válidos.
- O sistema deve criar um chaveamento com base no sorteio.
- O sistema deve permitir consultar o resultado do sorteio.

## Persistência
- As inscrições devem ser salvas no MongoDB Atlas em ambiente de produção.
- O sistema deve funcionar com um banco MongoDB local em desenvolvimento.
