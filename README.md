# Maxwell Fae - Site & API

Application fullstack pour l'Association Sportive Maxwell Fae:
- Frontend: React + Vite + TypeScript + Tailwind
- Backend: Express + TypeScript + Mongoose (MongoDB)

## Prerequis

- Node.js 20.19+ (ou 22.12+)
- npm 10+
- MongoDB local ou Atlas

## Installation

### 1. Frontend (racine)

```bash
npm install
```

### 2. Backend

```bash
cd backend
npm install
copy .env.example .env
```

Renseigner ensuite les variables dans `backend/.env`:
- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

## Lancement en developpement

### Terminal 1 (API)

```bash
cd backend
npm run dev
```

API disponible sur `http://localhost:4000`.

### Terminal 2 (Web)

```bash
npm run dev
```

Frontend disponible sur `http://localhost:5173`.

## Scripts utiles

### Frontend (racine)

- `npm run dev`: demarre Vite
- `npm run build`: build production frontend
- `npm run lint`: lint frontend + backend
- `npm run test`: execute les tests backend

### Backend (`backend/`)

- `npm run dev`: API en watch mode
- `npm run build`: compile TypeScript vers `dist`
- `npm run start`: demarre l'API compilee
- `npm run seed`: script de seed (destructif)
- `npm run test`: compile + execute les tests Node

## Seed backend (important)

Le script `npm run seed` supprime et recree plusieurs collections de contenu.

Variables necessaires:
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `SEED_RESET_CONTENT=true` (obligatoire pour confirmer le reset)

En production, ajouter aussi:
- `ALLOW_DESTRUCTIVE_SEED=true`

## Securite

- Session admin via cookie HttpOnly (`SameSite=Lax`, `Secure` en production).
- Validation des payloads API avec Zod.
- Rate limiting actif par defaut (`RATE_LIMIT_ENABLED=true`).
- Aucun secret sensible ne doit etre committe.

## Structure

- `src/`: frontend React
- `public/`: assets statiques
- `backend/src/`: API Express
- `backend/src/models/`: schemas Mongoose
