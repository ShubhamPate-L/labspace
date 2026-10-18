# API Routes: BMU LabSpace

Backend contract between the frontend JS files (`login.js`, `catalog.js`, `booking.js`, `admin.js`) and the Express server. Data shapes come from `docs/db-schema.md`.

- Base URL: `/api` (same origin, e.g. `http://localhost:3000/api`)
- Format: JSON in, JSON out. Send `Content-Type: application/json` on requests with a body.
- Auth: cookie session set at login. Same-origin `fetch` sends the cookie automatically.
- Dates: `YYYY-MM-DD`. Slots: `09:00-10:30`, `10:30-12:00`, `13:00-14:30`, `14:30-16:00`.

## Response format

Success:
```json
{ "success": true, "data": { }, "message": "Optional human-readable text" }
```
Error:
```json
{ "success": false, "message": "What went wrong", "errors": { "field": "optional detail" } }
```

| Status | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Validation error / bad input |
| 401 | Not logged in |
| 403 | Logged in but not allowed (e.g. student calling an admin route) |
| 404 | Not found |
| 409 | Conflict (slot already booked, duplicate roll number/email/equipment ID) |
| 500 | Server error |

Access levels: **Public**, **Student** (logged in), **Admin** (role `admin`).

---

## Auth

### `POST /api/auth/register`: Public
Request:
```json
{ "name": "Shubham Patel", "rollNumber": "230766", "email": "shubham@bmu.edu.in", "password": "secret123" }
```
Response `201`:
```json
{ "success": true, "data": { "_id": "...", "name": "Shubham Patel", "rollNumber": "230766", "email": "shubham@bmu.edu.in", "role": "student" } }
```
Errors: `400` missing/invalid fields, `409` roll number or email already registered.

### `POST /api/auth/login`: Public
`identifier` is roll number or email (students) or admin email/ID (admins). `role` says which login tab was used; the server rejects the login if the account's real role does not match.
```json
{ "identifier": "230766", "password": "secret123", "role": "student" }
```
Response `200`:
```json
{ "success": true, "data": { "_id": "...", "name": "Shubham Patel", "role": "student" }, "message": "Logged in" }
```
Errors: `400` missing fields, `401` wrong credentials or role mismatch.

### `POST /api/auth/logout`: Student/Admin
Response `200`: `{ "success": true, "message": "Logged out" }`

### `GET /api/auth/me`: Student/Admin
Returns the logged-in user (used for the roll number badge in the header).
Response `200`: `{ "success": true, "data": { "_id": "...", "name": "...", "rollNumber": "230766", "role": "student" } }`
Error: `401` if not logged in.

---

## Labs and equipment

### `GET /api/labs`: Student/Admin
Response `200`: `{ "success": true, "data": [ { "_id": "...", "name": "Lab 102", "wing": "SOET Wing" } ] }`

### `GET /api/equipment`: Student/Admin
Catalog list with slot availability for a date.

Query params (all optional):

| Param | Example | Meaning |
|---|---|---|
| `date` | `2026-11-05` | Date to compute slot availability for (default: today) |
| `search` | `oscillo` | Matches name or equipmentId (case-insensitive) |
| `wing` | `MakerSpace` | Filter by lab wing (category) |
| `status` | `available` | `available` or `maintenance` |

