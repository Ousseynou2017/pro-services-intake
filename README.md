# Atlas Consulting — Services Intake

A small business website with a smart, multi-step contact form and a protected
admin dashboard. Built for a fictional consulting agency as a portfolio piece.

Visitors browse the services and submit a request through a 3-step form whose
questions **change based on the service they pick**. Each submission lands in a
Postgres table. The owner signs in to `/admin` to review requests, sort them by
date, and move them through a simple pipeline (New → Contacted → Archived).

## Features

- **Landing page** — hero, three services, and an embedded intake form.
- **Dynamic intake form** — three steps (contact details → service → tailored
  questions), inline validation, and a confirmation screen.
- **Admin dashboard** — email/password sign-in, request table with date sorting
  and a status dropdown, responsive down to mobile.
- **Row-level security** — the public key can insert a request but cannot read
  any; only a signed-in admin can read and update.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [Supabase](https://supabase.com) — Postgres database + Auth

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create the database**

   In your Supabase project, open the SQL Editor and run
   [`supabase/schema.sql`](supabase/schema.sql). It creates the `requests`
   table and the row-level security policies.

3. **Create the admin account**

   In Supabase, go to Authentication → Users → Add user. Enter an email and
   password, and enable **Auto Confirm User**.

4. **Configure environment variables**

   Copy the example file and fill in your project values (Supabase → Project
   Settings → API):

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

   Use the **publishable** (anon) key — never the secret / service-role key.

5. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) for the site and
   [http://localhost:3000/admin](http://localhost:3000/admin) for the dashboard.

## Project structure

```
app/
  page.tsx          Landing page
  intake-form.tsx   Multi-step intake form (client component)
  admin/page.tsx    Sign-in + request dashboard
lib/
  services.ts       Services and their per-service questions
  supabase.ts       Supabase browser client
supabase/
  schema.sql        Table + row-level security policies
```
