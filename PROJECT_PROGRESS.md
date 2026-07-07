# Project Progress

## Phase 1 - Foundation

- [x] Create `.env.example` and local `.env.local` structure.
- [x] Validate server environment variables in `src/lib/env.ts`.
- [x] Create registration domain schema, types, and rules.
- [x] Create MongoDB registration model.
- [x] Connect MongoDB through centralized environment config.
- [x] Refactor code, variables, and file names to English.

## Phase 2 - Registration API

- [x] Validate request payload with Zod.
- [x] Normalize registration input before persistence.
- [x] Block submissions outside the registration period.
- [x] Save valid registrations to MongoDB.
- [x] Prevent duplicated registrations by class and call number.
- [x] Return clear PT-BR messages for success and errors.
- [x] Validate with lint, build, and manual API calls.

## Phase 3 - Registration Frontend

- [x] Create presentational registration form components.
- [x] Create hooks for form state and submission logic.
- [x] Connect the form to `/api/registrations`.
- [x] Show PT-BR success, validation, and error states.

## Phase 4 - Registration Closing

- [x] Expose registration status to the frontend.
- [x] Display open or closed state.
- [x] Keep backend as the source of truth for closing rules.

## Phase 5 - Admin View

- [x] Protect admin endpoints with `ADMIN_TOKEN`.
- [x] List registrations.
- [x] Show totals and filters by class, year, and status.

## Phase 6 - Draw and Bracket

- [ ] Create draw domain rules.
- [ ] Generate fair random pairings.
- [ ] Persist draw results.
- [ ] Display bracket to organizers.
