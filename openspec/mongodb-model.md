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
- `platform`: string
- `responsibleContact`: string
- `consent`: boolean
- `status`: string
- `createdAt`: date
- `updatedAt`: date

### Regras de negócio para o modelo
- `fullName` é obrigatório.
- `callNumber` deve ser único por turma ou por evento.
- `status` pode assumir valores como `pending`, `approved`, `rejected`.
- `consent` deve ser verdadeiro para inscrição válida.

### Exemplo de documento
```json
{
  "_id": "ObjectId",
  "fullName": "Ana Silva",
  "callNumber": "12",
  "className": "5A",
  "schoolYear": "5º ano",
  "nickname": "Aninha",
  "preferredGame": "Minecraft",
  "platform": "Nintendo Switch",
  "responsibleContact": "(11) 99999-9999",
  "consent": true,
  "status": "approved",
  "createdAt": "2026-07-06T10:00:00.000Z",
  "updatedAt": "2026-07-06T10:00:00.000Z"
}
```

## Coleção sugerida: tournamentSettings

### Campos
- `_id`: ObjectId
- `registrationOpen`: boolean
- `registrationDeadline`: date
- `tournamentName`: string
- `createdAt`: date
- `updatedAt`: date

Essa coleção pode controlar quando as inscrições abrem e fecham.
