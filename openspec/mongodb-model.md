# Modelo de dados para o MongoDB

## Coleção: registrations

### Campos principais
- `_id`: ObjectId
- `fullName`: string
- `callNumber`: string
- `className`: string
- `schoolYear`: string
- `nickname`: string
- `preferredGame`: string
- `partnerFullName`: string, opcional
- `partnerCallNumber`: string, opcional
- `partnerClassName`: string, opcional
- `partnerSchoolYear`: string, opcional
- `partnerNickname`: string, opcional
- `status`: string
- `isSeedData`: boolean
- `createdAt`: date
- `updatedAt`: date

### Regras de negócio para o modelo
- `fullName` é obrigatório.
- `callNumber` deve ser único por turma ou por evento.
- `status` pode assumir valores como `pending`, `approved`, `rejected`.
- `preferredGame` deve ser um dos jogos permitidos: FC26, STREET FIGHTER 6, Tartaruga ninja, Futmesa ou Flaflu.
- Campos `partner*` são obrigatórios apenas quando `preferredGame` for Futmesa ou Flaflu.
- `isSeedData` identifica inscrições geradas para simulação e limpeza posterior.

### Exemplo de documento
```json
{
  "_id": "ObjectId",
  "fullName": "Ana Silva",
  "callNumber": "12",
  "className": "5A",
  "schoolYear": "5º ano",
  "nickname": "Aninha",
  "preferredGame": "FC26",
  "status": "approved",
  "isSeedData": false,
  "createdAt": "2026-07-06T10:00:00.000Z",
  "updatedAt": "2026-07-06T10:00:00.000Z"
}
```

## Coleção: draws

### Campos principais
- `_id`: ObjectId
- `key`: string
- `seed`: string
- `games`: array
- `generatedAt`: date
- `createdAt`: date
- `updatedAt`: date

### Regras de negócio para o modelo
- O documento `current` representa o sorteio vigente.
- Cada item de `games` representa uma chave mata-mata de um jogo.
- As partidas devem referenciar participantes ou vencedores de partidas anteriores.
- Reprocessar o sorteio substitui o documento vigente.

## Coleção sugerida: tournamentSettings

### Campos
- `_id`: ObjectId
- `registrationOpen`: boolean
- `registrationDeadline`: date
- `tournamentName`: string
- `createdAt`: date
- `updatedAt`: date

Essa coleção pode controlar quando as inscrições abrem e fecham.
