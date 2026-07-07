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
