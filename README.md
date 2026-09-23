# Secure Note-Taking Platform - Frontend

A lightweight, high-performance Single Page Application (SPA) built from scratch with **React 18, TypeScript, Vite, and React Router DOM**.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 18 | Declarative component UI library |
| **Language** | TypeScript | Strict compile-time typing across components, hooks, and services |
| **Build Tool & Dev Server**| Vite | Fast hot-module replacement and production bundler |
| **Routing** | React Router DOM v6 | Single page routing, URL synchronization, and route guards |
| **Icons & Styling** | Lucide React + Clean Modern CSS | Accessible SVG icons and responsive CSS without template overhead |
| **State Management** | React Context API (`AuthContext`) | Global authentication state and session lifecycle |

---

## 💻 Step-by-Step Instructions: Clone to Local Run

Follow these steps to clone the repository and run the frontend on your local computer.

### Prerequisites
Ensure you have installed on your computer:
1. **Node.js** (v18.x or v20.x or higher) — [Download Node.js](https://nodejs.org/)
2. **Git** — [Download Git](https://git-scm.com/)

---

### Step 1: Clone the GitHub Repository
Open your terminal (PowerShell, Command Prompt, or Terminal) and run:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd care_guide
```
*(Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your actual repository URL)*

---

### Step 2: Navigate to the Frontend Directory
```bash
cd frontend
```

---

### Step 3: Install Dependencies
```bash
npm install
```

---

### Step 4: Start the Development Server
```bash
npm run dev
```

---

### Step 5: Open in Your Web Browser
Navigate your browser to:
👉 **`http://localhost:5173`**

---

## 🔑 Demo Accounts to Test

The backend seeds initial accounts so you can test all roles immediately:

| Account Type | Email | Password | Access Rights & Features |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@mail.com` | `password` | • Manage personal notes<br>• Switch to **"View All Users' Notes"**<br>• Access **User Management** portal (add, edit, remove users)<br>• Test MongoDB Aggregation pipelines |
| **Standard User** | `user@mail.com` | `password` | • Manage their own notes only<br>• Cannot access admin panels (protected by RBAC guards) |
| **Regular User 2**| `avilash@mail.com` | `password` | • Additional user profile with unique interests (`reading`, `chess`, `travel`) |

---
