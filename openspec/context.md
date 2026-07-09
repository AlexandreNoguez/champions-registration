# Contexto do projeto

## Nome
Champions Form

## Objetivo
Capturar inscrições de alunos do ensino fundamental para um torneio de videogames, com informações básicas para organização e sorteio.

## Público-alvo
- Alunos do ensino fundamental.
- Organização do torneio.
- Professores ou responsáveis que auxiliam na inscrição.

## Escopo inicial
- Formulário com dados básicos do aluno.
- Armazenamento das inscrições.
- Encerramento automático após 14 dias.
- Geração de sorteio e chaveamento.
- Interface premium com Material UI.

## Fora de escopo inicial
- Login de usuários complexos.
- Sistema de pagamento.
- Ranking detalhado de desempenho.
- Modo multiplayer avançado.

## Stack técnico
- Frontend: Next.js
- Backend/API: Next.js, usando rotas de API ou server actions
- Banco de dados: MongoDB Atlas gratuito
- Hospedagem: Vercel
- Formulários: React Hook Form + Zod
- UI: Material UI

## Arquitetura esperada
- O formulário será renderizado no frontend com uma experiência moderna e responsiva.
- A validação do formulário será feita com Zod e React Hook Form.
- O envio das inscrições será processado no servidor e salvo no MongoDB Atlas.
- A lógica de encerramento e sorteio será executada no backend do projeto.
- A aplicação será hospedada na Vercel, mantendo o projeto simples e gratuito.

## Informações básicas do formulário
Campos recomendados:
- Nome completo
- Turma
- Ano escolar
- Apelido ou nome de gamer
- Jogo escolhido
- Número da chamada, quando disponível

## Regras de negócio
- Cada aluno pode se inscrever uma vez por jogo.
- O formulário deve impedir campos vazios obrigatórios.
- As inscrições devem fechar automaticamente após duas semanas.
- O sorteio deve considerar apenas participantes ativos e validados.
- O sistema deve gerar um chaveamento mata-mata aleatório e justo, separado por jogo.
- Cada inscrição deve escolher somente um dos jogos disponíveis: FC26, STREET FIGHTER 6, Tartaruga ninja, Futmesa ou Flaflu.
- Futmesa e Flaflu devem ser disputados em dupla.
