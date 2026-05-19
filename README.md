# proiect-IS-backend-node

Backend Node.js pentru aplicația de căutare locuri turistice (hoteluri, restaurante, atracții).

**Stack:** Node.js · Express · Prisma · PostgreSQL · JWT · bcrypt

---

## Structura proiectului

```
src/
├── app.js                    # Configurare Express (middleware, rute)
├── server.js                 # Pornire server
├── routes/                   # Definire rute HTTP
│   ├── authRoutes.js
│   ├── historyRoutes.js
│   ├── favoriteRoutes.js
│   ├── searchRoutes.js
│   ├── placeRoutes.js
│   └── userRoutes.js
├── controllers/              # Strat HTTP: parsează cereri, returnează răspunsuri
│   ├── authController.js
│   ├── historyController.js
│   ├── favoriteController.js
│   ├── searchController.js
│   └── placeController.js
├── services/                 # Logică de business
│   ├── authService.js
│   ├── historyService.js
│   ├── favoriteService.js
│   └── placesService.js
├── middleware/
│   └── authMiddleware.js     # Verificare JWT
└── utils/
    └── jwt.js                # Generare și verificare tokeni JWT
prisma/
└── schema.prisma             # Schema bazei de date
```

---

## Setup

### 1. Cerințe

- Node.js >= 18
- PostgreSQL >= 14

### 2. Instalare dependențe

```bash
npm install
```

### 3. Variabile de mediu

Copiați `.env.example` în `.env` și completați:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://user:parola@localhost:5432/travel_app"
JWT_SECRET="sir-aleatoriu-minim-32-caractere"
PORT=3099
PLACES_API_KEY="cheia-google-places-api"
```

### 4. Baza de date

```bash
# Creați tabelele în PostgreSQL
npx prisma migrate dev --name init

# Generați clientul Prisma (dacă e necesar)
npx prisma generate

# Vizualizați datele în browser
npx prisma studio
```

### 5. Pornire server

```bash
# Development (cu reîncărcare automată)
npm run dev

# Producție
npm start
```

Serverul pornește pe `http://localhost:3099`.

---

## Specificație API

### Autentificare

| Metodă | Endpoint | Descriere | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/signup` | Înregistrare cont nou | Nu |
| POST | `/api/auth/signin` | Autentificare, returnează JWT | Nu |
| GET | `/api/auth/me` | Profil utilizator curent | Da |

**POST /api/auth/signup**
```json
// Request
{ "email": "user@example.com", "password": "parola123", "passwordConfirm": "parola123", "name": "Ion Pop" }

// Response 201
{ "token": "eyJ...", "record": { "id": "uuid", "email": "user@example.com", "name": "Ion Pop" } }
```

**POST /api/auth/signin**
```json
// Request
{ "email": "user@example.com", "password": "parola123" }

// Response 200
{ "token": "eyJ...", "record": { "id": "uuid", "email": "user@example.com", "name": "Ion Pop" } }
```

---

### Căutare locuri (Google Places)

| Metodă | Endpoint | Descriere | Auth |
|--------|----------|-----------|------|
| POST | `/api/search/hotels` | Caută hoteluri | Opțional |
| POST | `/api/search/restaurants` | Caută restaurante | Opțional |
| POST | `/api/search/attractions` | Caută atracții turistice | Opțional |
| GET | `/api/recommendations` | Recomandări bazate pe istoric | Da |
| POST | `/api/nearby` | Locuri apropiate de coordonate | Da |
| GET | `/api/place/:placeId` | Detalii loc specific | Nu |
| GET | `/api/photo?reference=...` | Proxy fotografie loc | Nu |

**POST /api/search/hotels**
```json
// Request
{ "city": "Cluj-Napoca", "radius": 10 }

// Response 200
{ "results": [{ "place_id": "...", "name": "Hotel X", "rating": 4.5, "place_type": "hotels" }], "next_page_token": null }
```

---

### Istoric căutări

| Metodă | Endpoint | Descriere | Auth |
|--------|----------|-----------|------|
| GET | `/api/history` | Obține istoricul | Da |
| POST | `/api/history` | Salvează o căutare | Da |
| DELETE | `/api/history` | Șterge tot istoricul | Da |

**GET /api/history**
```json
// Response 200
{ "items": [{ "id": "uuid", "city": "Cluj-Napoca", "type": "hotels", "radius": 10, "createdAt": "2026-05-19T..." }] }
```

---

### Favorite

| Metodă | Endpoint | Descriere | Auth |
|--------|----------|-----------|------|
| GET | `/api/favorites` | Listează favorite (`?type=hotels`) | Da |
| POST | `/api/favorites` | Adaugă favorit | Da |
| DELETE | `/api/favorites/:placeId` | Elimină favorit | Da |
| POST | `/api/favorites/check` | Verifică o listă de place_id | Da |
| GET | `/api/favorites/status/:placeId` | Verifică un singur place_id | Da |

**POST /api/favorites**
```json
// Request
{ "place_id": "ChIJ...", "name": "Hotel Belvedere", "address": "Str. X", "place_type": "hotels", "rating": 4.2 }

// Response 201
{ "id": "uuid", "userId": "...", "placeId": "ChIJ...", "name": "Hotel Belvedere" }
```

---

### Utilizator

| Metodă | Endpoint | Descriere | Auth |
|--------|----------|-----------|------|
| POST | `/api/user/update` | Actualizează profil/parolă | Da |

---

## Flux Git

```
main
 └── develop
      ├── feature/auth-jwt
      ├── feature/history-crud
      └── feature/favorites
```

- Niciodată commit direct pe `main` sau `develop`
- PR-uri cu review de la un coleg înainte de merge
- Mesaje de commit: `feat:`, `fix:`, `docs:`, `refactor:`

---

## Contribuții echipă

| Membru | Feature |
|--------|---------|
| - | Autentificare (auth routes + JWT) |
| - | Istoric căutări (history CRUD) |
| - | Favorite (favorites CRUD) |
| - | Integrare Google Places API |
