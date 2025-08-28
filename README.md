<!-- README.md -->

# Nihil Backend Monorepo

A **backend monorepo** for the [Nihil platform](https://github.com/Ange230700), built with **Nx**, **TypeScript**, **Express**, and **Prisma**.
It contains multiple microservices, each with its own database and schema, currently:

- **User Service** → authentication, user CRUD, profiles
- **Post Service** → post CRUD, pagination, soft deletes

Each service is independently testable, dockerized, and deployed via CI/CD pipelines.

---

## Table of Contents

- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Services](#services)
- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Demo

Each service exposes a Swagger UI:

- User Service → `http://localhost:3001/api/docs`
- Post Service → `http://localhost:3002/api/docs`

---

## Tech Stack

**Core:**

- [Node.js](https://nodejs.org/) (TypeScript, ESM)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/) (MySQL, one DB per service)
- [Nx](https://nx.dev/) for task orchestration

**Security:**

- JWT (RS256 access + refresh tokens)
- CSRF protection (double-submit cookie)
- Helmet, HPP, CORS
- Argon2 password hashing
- Rate limiting

**Tooling:**

- Jest + Supertest + Zod for tests
- ESLint + Prettier + TypeScript ESLint
- Husky, lint-staged, commitlint, commitizen
- GitHub Actions CI with MySQL services
- Docker multi-stage builds
- Docker Compose for local orchestration

---

## Services

### 🔑 User Service

- Authentication (login, refresh, logout)
- User CRUD
- User Profiles (bio, location, birthdate, website)
- Secure cookies for refresh tokens
- Swagger docs at `/api/docs`

### 📝 Post Service

- Post CRUD (create, list, get by ID, update, soft delete)
- Pagination, filtering, full-text search
- Optional authentication binding (`userId` from JWT or body)
- Swagger docs at `/api/docs`

---

## Getting Started

### Prerequisites

- Node.js (>=20.x)
- MySQL (>=8.0)
- Docker (optional, for containerized runs)

### Installation

```bash
git clone --recursive https://github.com/Ange230700/nihil_backend.git
cd nihil_backend
npm install
npm run copy-envs
```

This will pull the `user` and `post` services as submodules and install all dependencies.

---

## Running the Project

### Local Development

```bash
# Push schemas to databases (force reset)
npm run prisma:db:push:force:all

# Run migrations
npm run prisma:migrate:deploy:all

# Build and run both services
npm run build:all
npm run start --workspace=user
npm run start --workspace=post
```

### With Docker Compose

```bash
docker compose up --build
```

- User service → [http://localhost:3001/api](http://localhost:3001/api)
- Post service → [http://localhost:3002/api](http://localhost:3002/api)

---

## Project Structure

```
.
├── user/                # User service (submodule)
│   ├── src/             # API, core, application, infrastructure
│   └── README.md
├── post/                # Post service (submodule)
│   ├── src/             # API, core, application, infrastructure
│   └── README.md
├── docker-compose.yml   # Local orchestration of both services
├── nx.json              # Nx workspace configuration
├── package.json         # Root scripts
└── .github/workflows/   # CI/CD workflows
```

---

## Testing

Run tests across all services:

```bash
npm run test:all
```

Run in CI mode (serial, pre-push):

```bash
npm run test:ci:all
```

- Each service has its own **Jest + Supertest** suite.
- Pre-push hooks enforce testing, linting, and commit rules.

---

## Deployment

- **Dockerized services:** Each service has its own multi-stage Dockerfile.
- **Compose setup:** `docker-compose.yml` runs both services locally.
- **CI/CD:** GitHub Actions pipeline:
  - Spins up MySQL containers for `user` and `post`
  - Runs migrations via Prisma
  - Builds and tests all services

- **Production:** Runs services under non-root users (`appuser`) with small images.

---

## Environment Variables

Each service requires its own `.env`. Samples are provided (`.env.sample`).

### User Service

```env
USER_DATABASE_URL=mysql://root:root@localhost:3306/user_db
FRONT_API_BASE_URL=http://localhost:5173
JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=30d
PORT=3001
```

### Post Service

```env
POST_DATABASE_URL=mysql://root:root@localhost:3306/post_db
FRONT_API_BASE_URL=http://localhost:5173
JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=30d
PORT=3002
```

---

## Contributing

We use **conventional commits** and enforce branch naming rules.
Husky hooks ensure linting, tests, and commit message validation.

Steps:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit using `npm run commit`
4. Push and open a PR

---

## License

This project is licensed under the ISC License.

---

## Contact

**Ange KOUAKOU**

- [Portfolio](https://ultime-portfolio.vercel.app/)
- [GitHub](https://github.com/Ange230700)
- [LinkedIn](https://www.linkedin.com/in/ange-kouakou/)
