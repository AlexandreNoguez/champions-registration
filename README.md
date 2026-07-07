# Champions Form

Projeto inicial em Next.js para inscrições de alunos em um torneio de videogames.

## Stack
- Next.js
- Material UI
- React Hook Form
- Zod
- MongoDB
- Vercel

## Como rodar localmente

### 1. Instalar dependências
```bash
npm install
```

### 2. Subir o MongoDB local
```bash
docker compose up -d
```

### 3. Rodar o projeto
```bash
npm run dev
```

## Variáveis de ambiente
Copie `.env.example` para `.env.local` e ajuste os valores locais:
```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/champions?authSource=admin
REGISTRATIONS_OPEN_AT=2026-07-01T00:00:00.000Z
REGISTRATIONS_CLOSE_AT=2026-07-15T23:59:59.000Z
ADMIN_TOKEN=local-development-token
```

As rotas de API usam nomes em inglês, por exemplo `/api/registrations`. Os textos exibidos para o usuário permanecem em PT-BR.

## Estrutura da OpenSpec
- [openspec/README.md](openspec/README.md)
- [openspec/context.md](openspec/context.md)
- [openspec/features](openspec/features)
- [openspec/requirements-functional.md](openspec/requirements-functional.md)
- [openspec/requirements-non-functional.md](openspec/requirements-non-functional.md)
- [openspec/mongodb-model.md](openspec/mongodb-model.md)
