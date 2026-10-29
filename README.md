# iam-ms

Identity service: login, token verification and user lookup. Part of the Cross-Repo Review test system (iam-ms, catalog-ms, cart-ms, orders-ms, invoices).

## Provides

| Contract | Kind | Used by |
| --- | --- | --- |
| `POST /login` → `{ token, user: { id, email, fullName, role } }` | HTTP | clients |
| `POST /auth/verify` `{ token }` → `{ valid, userId, role }` | HTTP | catalog-ms, cart-ms |
| `POST /register` `{ email, password, fullName }` → `201 { token, user }` | HTTP | clients |
| `GET /users/:id` → `{ id, email, fullName, role, ordersCount, lastOrderAt }` | HTTP | cart-ms |
| `user.registered` `{ id, email, fullName, role }` | Event (published) | orders-ms |
| `users` table: `id, email, password_hash, full_name, role` | Database | invoices (reads `email`, `full_name` directly) |

## Consumes

| Contract | From | Where |
| --- | --- | --- |
| `order.placed` `{ orderId, userId, total, currency, placedAt }` → bumps `orders_count`, `last_order_at` | orders-ms | `events/consumers.js` (queue `iam-ms.events`) |
| Env var `RABBITMQ_URL` | deployment | `lib/events.js` |

## Events

Async events go over the RabbitMQ topic exchange `shop.events` (routing key = event type, envelope `{ id, type, source, occurredAt, data }`). See `lib/events.js`.

## Run

```bash
docker run -d --name rabbitmq -p 5672:5672 rabbitmq:3-alpine   # shared event broker
cp .env.example .env     # set MS_DATABASE_URL and JWT_SECRET
npm install
npm run migrate && npm run seed
npm start
```

Seed users: `alice@example.com` / `password123` (customer), `admin@example.com` / `admin123` (admin).
