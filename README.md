# 🛡️ Moderator — Trust, Safety & Content Moderation Console

> **A real-time community moderation, trust & safety, and automated content audit console built with React 18, Vite, Tailwind CSS, TanStack Query, and Express.**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F.svg)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Overview

**Moderator** provides community managers, platform administrators, and trust & safety teams with an intuitive workbench to govern user-generated content (UGC). It features incoming post review queues, risk-scoring signals, user standing / penalty tracking, and live audit telemetry to ensure digital communities remain healthy and compliant.

---

## ✨ Features

- **📊 Live Activity Telemetry**: Instant overview of total active accounts, pending review queues, flagged posts, and average resolution times.
- **📝 Post Inspection Queue**: Review flagged content with one-click actions: approve, flag for human escalations, quarantine, or permanent removal.
- **👤 User Standing Governance**: Track user strike counts, issue warnings, manage suspensions, and inspect past user violation history.
- **⚡ Optimistic UI Updates**: Rapid keyboard-friendly review workflow powered by TanStack Query cache updates.
- **📱 Responsive Management Layout**: Clean sidebar navigation and mobile-responsive drawers for on-the-go community moderation.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Radix UI Primitives, Lucide Icons, Wouter routing
- **State & Data**: TanStack Query (React Query)
- **Backend**: Node.js, Express.js
- **Database & ORM**: PostgreSQL, Drizzle ORM
- **Deployment**: Vercel ready

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

### 1. Clone the Repository
```bash
git clone https://github.com/Rithish-2914/Moderator.git
cd Moderator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configure your database connection:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/moderator_db
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## 📂 Project Structure

```
Moderator/
├── client/
│   ├── src/
│   │   ├── components/    # StatsCard, PostCard, UserTable, Navigation
│   │   ├── pages/         # Dashboard, Posts Queue, Users Directory
│   │   └── App.tsx        # Application routes
├── server/
│   ├── index.ts           # Express server setup
│   ├── routes.ts          # Moderation REST API endpoints
│   └── storage.ts         # Storage interface and in-memory/DB handlers
├── shared/
│   └── schema.ts          # Drizzle ORM schema and validation types
├── .env.example           # Environment template
├── LICENSE                # MIT License
└── README.md              # Project documentation
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
