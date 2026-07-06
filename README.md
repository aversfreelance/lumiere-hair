# Lumière Hair Atelier

A premium multi-page hair salon website with online booking, multi-stylist support, and an admin dashboard. Built with **Next.js 16**, **Tailwind CSS**, and **Neon PostgreSQL**.

## Features

- **Multi-page public site**: Home, Services, Stylists, Gallery, Contact, Booking
- **Online booking system**: Step-by-step flow with real-time availability per stylist
- **Multiple stylists**: Each with their own schedule and service assignments
- **Admin panel**: Dashboard, booking management, stylist & service CRUD
- **Neon PostgreSQL**: Serverless Postgres via Drizzle ORM
- **Premium dark & gold design**: Luxury aesthetic with Playfair Display typography

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, featured services, CTA |
| `/services` | Full service menu with pricing |
| `/stylists` | Team profiles |
| `/gallery` | Portfolio gallery |
| `/contact` | Contact form & map |
| `/booking` | Multi-step booking wizard |
| `/admin` | Admin login |
| `/admin/dashboard` | Overview & recent bookings |
| `/admin/bookings` | Manage appointments |
| `/admin/stylists` | Manage stylists |
| `/admin/services` | Manage services |

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Neon Database

1. Create a free project at [console.neon.tech](https://console.neon.tech)
2. Copy your connection string
3. Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Neon `DATABASE_URL` and a secure `JWT_SECRET`.

### 3. Push schema & seed data

```bash
npm run db:push
npm run db:seed
```

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin Login

- **URL**: `/admin`
- **Email**: `admin@lumiere-hair.com`
- **Password**: `admin123`

> Change the admin password after first login in production.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel project settings:
   - `DATABASE_URL` — Neon PostgreSQL connection string
   - `JWT_SECRET` — long random string for admin auth
4. Deploy, then run locally against production DB:

```bash
DATABASE_URL="your-neon-url" JWT_SECRET="your-secret" npm run db:push
DATABASE_URL="your-neon-url" JWT_SECRET="your-secret" npm run db:seed
```

Admin login on production requires a seeded database (`DATABASE_URL` + `db:seed`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push schema to Neon |
| `npm run db:generate` | Generate migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Drizzle Studio |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Auth**: JWT cookies with bcrypt

## Project Structure

```
src/
├── app/
│   ├── (site)/          # Public pages
│   ├── admin/           # Admin panel
│   └── api/             # API routes
├── components/
│   ├── booking/         # Booking wizard
│   ├── layout/          # Header, Footer
│   └── ui/              # Shared UI components
└── lib/
    ├── db/              # Drizzle schema & client
    ├── auth.ts          # Admin authentication
    └── booking-utils.ts # Availability logic
```
