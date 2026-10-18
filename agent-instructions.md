# Agent Instructions: BMU LabSpace

Rules for any AI agent (Claude Code, Cursor, Copilot, etc.) working in this repo. Read `README.md` first.

## 1. Context
- College project for **CSE 2022 Web Programming**. The student must be able to **explain every line** in a viva. Prefer simple, readable code over clever code.
- Solo student project: Shubham Patel. Windows + VS Code + PowerShell.
- Marks are given for: JS syntax, DOM manipulation, event handling, HTML/CSS/JS integration (Phase 2); Node/Express setup, frontend-backend data flow, template engines and static files, Mongoose operations, innovation and usability (Phase 3).

## 2. How to work
- Make **small, targeted changes**. Do not rewrite whole files unless asked.
- Before a large feature (new page, new dependency, new folder), say what you plan to do and wait for a yes.
- Explain briefly what each change does and why.
- If something is unclear, ask. If a file is not visible to you, ask for it instead of guessing its contents.
- Do not change the existing visual design (colors, layout, glass cards, animations) unless asked.
- Do not add files outside the structure in `README.md`.

## 3. Frontend rules

### HTML
- Semantic tags (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`).
- Accessibility is graded: every input has a `<label>`; images have meaningful `alt`; tabs use `role="tablist" / "tab" / "tabpanel"` with `aria-selected` and `aria-controls`; the modal uses `role="dialog"` and `aria-modal="true"`; all interactive elements work with the keyboard and show a visible focus state.
- No inline `onclick="..."` attributes. Attach behavior from JS files.

### CSS
- **Vanilla CSS only.** No Tailwind, Bootstrap, Sass, or CSS-in-JS.
- Use the CSS variables defined in `css/style.css` (`--color-primary`, `--color-accent`, `--color-success`, `--color-danger`, `--color-text`, `--color-muted`, `--color-border`, `--color-bg`, `--radius`). Do not hardcode brand colors if a variable exists.
- Shared styles go in `style.css`; page-specific styles go in that page's file (`login.css`, `catalog.css`, `modal.css`, `admin.css`).
- Layout with Flexbox and Grid. Keep pages responsive (320px to 1920px).
- **No CSS "tricks" for behavior** (radio/checkbox hacks, `:target` hacks). State changes are done in JS by toggling classes like `.active`, `.selected`, `.hidden`.
- BMU palette: blue `#0284c7`, red `#dc2626` (accent `#dc2650`), yellow `#f59e0b`, green `#16a34a`.
- Admin pages use a darker slate theme, kept in `admin.css` so it never leaks into student pages.

### JavaScript (browser)
- **Vanilla ES6+.** No jQuery, React, Vue, or other frameworks.
- `const` by default, `let` when reassigning, never `var`.
- Select with `querySelector` / `querySelectorAll` / `getElementById`; attach events with `addEventListener`; change UI with `classList`, `textContent`, `setAttribute`, `createElement`.
- Use `fetch` with `async/await` and `try/catch` for API calls. Never leave a `fetch` without error handling.
- One JS file per page: `login.js`, `catalog.js`, `admin.js` (a separate `booking.js` is allowed for the booking modal). Load with `<script src="..." defer></script>` before `</body>`.
- Wrap page setup in `DOMContentLoaded`.
- Keep functions small and named by what they do (`filterEquipment`, `openBookingModal`, `renderBookingsTable`).
- Short comments explaining the *why*, not the obvious *what*.
- Before the backend exists, keep data in plain JS arrays/objects at the top of the file so it is easy to swap for `fetch` calls later. Do not use `localStorage` unless asked.
- Never build HTML from user input with `innerHTML` unescaped. Prefer `textContent` or `createElement`.

## 4. Backend rules (Phase 3)
- **Node.js with CommonJS** (`require` / `module.exports`). Do not mix in ES modules or TypeScript.
- **Express 4**, **EJS** for templates, **Mongoose** for MongoDB. Static files served from `public/`.
- **MVC structure:** `models/`, `controllers/`, `routes/`, `views/`, plus `middleware/` and `config/`. Routes only map URLs to controllers; controllers hold logic; models hold schemas.
- Use `async/await` with `try/catch` in controllers. Never crash the server on a bad request.
- Config via `.env` with `dotenv`. Never hardcode or commit secrets. `.env` must be in `.gitignore`.
- Hash passwords with `bcryptjs`. Never return `passwordHash` in any response.
- Sessions with `express-session` + `connect-mongo`. Protect student routes with `requireAuth`, admin routes with `requireAdmin`. Check roles on the **server**, never trust the client.
- Validate all input on the server (required fields, formats, allowed enum values, valid dates). Return proper HTTP status codes.
- All API responses follow the format in `docs/api-routes.md`.

## 5. Allowed dependencies
`express`, `mongoose`, `ejs`, `dotenv`, `bcryptjs`, `express-session`, `connect-mongo` (runtime) and `nodemon` (dev). **Ask before adding anything else.** Not allowed: frontend frameworks, CSS frameworks, ORMs other than Mongoose, TypeScript.

## 6. Naming and style
- Files: `camelCase.js` for JS, `kebab-case.html/css`, Models in `PascalCase.js` (`Booking.js`).
- Variables/functions: `camelCase`. Constants: `UPPER_SNAKE_CASE`. CSS classes: `kebab-case`.
- 2-space indentation, semicolons, single quotes in JS, double quotes in HTML.
- Time slots are always one of: `09:00-10:30`, `10:30-12:00`, `13:00-14:30`, `14:30-16:00` (display as `09:00 - 10:30`). Dates are stored and sent as `YYYY-MM-DD`.

## 7. Git
- Small commits with clear messages, for example `Add live search to catalog`.
- Never commit `.env` or `node_modules/`.

## 8. Do not
- Do not invent features, pages, or fields that are not in the docs without asking.
- Do not silently change API shapes or schema fields; update the docs in the same change.
- Do not remove accessibility attributes to "simplify" code.
- Do not copy large unexplained code blocks. If it is complex, simplify it or explain it.
