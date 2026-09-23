# Secure Note-Taking Application - Frontend

Client-side application built with **React 18, TypeScript, Vite, and React Router**.

---

## 🛠️ Features & Architecture

- **React Router (`react-router-dom`):**
  - Dedicated `src/routes/paths.ts` holding all route constants.
  - Route guards (`ProtectedRoute`) protecting administrative and authenticated views.
- **Role-Based Access Control (RBAC):**
  - Standard users: Can view, create, edit, and delete their own notes.
  - Admins: Toggle to view everyone's notes + access User Management portal.
- **Server-Side Pagination UI:**
  - Dynamic page size selector (`5`, `10`, `20`, `50`) and page navigation with zero lag.
- **Aggregation Views:**
  - **Scenario 1 View:** Visualizes users grouped by interests.
  - **Scenario 2 View:** Query user posts retrieved via `$lookup` pipeline.
- **Centralized API Client (`src/services/api.ts`):**
  - Injects `Authorization: Bearer <token>` automatically.
  - Dispatches global `401 Unauthorized` session cleanup.

---

## 📂 Project Structure

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── routes/
    │   ├── paths.ts            # Route URL constants
    │   └── AppRoutes.tsx       # Route definitions and guards
    ├── types/                  # Strict TypeScript type definitions
    ├── services/               # API service layer (auth, note, user, aggregation)
    ├── context/                # AuthContext (session, token persistence)
    ├── components/             # Reusable UI (Navbar, Pagination, Modal, Alert, ProtectedRoute)
    └── pages/                  # LoginPage, RegisterPage, NotesPage, AdminUsersPage, AggregationsPage
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

*(Requests to `/api` are automatically proxied to the backend at `http://localhost:5000` via `vite.config.ts`).*

### 3. Build for Production
```bash
npm run build
```
Generates production-ready, minified static files in `dist/`.
