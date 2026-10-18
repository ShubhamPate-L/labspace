# BMU LabSpace

**Lab Equipment Reservation System** for the School of Engineering & Technology (SOET), BML Munjal University.

Students browse lab equipment, pick a date and time slot, and book it online. Lab admins manage the equipment inventory, review all bookings, and see usage analytics. It replaces paper logbooks and WhatsApp coordination with a single source of truth, so double-bookings stop happening.

- **Course:** CSE 2022, Web Programming
- **Author:** Shubham Patel (Roll No. 230766), solo project
- **Repo:** https://github.com/ShubhamPate-L/labspace

> **For AI agents:** read `AGENTS.md` before changing any code.

---

## What the App Does

**For Students:**
- Sign in / register.
- Browse the equipment grid with live search, category and status filters, and a date picker.
- Select a time slot and confirm a booking through an interactive modal.
- (Planned) View "My Bookings" and lab schedules.

**For Lab Admins:**
- Access the Admin login tab on the main page.
- View overview stats, manage equipment (add, edit, delete), manage bookings (approve, cancel), and monitor usage analytics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Design | Figma (3 frames: login, catalog, booking modal) |
| Frontend | HTML5, CSS3 (modern vanilla, no frameworks), JavaScript ES6+ (vanilla, ES modules, no frameworks) |
| Backend | Node.js (18+ LTS) with CommonJS, Express 4 |
| Templating | EJS |
| Database | MongoDB (Atlas) with Mongoose |
| Auth | `express-session` + `connect-mongo`, passwords hashed with `bcryptjs` |
| Tools | VS Code, Live Server (frontend-only stage), nodemon, Git/GitHub |

---

## File Structure

### Current Frontend Structure
```
bmu-labspace/
├── index.html            login / register / admin login
├── catalog.html          equipment grid
├── booking.html          booking modal page (static)
├── admin-dashboard.html  (to build)
├── css/                  style.css, login.css, catalog.css, modal.css, admin.css, logo.png, bml.png
├── js/                   login.js, catalog.js, admin.js
├── docs/                 documentation
├── package.json
└── README.md
```

### Target Structure (Phase 3 Backend Migration)
```
bmu-labspace/
├── server.js             Express server entry
├── config/               db.js
├── models/               User.js, Lab.js, Equipment.js, Booking.js
├── controllers/          Route logic
├── routes/               Express router definitions
├── middleware/           requireAuth.js, requireAdmin.js
├── seed/                 Database seed script
├── views/                EJS templates (login, catalog, admin) + partials
├── public/               css/, js/, images/ (the current assets move here)
├── docs/
├── package.json
└── README.md
```

---

## Setup Steps

### 1. Frontend-Only (Current Stage)
1. Open the project folder in VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. Sign in with any dummy values (the current login is a fake login that just redirects to `catalog.html`).

### 2. Full Stack (Phase 3)
1. Clone the repo and navigate to the project directory:
   ```powershell
   git clone https://github.com/ShubhamPate-L/labspace.git
   cd labspace
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Create a `.env` file in the root directory (do not commit this):
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_atlas_connection_string
   SESSION_SECRET=a_long_random_string
   ```
4. Seed the database and start the development server:
   ```powershell
   npm run seed   # Loads sample labs, equipment, and an admin account
   npm run dev    # Starts the Express server using nodemon
   ```
5. Open `http://localhost:3000`.

*(Note: `server.js` and the `seed/` folder will be created in Phase 3, so full stack commands won't work before then.)*

---

## Project Roadmap

Based on the project timeline, milestones, and documentation (e.g., `project-charter.md`, `timeline.md`, `responsibility-matrix.md`):

| Phase | Work | Target | Status |
|---|---|---|---|
| I | Requirements & Figma | Aug 18 – Aug 24 | Done |
| II | HTML structure | Aug 25 – Sep 7 | Done |
| III | CSS, responsive, accessibility | Sep 8 – Sep 20 | Done |
| IV | JavaScript: DOM, events, search, slot logic, admin UI | Sep 21 – Oct 18 | In Progress (Refactored login tab switching; Next up: Catalog JS filters & dynamic modal) |
| V | Node.js + Express backend, API routes | Oct 19 – Nov 5 | Planned (Refer to `docs/api-routes.md`) |
| VI | MongoDB, testing, deployment, final docs | Nov 6 – Nov 17 | Planned (Refer to `docs/db-schema.md`) |