Response `200`:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Digital Oscilloscope 50MHz",
      "equipmentId": "EQ-OSC-102",
      "status": "available",
      "lab": { "name": "Lab 102", "wing": "SOET Wing" },
      "date": "2026-11-05",
      "slots": [
        { "slot": "09:00-10:30", "booked": false },
        { "slot": "10:30-12:00", "booked": false },
        { "slot": "13:00-14:30", "booked": true },
        { "slot": "14:30-16:00", "booked": false }
      ]
    }
  ]
}
```
If `status` is `maintenance`, every slot is returned with `booked: true`.

### `GET /api/equipment/:id`: Student/Admin
Single item, same shape as one element above. `404` if not found.

### `POST /api/equipment`: Admin
```json
{ "name": "Logic Analyzer", "equipmentId": "EQ-LA-102", "lab": "<labId>", "status": "available" }
```
Response `201` with the created item. Errors: `400`, `409` (duplicate `equipmentId`).

### `PUT /api/equipment/:id`: Admin
Same body fields as POST (any subset). Response `200` with the updated item.

### `DELETE /api/equipment/:id`: Admin
Response `200`: `{ "success": true, "message": "Equipment deleted" }`. Also cancels that item's future active bookings.

---

## Bookings

### `POST /api/bookings`: Student
```json
{ "equipment": "<equipmentId (Mongo _id)>", "date": "2026-11-05", "slot": "10:30-12:00" }
```
The user comes from the session, never from the body.

Response `201`:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "equipment": { "_id": "...", "name": "Ender 3 V2 3D Printer", "equipmentId": "EQ-3D-204", "lab": { "name": "Lab 204", "wing": "MakerSpace" } },
    "date": "2026-11-05",
    "slot": "10:30-12:00",
    "status": "pending"
  },
  "message": "Booking created"
}
```
Errors: `400` bad date/slot or date in the past, `404` equipment not found, `409` slot already booked, `400` equipment under maintenance.

### `GET /api/bookings/me`: Student
The logged-in student's bookings, newest first. Response `200`: `{ "success": true, "data": [ <booking with populated equipment> ] }`

### `DELETE /api/bookings/:id`: Student
Cancels the student's **own** booking (sets `status: 'cancelled'`, `isActive: false`). `403` if it is not theirs, `404` if not found.

### `GET /api/bookings`: Admin
All bookings, with the student and equipment populated.
Query params (optional): `status`, `date`, `equipment` (id), `search` (student name or roll number).
Response `200`:
```json
{
  "success": true,
  "data": [
    { "_id": "...", "user": { "name": "Shubham Patel", "rollNumber": "230766" }, "equipment": { "name": "Ender 3 V2 3D Printer", "equipmentId": "EQ-3D-204" }, "date": "2026-11-05", "slot": "10:30-12:00", "status": "pending" }
  ]
}
```

### `PATCH /api/bookings/:id/status`: Admin
```json
{ "status": "approved" }
```
Allowed values: `approved`, `cancelled`. Response `200` with the updated booking. Cancelling also sets `isActive: false`.

---

## Admin stats and analytics

### `GET /api/admin/stats`: Admin
Numbers for the overview cards.
```json
{
  "success": true,
  "data": { "totalEquipment": 6, "underMaintenance": 1, "activeBookingsToday": 4, "totalStudents": 120 }
}
```

### `GET /api/admin/analytics`: Admin
Data for the analytics charts.
```json
{
  "success": true,
  "data": {
    "mostBooked": [ { "name": "Ender 3 V2 3D Printer", "count": 18 } ],
    "bookingsByWing": [ { "wing": "SOET Wing", "count": 32 } ]
  }
}
```

---

## Page routes (EJS views, served by Express)

| Route | View | Access |
|---|---|---|
| `GET /` or `/login` | `login.ejs` | Public (redirects to `/catalog` or `/admin` if already logged in) |
| `GET /catalog` | `catalog.ejs` | Student |
| `GET /admin` | `admin.ejs` | Admin |

---

## Frontend wiring (which file calls what)

| File | Calls |
|---|---|
| `login.js` | `POST /api/auth/login`, `POST /api/auth/register` |
| `catalog.js` | `GET /api/auth/me`, `GET /api/equipment` (search, wing, status, date), `GET /api/labs` |
| `booking.js` (or inside `catalog.js`) | `POST /api/bookings` |
| `admin.js` | `GET /api/admin/stats`, `GET/POST/PUT/DELETE /api/equipment`, `GET /api/bookings`, `PATCH /api/bookings/:id/status`, `GET /api/admin/analytics` |
