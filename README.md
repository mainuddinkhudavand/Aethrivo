# Aethrivo Platform

Aethrivo is a full-stack intellectual property (IP), research, and institutional innovation ecosystem. It provides public portals for masterclasses, international symposiums, verified technical & legal expert consultation, membership registration, and multi-tier administrative workflows (Admin & Manager Portals).

---

## 🌟 Key Features

### 🏛️ Public Experience
- **Hero & Innovation Hub**: Space-grade reactive hero showcasing patent prosecution, AI engineering, institutional MoUs, and verified expert directory.
- **Masterclasses & Courses**: Explore executive courses with curriculum previews, duration, fee schedules, certification tracks, and 1-click enrollment.
- **Flagship Events**: Conferences, symposiums, hackathons, and workshops with online registration.
- **Expert Directory**: Browse, filter, and connect directly with patent attorneys, AI researchers, and valuation specialists.
- **Membership Registration**: 4-step membership application (Students, Faculty, Industry, Research Scholars, Experts, Institutions) with automated sequential member ID generation (e.g., `AET-STU-001001`).
- **Institutional Verticals**: Dedicated vertical portfolios (IP Strategy, AI & Emerging Tech, Life Sciences, Energy Transition, Defense & Aerospace).

### 🛡️ Portals & Role-Based Access
- **Admin Portal**:
  - Executive analytics & KPI tracking.
  - Member management & verification status updates.
  - Client enquiries pipeline with stage progression.
  - Task delegation & manager progress tracking.
  - Masterclasses & event management.
  - **Expert Management**: Full verification, status reviews, and profile editing.
  - Institutional MoU lifecycle tracker.
  - Audit logging of all critical actions.
- **Manager Portal**:
  - Assigned inquiries triage, stage updates, and progress notes.
  - Assigned task management with progress updates.
  - Direct member review.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, TanStack React Query, Lucide React, Recharts, React Router v6.
- **Backend**: Node.js, Express.js, Mongoose, JWT authentication, Multer file upload handling.
- **Database**: MongoDB (Atlas cloud connection with automatic in-memory fallback for local development resilience).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/mainuddinkhudavand/Aethrivo.git
cd Aethrivo
```

Install root, client, and server dependencies:
```bash
npm run install-all
```
*(Or navigate to `/client` and `/server` and run `npm install` in each)*

### 3. Environment Configuration

Check `client/.env.example` and `server/.env.example`.

**Client Environment (`client/.env`)**:
```env
VITE_ADMIN_EMAIL=admin@aethrivo.com
VITE_ADMIN_PASSWORD=Admin@123
VITE_MANAGER_EMAIL=manager@aethrivo.com
VITE_MANAGER_PASSWORD=Manager@123
```

**Server Environment (`server/.env`)**:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@aethrivo.com
ADMIN_PASSWORD=Admin@123
MANAGER_EMAIL=manager@aethrivo.com
MANAGER_PASSWORD=Manager@123
CLIENT_URL=http://localhost:5173
```

### 4. Running Locally

Run both backend and frontend concurrently from the root:
```bash
npm run dev
```

Or run them individually:
* **Server**: `cd server && npm run dev` (Runs on `http://localhost:5000`)
* **Client**: `cd client && npm run dev` (Runs on `http://localhost:5173`)

---

## 🔐 Default Credentials

| Portal | Role | Email | Password |
|---|---|---|---|
| Admin Portal | Admin | `admin@aethrivo.com` | `Admin@123` |
| Manager Portal | Manager | `manager@aethrivo.com` | `Manager@123` |

---

## 📄 License
&copy; 2026 Aethrivo. All rights reserved.
