# Secure Note-Taking Application - Frontend

A lightweight, high-performance Single Page Application (SPA) built from scratch with **React 18, TypeScript, Vite, and React Router DOM**.

---

## 📖 About the Frontend

### What Does This Frontend Do?
The frontend provides a fast, responsive user interface designed specifically around functionality, integration, and security:
1. **Zero Template Bloat:** Built without third-party heavy template kits, adhering strictly to the *"DO NOT USE ANY TEMPLATES"* interview constraint.
2. **Centralized Routing & Protected Routes (`src/routes/`):**
   - All URL endpoints are maintained as immutable constants in `src/routes/paths.ts`.
   - Route guards (`ProtectedRoute`) prevent unauthorized access to authenticated pages and enforce the `admin` role for administrative features.
3. **Session Management (`AuthContext`):**
   - Persists JWT tokens in client storage and injects `Authorization: Bearer <token>` into all API requests via a centralized HTTP client (`src/services/api.ts`).
   - Automatically handles 401 Unauthorized responses to clear expired credentials and redirect to login.
4. **Notes Management View (`/notes`):**
   - Paginated list of notes.
   - Includes an exclusive Admin toggle switch to flip between **"My Notes"** and **"View All Users' Notes"**.
   - Create, edit, and delete notes with modal forms and validation alerts.
5. **Admin User Management Portal (`/admin/users`):**
   - Admin-only view to list all registered users with pagination.
   - Add new users, edit existing user roles and interest tags, or delete users.
6. **MongoDB Aggregation Explorer (`/aggregations`):**
   - **Scenario 1 View:** Visualizes users grouped by interests (e.g. *chess*, *reading*, *gaming*).
   - **Scenario 2 View:** Allows entering a User ID to inspect their joined posts retrieved via the `$lookup` aggregation pipeline, with an inline post creation form.
7. **Server-Side Pagination Controls:**
   - Universal pagination bar with configurable limits (`5`, `10`, `20`, `50`), page indicators, and previous/next buttons to handle high data volumes without browser lag.

---

## 🛠️ Tech Stack
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM v6
- **Icons & Styling:** Lucide React, Clean Responsive CSS (no heavy framework overhead)
- **State Management:** React Context API

---

## 💻 Step-by-Step Instructions: Clone to Local Run

### Step 1: Open Terminal in the Frontend Directory
```bash
cd care_guide/frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open in Web Browser
Navigate your browser to:
👉 **`http://localhost:5173`**

*(Note: API requests to `/api` are automatically proxied to the backend at `http://localhost:5000` via `vite.config.ts`).*

---

## 🔑 Demo Accounts to Test

- **Admin Account:** `admin@mail.com` | `password`
- **User Account:** `user@mail.com` | `password`
