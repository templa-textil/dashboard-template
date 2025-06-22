# 📊 Dashboard App

A modern full-stack dashboard web application built with **Next.js (App Router)**, **Prisma**, **PostgreSQL**, **Tailwind CSS**, and **React Query**. It includes authentication, role-based access control, product/template/invoice management, and real-time dashboard statistics.

---

## 🧰 Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** + `tailwindcss-animate`
- **Prisma ORM** with **PostgreSQL**
- **NextAuth.js** with Prisma Adapter
- **React Query** for data fetching and caching
- **Radix UI** + shadcn/ui components
- **Lucide React** for icons
- **Day.js / date-fns** for date formatting

---

## 📁 Project Structure

- `app/` – Route handlers and UI pages (`api`, `auth`, `dashboard`, etc.)
- `components/` – Reusable UI and feature components
- `hooks/` – Custom React hooks
- `lib/` – Utility functions and config helpers
- `prisma/` – Database schema
- `scripts/` – Seed scripts
- `types/` – TypeScript type definitions

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

Create a `.env.local` file with the following values:

`DATABASE_URL=`postgres://USER:PASSWORD@HOST:PORT/DATABASE  
`NEXTAUTH_SECRET`=your_secret_key  
`GOOGLE_CLIENT_ID`=your_google_client_id  
`GOOGLE_CLIENT_SECRET`=your_google_client_secret

### 3. Prisma setup

`npm run db:push` # Push schema to the database  
`npm run db:generate` # Generate Prisma client  
`npm run db:studio` # Open Prisma Studio  
`npx tsx scripts/seed.ts` # Seed sample data (optional)

### 4. Start development server

```bash
npm run dev
```

---

## 🔐 Authentication

- Built with `NextAuth.js` and `Google OAuth`
- Uses `@next-auth/prisma-adapter` for session handling and user management
- Supports role-based access: ADMIN and USER
- Guards implemented via:
  - auth-guard.tsx – protects routes for authenticated users
  - admin-guard.tsx – restricts access to admin-only pages

---

## ✅ Features

- 🔐 **Secure login with Google**
- 💼 **Role-based access control**
- 🧾 **CRUD for products and templates**
- 💵 **Invoice and facturation management**
- 📈 **Real-time dashboard stats and recent activity**
- 🌓 **Dark mode support**
- 📱 **Fully responsive design**
- ⚙️ **Clean, modular architecture**
- 🧪 **Written in TypeScript**

---

## 📜 Scripts

`npm run dev` # Start development server  
`npm run build` # Build for production  
`npm run start` # Start production server  
`npm run lint` # Run ESLint  
`npm run db:push` # Push Prisma schema to DB  
`npm run db:pull` # Pull schema from DB  
`npm run db:generate` # Generate Prisma client  
`npm run db:studio` # Open Prisma Studio
