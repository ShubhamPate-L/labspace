# BMU LabSpace

**Lab Equipment Reservation System** for the School of Engineering & Technology (SOET), BML Munjal University.

Students browse lab equipment, pick a date and time slot, and book it online. Lab admins manage the equipment inventory, review all bookings, and see usage analytics. It replaces paper logbooks and WhatsApp coordination with a single source of truth, so double-bookings stop happening.

- **Course:** CSE 2022, Web Programming
- **Author:** Shubham Patel (Roll No. 230766), solo project
- **Repo:** https://github.com/ShubhamPate-L/labspace

> **For AI agents:** read this file first, then `docs/agent-instructions.md` (rules), `docs/db-schema.md` (data), and `docs/api-routes.md` (backend contract) before changing any code.

---

## Tech stack

| Layer | Technology |
|---|---|
| Design | Figma (3 frames: login, catalog, booking modal) |
| Frontend | HTML5, CSS3 (vanilla, no frameworks), JavaScript ES6+ (vanilla, no frameworks) |
| Backend | Node.js (18+ LTS), Express 4 |
| Templating | EJS |
| Database | MongoDB (Atlas) with Mongoose |
| Auth | `express-session` + `connect-mongo`, passwords hashed with `bcryptjs` |
| Tools | VS Code, Live Server (frontend-only stage), nodemon, Git/GitHub |

---

## Current state (October 2026)

| Area | Status |
|---|---|
| Figma design | Done |
| Project charter | Done |
| Phase 1 (static HTML/CSS: login, catalog, booking modal) | Done and submitted |
| Login page JS (tab switching: Sign In / Register / Admin) | Refactored to real JS, verify in browser |
| Catalog JS (slot selection, live search, date and category filters) | **Next up** |
| Dynamic booking modal (single modal filled by JS) | Not started |
| Admin dashboard (equipment, bookings, analytics) | Planned, not started |
| Express server, EJS views, MongoDB integration | Not started (Phase 3) |

Until Phase 3, all data is hardcoded in HTML or kept in in-memory JS arrays. Login is a **fake login** (any non-empty values work) that just redirects.

---

## Features

**Student**
- Sign in / register
- Browse equipment grid with live search, category and status filters, date picker
- Select a time slot and confirm a booking in a modal
- (Planned) My Bookings, Lab Schedule

**Admin**
- Admin login tab on the same login page
- Overview stats, equipment management (add, edit, delete), bookings management (approve, cancel), usage analytics

---

## Getting started

### Now (frontend only)
1. Open the project folder in VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. Sign in with any values. You land on `catalog.html`.

### Later (full stack, Phase 3)
```powershell
git clone https://github.com/ShubhamPate-L/labspace.git
cd labspace
npm install
```
Create a `.env` file in the root (never commit it):
```
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=a_long_random_string
```
Then:
```powershell
npm run seed   # loads sample labs, equipment and an admin account (planned)
npm run dev    # starts the server with nodemon
```
Open http://localhost:3000

> `server.js` and the `seed/` folder are created in Phase 3, so `npm start` / `npm run dev` will not work yet.

---

## Project structure

### Current
```
bmu-labspace/
├── index.html            login / register / admin login
├── catalog.html          equipment grid
├── booking.html          booking modal page (static)
├── admin-dashboard.html  (to build)
├── css/                  style.css, login.css, catalog.css, modal.css, admin.css, logo.png, bml.png
├── js/                   login.js, catalog.js, admin.js
├── docs/                 documentation (see below)
├── package.json
└── README.md
```

### Target (after Phase 3 migration)
```
bmu-labspace/
├── server.js
├── config/db.js
├── models/               User.js, Lab.js, Equipment.js, Booking.js
├── controllers/          authController.js, equipmentController.js, bookingController.js, adminController.js
├── routes/               authRoutes.js, equipmentRoutes.js, bookingRoutes.js, adminRoutes.js
├── middleware/           requireAuth.js, requireAdmin.js
├── seed/seed.js
├── views/                EJS templates (login, catalog, admin) + partials (header, footer)
├── public/               css/, js/, images/   (the current css/ and js/ move here)
├── docs/
├── package.json
└── README.md
```

---

## Documentation

| File | Purpose |
|---|---|
| `docs/agent-instructions.md` | Coding standards and architectural rules for AI agents |
| `docs/db-schema.md` | MongoDB collections, fields, relationships, seed data |
| `docs/api-routes.md` | Backend API contract (requests and responses) |
| `docs/project-charter.md`, `timeline.md`, `responsibility-matrix.md` | Course submissions |

---

## Roadmap

| Phase | Work | Target |
|---|---|---|
| I | Requirements and Figma | Aug 18 – Aug 24 (done) |
| II | HTML structure | Aug 25 – Sep 7 (done) |
| III | CSS, responsive, accessibility | Sep 8 – Sep 20 (done) |
| IV | JavaScript: DOM, events, search, slot logic, admin UI | Sep 21 – Oct 18 (in progress) |
| V | Node.js + Express backend, API routes | Oct 19 – Nov 5 |
| VI | MongoDB, testing, deployment, final docs | Nov 6 – Nov 17 |
