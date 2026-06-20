<div align="center">

<!-- Brighte Eats logo -->
<div style="display:inline-flex; align-items:center; gap:13px;">
  <svg width="54" height="54" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="bTile" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#17B3A6"/>
        <stop offset="1" stop-color="#0C6F7E"/>
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="52" height="52" rx="16" fill="url(#bTile)"/>
    <path d="M24 15 V49" stroke="#fff" stroke-width="5.5" stroke-linecap="round"/>
    <circle cx="35" cy="37" r="10" fill="none" stroke="#fff" stroke-width="5.5"/>
    <path d="M45 13 l-4.5 8 h5.5 l-4.5 8" stroke="#FFD23F" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <div style="font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:29px; letter-spacing:-0.025em; color:#0C6F7E;">Brighte Eats</div>
</div>

**Lead collection API + React frontend**  
*Take-home exercise — Junior Developer (AI focus)*

</div>

---

## How to run

### Prerequisites
- **Node.js** v18+ (tested on v22)
- **npm** (comes with Node)

### Setup

```bash
# 1. Clone the repo
git clone git@github.com:kaushikc44/Brighte-eats.git
cd Brighte-eats

# 2. Install all dependencies (workspaces)
npm install

# 3. Set up your Gemini API key (for AI summaries)
cp packages/backend/.env.example packages/backend/.env
# Edit packages/backend/.env and paste your key from https://aistudio.google.com/apikey
# (Without a key, AI summaries fall back to a basic message — the app still works)

# 4. Start the backend
npm run -w packages/backend dev

# 5. In a separate terminal, start the frontend
npm run -w packages/frontend dev
```

### Run tests

```bash
npm run -w packages/backend test
```

### Open the app
- **Registration form**: http://localhost:5173/
- **Leads list**: http://localhost:5173/leads
- **API**: http://localhost:3003

---

## What I built

A **lead collection system** for Brighte's new product concept, Brighte Eats. Customers can register interest in one or more services (delivery, pick-up, payment), and staff can view and filter those leads.

### Backend (Express + TypeScript + SQLite)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/leads` | Create a new lead |
| `GET`  | `/leads` | List all leads (optional `?service=` filter) |
| `GET`  | `/leads/:id` | Get a single lead |
| `PUT`  | `/leads/:id` | Update a lead |
| `DELETE` | `/leads/:id` | Delete a lead |
| `POST` | `/leads/:id/summary` | AI-generated summary of a lead's interests (Gemini) |

### Frontend (React + TypeScript + Vite)
- **Submit page** (`/`): Registration form with field-level validation (Zod), loading state, and success/error feedback
- **Leads page** (`/leads`): List of all leads with a filter dropdown by service type, empty state, and an AI summary button per lead

### Shared package
A shared Zod schema (`@brighte/shared`) used by both backend and frontend, ensuring consistent validation on both sides without duplication.

---

## Why I chose SQLite

**SQLite** (via Node's built-in `node:sqlite` since Node 20.1):
- **No extra packages** — `node:sqlite` comes with Node, zero npm dependencies for the database layer.
- **Zero setup** — no daemon, no Docker, no connection config. Clone and run.
- **File-based** — the entire database is a single `leads.db` file. Easy to inspect, reset, or seed, which makes testing straightforward.
- **Good enough** — for a lead collection tool with a handful of entries, SQLite handles concurrency just fine.

**What I'd use in production**: **Supabase** (cloud-hosted PostgreSQL). Beyond what regular Postgres offers (better concurrency, role-based access, replication), Supabase provides built-in **vector database support** via `pgvector`. As we add AI features (like smarter lead matching or semantic search), having embeddings stored alongside relational data keeps everything in one place — no need for a separate vector database. Managed service means the team doesn't maintain a database server.

---

## Validation strategy

**Both client and server**, sharing the same Zod schema from `@brighte/shared`.

| Layer | What happens |
|-------|-------------|
| **Client (React)** | `UserSchema.safeParse(formData)` on submit — catches typos and empty fields instantly, shows inline error messages. |
| **Server (Express)** | `UserSchema.safeParse(req.body)` on every POST/PUT — rejects invalid data before it touches the database. This is the safety net, even if the client is bypassed (curl, Postman, script). |

**What's validated**: `name`, `email`, `mobile`, `postcode` are required strings. `service` is required and must be an array containing only `"delivery"`, `"pick-up"`, or `"payment"`.

---

## What I'd change or add with more time

1. **Persistent Auth** — add JWT-based authentication so only authorised Brighte staff can view/edit leads.
2. **Pagination** — for the leads list, especially at scale. Cursor-based pagination is more robust than offset for real-time data.
3. **Use Next.js instead of Vite** — Next.js gives you built-in API routes (no separate backend server), file-based routing, and middleware for auth and request validation. Would simplify the project structure into a single app.
4. **CI/CD** — a GitHub Actions workflow that runs tests on every push.

---

## TODOs / known gaps

- **Gemini API key required** for AI summaries to work. Without it, it falls back to a plain-text summary (the app never breaks).
- **No pagination** — the leads list loads everything at once. Fine for current scale, but needs pagination for 1000+ leads.
- **No authentication** — anyone can access the API endpoints. Should add auth before production.
- **Port conflicts** — the backend uses port 3003 because 3001 and 3002 were taken by other services on my machine.

---

## AI Assistance

AI helped me in putting boilerplate code like SQL client initialization, CSS styles, and shared schema setup. It also helped me fix errors with:

- **Port conflicts between services** — diagnosed and resolved contention on 3001/3002.
- **Claude Design** helped me design the architecture in a visual diagram before I started coding.
- **Finding predefined methods** (like Zod's `.email()` and `.safeParse()`) that make readability easier than writing paragraphs of validation logic from scratch.

---

<div align="center">
  <sub>Built with ❤️ for the Brighte take-home exercise</sub>
</div>
