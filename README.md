# iam-ms

Identity service: login, token verification and user lookup. Part of the Cross-Repo Review test system (iam-ms, catalog-ms, cart-ms, invoices).

## Provides

| Contract | Kind | Used by |
| --- | --- | --- |
| `POST /login` → `{ token, user: { id, email, fullName, role } }` | HTTP | clients |
| `POST /auth/verify` `{ token }` → `{ valid, userId, role }` | HTTP | catalog-ms, cart-ms |
| `GET /users/:id` → `{ id, email, fullName, role }` | HTTP | cart-ms |
| `users` table: `id, email, password_hash, full_name, role` | Database | invoices (reads `email`, `full_name` directly) |

## Consumes

Nothing from the other services.

## Run

```bash
cp .env.example .env     # set MS_DATABASE_URL and JWT_SECRET
npm install
npm run migrate && npm run seed
npm start
```

Seed users: `alice@example.com` / `password123` (customer), `admin@example.com` / `admin123` (admin).
