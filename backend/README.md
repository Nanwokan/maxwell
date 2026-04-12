# Maxwell Backend

Backend v1 built with:

- Node.js
- TypeScript
- Express
- Mongoose
- MongoDB

## Scripts

```bash
npm install
npm run dev
npm run build
npm run start
npm run seed
npm run test
```

## Environment variables

Copy `.env.example` to `.env` and configure:

- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `RATE_LIMIT_ENABLED`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`

On startup, the API automatically creates or updates the admin account from
`SEED_ADMIN_EMAIL` + `SEED_ADMIN_PASSWORD` (role forced to `super_admin`).

For destructive seed:
- `SEED_RESET_CONTENT=true` (mandatory)
- `ALLOW_DESTRUCTIVE_SEED=true` (mandatory only in production)

## Public endpoints

- `GET /api/health`
- `GET /api/public/site`
- `GET /api/public/homepage`
- `GET /api/public/categories`
- `GET /api/public/news`
- `GET /api/public/news/:slug`
- `GET /api/public/staff`
- `GET /api/public/gallery`
- `GET /api/public/partners`
- `POST /api/public/contact`
- `POST /api/public/registrations`

## Admin endpoints

- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `POST /api/admin/auth/forgot-password`
- `POST /api/admin/auth/verify-reset-code`
- `POST /api/admin/auth/reset-password`
- `GET /api/admin/me`
- `GET /api/admin/status`
- `GET/PATCH /api/admin/site-settings`
- `GET/PATCH /api/admin/homepage`
- `GET/POST/PATCH/DELETE /api/admin/admin-users`
- `GET/POST/PATCH/DELETE /api/admin/categories`
- `GET/POST/PATCH/DELETE /api/admin/news`
- `GET/POST/PATCH/DELETE /api/admin/staff`
- `GET/POST/PATCH/DELETE /api/admin/gallery`
- `GET/POST/PATCH/DELETE /api/admin/partners`
- `GET/PATCH /api/admin/contact-messages` (supports `status`, `page`, `limit`)
- `GET/PATCH /api/admin/registrations` (supports `status`, `page`, `limit`)

## Models

- `AdminUser`
- `SiteSettings`
- `HomepageContent`
- `Category`
- `NewsPost`
- `StaffMember`
- `GalleryItem`
- `Partner`
- `ContactMessage`
- `Registration`
