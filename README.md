# Qumulo Take-Home Assignment

This project implements a full-stack web application for monitoring and managing storage clusters.  
It includes a **Next.js frontend** and an **AdonisJS backend**, with APIs and UI components for cluster metrics visualization and snapshot policy configuration.

---

## ✨ Features

- **Cluster Dashboard**
  - Time-series charts for **IOPS** and **Throughput** using Recharts.
  - Select different clusters and time ranges.

- **Snapshot Policy Management**
  - Form to edit snapshot schedules, retention, and locking.
  - Integration with backend `GET` / `PUT` APIs.
  - Toast notifications for success/failure feedback.

- **Backend API (AdonisJS)**
  - `GET /api/clusters` → list clusters
  - `GET /api/clusters/:id/metrics` → retrieve IOPS & throughput
  - `GET /api/clusters/:id/snapshot-policy` → get policy
  - `PUT /api/clusters/:id/snapshot-policy` → update policy
  - Data persisted in JSON files under `/data` (simulates DB)

- **Frontend (Next.js + TailwindCSS)**
  - Responsive dark-themed UI (based on provided Figma mockups)
  - `/dashboard` → Metrics visualization
  - `/snapshot` → Snapshot policy editor
  - `/` auto-redirects to `/dashboard`

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS, Recharts, Axios, React Hook Form, Zod, React Hot Toast
- **Backend**: AdonisJS 6, TypeScript, UUID, File-based persistence (`data/*.json`)
- **Tooling**: ESLint, Prettier

---

## 🚀 Getting Started

### 1. Clone repo
```bash
git clone https://github.com/chou5/qumulo-takehome.git
cd qumulo-takehome
```

### 2. Backend setup
```bash
cd qumulo-backend
npm install
npm run dev
```

- Default port: **http://localhost:55552**
- Endpoints are available under `/api/...`
- Sample cluster + metrics data in `/data/*.json`

### 3. Frontend setup
```bash
cd ../qumulo-frontend
npm install
npm run dev
```

- Default port: **http://localhost:3000**
- Root `/` auto-redirects to `/dashboard`

### 4. Environment variables
In `qumulo-frontend/.env.local`:
```env
NEXT_PUBLIC_API_BASE=http://localhost:55552/api
```

---

## 🧪 Testing

- **Backend APIs**
```bash
# List clusters
curl http://localhost:55552/api/clusters

# Get metrics
NOW=$(date +%s); FROM=$((NOW-1800))
curl "http://localhost:55552/api/clusters/<cluster-id>/metrics?from=$FROM&to=$NOW&step=60"

# Update snapshot policy
curl -X PUT http://localhost:55552/api/clusters/<cluster-id>/snapshot-policy   -H "content-type: application/json"   -d '{"enabled":true,"schedule":{"cron":"0 */6 * * *"},"retentionDays":14,"locking":{"enabled":true,"lockUntil":"2026-01-01T00:00:00Z"}}'
```

- **Frontend**
  - Visit `/dashboard` → metrics graphs
  - Visit `/snapshot` → edit snapshot policy

---

## 📂 Project Structure

```
qumulo-takehome/
├── README.md    # project instructions
├── qumulo-backend/       # AdonisJS API
│   ├── app/controllers/  # Clusters + Policies controllers
│   ├── data/             # clusters.json, metrics.json, policies.json
│   └── start/routes.ts   # API endpoints
│
└── qumulo-frontend/      # Next.js UI
    ├── app/(dash)/       # Dashboard + Snapshot routes
    ├── components/       # UI components (charts, forms, selectors)
    ├── lib/              # api.ts (axios client), types.ts
    └── globals.css       # Tailwind config
```

---

## 📖 Design Decisions

- **File-based persistence** → simple, transparent, easily swappable with a DB
- **Next.js App Router** → demonstrates modern React with SSR/CSR hybrid
- **Recharts** → clean declarative time-series visualization
- **React Hook Form + Zod** → structured form handling & validation
- **Toast notifications** → better UX for saving policies

---

## ✅ Future Improvements

- Replace JSON persistence with SQLite or Postgres
- Add authentication / multi-user support
- Simulate live/randomized metric streams
- Add unit + e2e tests (Jest, Playwright)

---

## 👩‍💻 Author

Sherry Chou
