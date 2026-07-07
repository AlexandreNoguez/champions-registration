# OpenSpec para o projeto Champions Form

Este projeto usa OpenSpec para descrever o sistema antes de implementar.

## Objetivo
Criar um formulário para inscrições de alunos do ensino fundamental em um torneio de videogames, com fechamento automático após duas semanas e geração de chaveamento por sorteio.

## Stack técnico definido
- Frontend: Next.js
- UI: Material UI
- Formulários: React Hook Form + Zod
- Backend/API: Next.js no mesmo projeto
- Banco de dados: MongoDB Atlas gratuito
- Hospedagem: Vercel
- Estratégia: manter o projeto 100% gratuito e simples de manter

## Estrutura sugerida
- `context.md`: visão geral do problema, contexto e regras de negócio.
- `features/`: uma pasta por funcionalidade principal.
- `decisions.md`: decisões importantes do projeto.
- `open-questions.md`: dúvidas que ainda precisam ser respondidas.

## Como usar bem
1. Defina claramente o problema e o público.
2. Escreva uma funcionalidade por arquivo.
3. Sempre inclua: objetivo, dados de entrada, regras, cenários e critérios de aceite.
4. Mantenha as especificações pequenas e verificáveis.
5. Após implementar, atualize a especificação para refletir o estado real do sistema.

## Funcionalidades iniciais
- Cadastro de inscrição do aluno.
- Validação dos campos obrigatórios.
- Encerramento das inscrições após 14 dias.
- Sorteio e chaveamento automático.
- Persistência das inscrições no MongoDB Atlas.
