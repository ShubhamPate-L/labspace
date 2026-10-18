# Agent Instructions: BMU LabSpace

Rules and guidelines for any AI agent (Claude Code, Cursor, Copilot, etc.) working in this repo. Read `README.md` first.

## 1. Context and Project Overview
- College project for **CSE 2022 Web Programming** (Solo project: Shubham Patel).
- **Lab Equipment Reservation System** for the School of Engineering & Technology (SOET), BML Munjal University.
- Replaces paper logbooks and WhatsApp coordination with an online, single source of truth to avoid double-bookings.
- Prefer simple, readable code over clever code, as the student must be able to explain every line.

## 2. How to work
- Make **small, targeted changes**. Do not rewrite whole files unless asked.
- Before a large feature, say what you plan to do and wait for a yes.
- Explain briefly what each change does and why.
- Do not change the existing visual design (colors, layout, glass cards, animations) unless asked.
- Do not add files outside the standard structure.

## 3. Coding Conventions

### HTML
- Semantic tags (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`).
- Follow strict accessibility guidelines: every input needs a `<label>`; images must have meaningful `alt` text; tabs use `role="tablist"` / `"tab"` / `"tabpanel"` with `aria-selected` and `aria-controls`; modals use `role="dialog"` and `aria-modal="true"`.
- No inline `onclick="..."` attributes. Attach behavior from JS files.

### CSS
- **Modern Vanilla CSS only.** No Tailwind, Bootstrap, Sass, or CSS-in-JS.
- Use the CSS variables defined in `css/style.css`. Do not hardcode brand colors.
- Page-specific styles go in that page's file (`login.css`, `catalog.css`, etc.).
- Layout with Flexbox and Grid. Keep pages responsive.
- **No CSS "tricks" for behavior.** Use JS to toggle classes like `.active`, `.hidden`.

### JavaScript
- **Vanilla ES6+ (ES Modules).** No jQuery, React, Vue.
- Use `const` by default, `let` when reassigning.
- Use `fetch` with `async/await` and `try/catch` for API calls. Never leave a `fetch` without error handling.
- One JS file per page. Wrap page setup in `DOMContentLoaded`.
- Keep functions small and descriptive. Do not use `localStorage` unless asked.
- Never build HTML from user input with `innerHTML` unescaped. Prefer `textContent` or `createElement`.

## 4. Directory Architecture

**Current Frontend Setup:**
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

**Target Backend Integration Setup (Phase 3):**
```
bmu-labspace/
├── server.js             Express server entry
├── config/               db.js
├── models/               Mongoose models (User, Lab, Equipment, Booking)
├── controllers/          Route logic
├── routes/               Express router definitions
├── middleware/           requireAuth.js, requireAdmin.js
├── seed/                 Database seed script
├── views/                EJS templates (login, catalog, admin) + partials
├── public/               css/, js/, images/ (frontend assets move here)
├── docs/
├── package.json
└── README.md
```

## 5. Database and API Design Guidelines

### Database Schema Rules (`models/`)
- MongoDB (Atlas) via Mongoose.
- Collections: `users`, `labs`, `equipment`, `bookings`.
- Shared constants:
  - `SLOTS` (['09:00-10:30', '10:30-12:00', '13:00-14:30', '14:30-16:00'])
  - `WINGS` (['SOET Wing', 'MakerSpace', 'Robotics', 'IoT Lab'])
- A booking links one user to one equipment item for one date and one time slot. Slot availability is computed dynamically (not stored).
- Double-booking protection uses a unique compound index on `(equipment, date, slot)` that only applies to `isActive: true` bookings.

### Backend API Guidelines (`routes/` & `controllers/`)
- Node.js with CommonJS (`require` / `module.exports`).
- Base URL: `/api`. Requests and responses use JSON.
- Response formats:
  - Success: `{ "success": true, "data": { ... }, "message": "..." }`
  - Error: `{ "success": false, "message": "...", "errors": { ... } }`
- Validate all input server-side. Do not crash the server on a bad request.
- Auth: Cookie sessions via `express-session` + `connect-mongo`. Hash passwords with `bcryptjs`. Protect endpoints with `requireAuth` and `requireAdmin` middleware.

## 6. Commands for Setup/Testing

**Frontend Only (Current State):**
- Open the project folder in VS Code.
- Use **Live Server** extension on `index.html`.

**Full Stack (Phase 3):**
1. `npm install`
2. Create `.env` (PORT, MONGODB_URI, SESSION_SECRET).
3. `npm run seed` (loads sample labs, equipment, and admin).
4. `npm run dev` (starts Express server using nodemon).

Do not commit `.env` or `node_modules/`. Keep commits small and descriptive.