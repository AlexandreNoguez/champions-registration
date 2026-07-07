# Decisões de projeto

## 1. Uso de OpenSpec
O projeto será especificado primeiro em arquivos de texto simples, separados por contexto, funcionalidades e decisões.

## 2. Formulário inicial
O formulário deve priorizar informações básicas para evitar excesso de complexidade.

## 3. Encerramento por tempo
As inscrições serão encerradas automaticamente após 14 dias.

## 4. Sorteio simples
O sorteio inicial será baseado em ordem aleatória dos participantes válidos.

## 5. Stack técnico
O projeto será desenvolvido com Next.js, usando Material UI para a interface, React Hook Form + Zod para formulários e validação, MongoDB Atlas para persistência e Vercel para hospedagem gratuita.

## 6. Escopo inicial
O foco inicial é o fluxo completo de inscrição, encerramento e sorteio, sem funcionalidades extras.

## 7. Acesso administrativo inicial
O painel administrativo inicial será protegido por `ADMIN_TOKEN`, enviado como Bearer token para endpoints em `/api/admin/*`. A interface `/admin` mantém o token somente no navegador para simplificar a operação sem criar um sistema de login completo nesta fase.

## 8. Jogos oficiais do torneio
As inscrições aceitam apenas os jogos FC26, STREET FIGHTER 6, Tartaruga ninja, Futmesa e Flaflu. Plataforma, contato do responsável e autorização foram removidos do formulário inicial.

## 9. Chaveamento mata-mata
O sorteio inicial será gerado em formato mata-mata, separado por jogo. O documento vigente do sorteio será persistido na coleção `draws` com uma seed para transparência e poderá ser reprocessado pela organização.

## 10. Seeds de teste
O painel administrativo pode gerar 50 inscrições de teste marcadas com `isSeedData`. A limpeza dessas seeds remove apenas inscrições com essa marcação, preservando inscrições reais.

## 11. Distribuição de BYEs no chaveamento
O chaveamento usa a menor potência de 2 que comporta os inscritos de cada jogo. Quando há BYEs, eles são distribuídos pelas posições da chave para evitar concentração em um único lado e reduzir avanços sem confronto até fases finais.
